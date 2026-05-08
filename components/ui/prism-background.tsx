"use client"

import { useEffect, useRef } from "react"

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uHueShift;
uniform float uColorFreq;
uniform float uNoise;
uniform float uGlow;
uniform float uHeight;
uniform float uBaseWidth;
uniform float uTimeScale;

mat3 rotX(float a){ float c=cos(a),s=sin(a); return mat3(1,0,0, 0,c,-s, 0,s,c); }
mat3 rotY(float a){ float c=cos(a),s=sin(a); return mat3(c,0,s, 0,1,0, -s,0,c); }
mat3 rotZ(float a){ float c=cos(a),s=sin(a); return mat3(c,-s,0, s,c,0, 0,0,1); }

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }

float sdOctahedron(vec3 p, float s){
  p = abs(p);
  float m = p.x + p.y + p.z - s;
  vec3 q;
       if (3.0*p.x < m) q = p.xyz;
  else if (3.0*p.y < m) q = p.yzx;
  else if (3.0*p.z < m) q = p.zxy;
  else return m * 0.57735027;
  float k = clamp(0.5*(q.z - q.y + s), 0.0, s);
  return length(vec3(q.x, q.y - s + k, q.z - k));
}

float map(vec3 p){
  float t = uTime * uTimeScale;
  float spin = t * 0.45;
  mat3 R = rotY(spin) * rotX(0.42 + sin(t*0.31)*0.15) * rotZ(t*0.18 + uMouse.x*0.6);
  vec3 q = R * p;
  q.y *= 0.6 / max(uHeight, 0.01);
  q.xz *= 1.0 / max(uBaseWidth, 0.01);
  return sdOctahedron(q, 1.0) * min(uHeight, uBaseWidth);
}

vec3 calcNormal(vec3 p){
  const float e = 0.0008;
  vec2 k = vec2(1, -1);
  return normalize(
    k.xyy * map(p + k.xyy*e) +
    k.yyx * map(p + k.yyx*e) +
    k.yxy * map(p + k.yxy*e) +
    k.xxx * map(p + k.xxx*e)
  );
}

vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz)*6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 background(vec3 d){
  float t = uTime * uTimeScale;
  float v = d.y * 0.5 + 0.5;
  vec3 sky = mix(vec3(0.005, 0.008, 0.022), vec3(0.01, 0.04, 0.18), pow(v, 1.4));
  float sun = pow(max(0.0, dot(d, vec3(0.2, 0.7, 0.7))), 18.0);
  sky += vec3(0.02, 0.18, 0.85) * sun * 0.6;
  float ring = smoothstep(0.02, 0.0, abs(d.y - 0.05));
  sky += hsv2rgb(vec3(0.6 + sin(d.x*4.0 + t*0.4)*0.08, 0.9, 0.5)) * ring * 0.05;
  return sky;
}

vec3 sampleDispersion(vec3 ro, vec3 rd, vec3 n){
  float t = uTime * uTimeScale;
  vec3 col = vec3(0.0);
  const int N = 12;
  for (int i = 0; i < N; i++){
    float fi = (float(i) + 0.5) / float(N);
    float ior = mix(1.42, 1.62, fi);
    vec3 r = refract(rd, n, 1.0 / ior);
    if (length(r) < 0.001) r = reflect(rd, n);
    vec3 p2 = ro + r * 1.2;
    float d2 = map(p2);
    vec3 n2 = -calcNormal(p2);
    vec3 r2 = refract(r, n2, ior);
    if (length(r2) < 0.001) r2 = r;
    vec3 hue = hsv2rgb(vec3(mod(0.66 + fi + uHueShift + t*0.04, 1.0), 1.0, 1.0));
    vec3 sky = background(normalize(r2));
    float w = exp(-pow((fi - 0.5)*2.2, 2.0));
    col += hue * (sky.r + sky.g + sky.b) * 0.7 * w;
  }
  col /= float(N) * 0.55;
  return col;
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 res = uRes;
  vec2 uv = (fc - res*0.5) / res.y;
  vec2 m = uMouse;
  vec3 ro = vec3(m.x*0.3, m.y*0.2, -3.6);
  vec3 rd = normalize(vec3(uv, 1.6));
  float t = 0.0;
  bool hit = false;
  for (int i = 0; i < 96; i++){
    vec3 p = ro + rd * t;
    float d = map(p);
    if (d < 0.0008){ hit = true; break; }
    if (t > 18.0) break;
    t += d * 0.92;
  }
  vec3 col = background(rd);
  if (hit){
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);
    vec3 disp = sampleDispersion(p, rd, n);
    float fres = pow(1.0 - max(0.0, dot(n, -rd)), 3.0);
    vec3 rim = mix(vec3(0.05, 0.4, 1.0), vec3(0.7, 0.3, 1.0), uHueShift);
    vec3 L = normalize(vec3(0.4, 0.9, -0.3));
    float spec = pow(max(0.0, dot(reflect(rd, n), L)), 80.0);
    col = disp * 0.85 + rim * fres * 0.9 + vec3(spec) * 0.6;
    col += hsv2rgb(vec3(mod(0.6 + n.y*0.3 + uTime*0.05, 1.0), 0.9, 0.5)) * 0.18;
    col *= uColorFreq;
  }
  float vig = smoothstep(1.4, 0.4, length(uv));
  col *= mix(0.55, 1.0, vig);
  col = col * (1.0 + uGlow);
  col = pow(col, vec3(0.94));
  float g = (hash(fc + uTime*60.0) - 0.5) * uNoise;
  col += g;
  outColor = vec4(col, 1.0);
}
`

type PrismBackgroundProps = {
  height?: number
  baseWidth?: number
  hueShift?: number
  colorFreq?: number
  glow?: number
  noise?: number
  timeScale?: number
}

export function PrismBackground({
  height = 1.4,
  baseWidth = 1.0,
  hueShift = 0,
  colorFreq = 1.1,
  glow = 0.35,
  noise = 0.025,
  timeScale = 0.5,
}: PrismBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      powerPreference: "high-performance",
      alpha: true,
    })

    if (!gl) {
      canvas.style.background = "var(--mesh)"
      return
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(sh))
        return null
      }
      return sh
    }

    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Link error:", gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes       = gl.getUniformLocation(prog, "uRes")
    const uTime      = gl.getUniformLocation(prog, "uTime")
    const uMouse     = gl.getUniformLocation(prog, "uMouse")
    const uHueShift  = gl.getUniformLocation(prog, "uHueShift")
    const uColorFreq = gl.getUniformLocation(prog, "uColorFreq")
    const uNoise     = gl.getUniformLocation(prog, "uNoise")
    const uGlow      = gl.getUniformLocation(prog, "uGlow")
    const uHeight    = gl.getUniformLocation(prog, "uHeight")
    const uBaseWidth = gl.getUniformLocation(prog, "uBaseWidth")
    const uTimeScale = gl.getUniformLocation(prog, "uTimeScale")

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
    let w = 0, h = 0

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = Math.floor(r.width * dpr)
      h = Math.floor(r.height * dpr)
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    let mx = 0, my = 0, tmx = 0, tmy = 0

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      tmx = ((e.clientX - r.left) / r.width) * 2 - 1
      tmy = -(((e.clientY - r.top) / r.height) * 2 - 1)
    }
    window.addEventListener("mousemove", onMove)

    const t0 = performance.now()
    let raf = 0

    const tick = () => {
      const t = (performance.now() - t0) / 1000
      mx += (tmx - mx) * 0.06
      my += (tmy - my) * 0.06
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uTime, t)
      gl.uniform2f(uMouse, mx, my)
      gl.uniform1f(uHueShift, hueShift)
      gl.uniform1f(uColorFreq, colorFreq)
      gl.uniform1f(uNoise, noise)
      gl.uniform1f(uGlow, glow)
      gl.uniform1f(uHeight, height)
      gl.uniform1f(uBaseWidth, baseWidth)
      gl.uniform1f(uTimeScale, timeScale)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      ro.disconnect()
    }
  }, [height, baseWidth, hueShift, colorFreq, glow, noise, timeScale])

  return <canvas ref={canvasRef} className="prism-canvas" />
}
