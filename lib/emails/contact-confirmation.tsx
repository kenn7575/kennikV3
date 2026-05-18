import * as React from "react"

type Props = {
  name: string
  project: string
}

export function ContactConfirmationEmail({ name, project }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          backgroundColor: "#08090F",
          margin: 0,
          padding: 0,
          fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ backgroundColor: "#08090F", padding: "48px 16px" }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ maxWidth: 560 }}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td
                        style={{
                          paddingBottom: 32,
                          borderBottom: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Geist Mono', 'Courier New', monospace",
                            fontSize: 13,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#94AEFF",
                          }}
                        >
                          KENNIK.DK
                        </span>
                      </td>
                    </tr>

                    {/* Body card */}
                    <tr>
                      <td style={{ paddingTop: 32 }}>
                        <table
                          width="100%"
                          cellPadding={0}
                          cellSpacing={0}
                          style={{
                            backgroundColor: "#10121A",
                            border: "1px solid rgba(90,130,251,0.4)",
                            borderRadius: 18,
                            padding: "36px 36px 32px",
                          }}
                        >
                          <tbody>
                            {/* Eyebrow */}
                            <tr>
                              <td style={{ paddingBottom: 20 }}>
                                <span
                                  style={{
                                    fontFamily: "'Geist Mono', 'Courier New', monospace",
                                    fontSize: 12,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#94AEFF",
                                    backgroundColor: "rgba(90,130,251,0.12)",
                                    border: "1px solid rgba(90,130,251,0.3)",
                                    borderRadius: 6,
                                    padding: "5px 12px",
                                    display: "inline-block",
                                  }}
                                >
                                  MESSAGE RECEIVED
                                </span>
                              </td>
                            </tr>

                            {/* Heading */}
                            <tr>
                              <td style={{ paddingBottom: 20 }}>
                                <h1
                                  style={{
                                    fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif",
                                    fontSize: 42,
                                    fontWeight: 400,
                                    lineHeight: 1.08,
                                    letterSpacing: "-0.03em",
                                    color: "#F4F5F8",
                                    margin: 0,
                                  }}
                                >
                                  Thanks{" "}
                                  <em
                                    style={{
                                      fontStyle: "italic",
                                      color: "#C7D5FF",
                                    }}
                                  >
                                    for reaching out,
                                  </em>{" "}
                                  {name}.
                                </h1>
                              </td>
                            </tr>

                            {/* Body text */}
                            <tr>
                              <td style={{ paddingBottom: 20 }}>
                                <p
                                  style={{
                                    fontSize: 17,
                                    lineHeight: 1.7,
                                    color: "#C7D5FF",
                                    margin: 0,
                                  }}
                                >
                                  I got your message about{" "}
                                  <strong
                                    style={{
                                      color: "#F4F5F8",
                                      fontWeight: 500,
                                    }}
                                  >
                                    &ldquo;{project}&rdquo;
                                  </strong>{" "}
                                  and I&apos;ll get back to you within a day or so.
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ paddingBottom: 32 }}>
                                <p
                                  style={{
                                    fontSize: 17,
                                    lineHeight: 1.7,
                                    color: "#C7D5FF",
                                    margin: 0,
                                  }}
                                >
                                  In the meantime, feel free to reply to this email
                                  if you&apos;d like to share anything else — a
                                  brief, a repo, a deadline. More context always
                                  helps.
                                </p>
                              </td>
                            </tr>

                            {/* Divider */}
                            <tr>
                              <td
                                style={{
                                  borderTop: "1px solid rgba(255,255,255,0.1)",
                                  paddingTop: 24,
                                  paddingBottom: 8,
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: 17,
                                    color: "#F4F5F8",
                                    margin: 0,
                                  }}
                                >
                                  — Kenni
                                </p>
                                <p
                                  style={{
                                    fontSize: 14,
                                    color: "#8A8F9F",
                                    margin: "6px 0 0",
                                    fontFamily: "'Geist Mono', 'Courier New', monospace",
                                    letterSpacing: "0.04em",
                                  }}
                                >
                                  info@kennik.dk · kennik.dk
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ paddingTop: 28, textAlign: "center" }}>
                        <p
                          style={{
                            fontFamily: "'Geist Mono', 'Courier New', monospace",
                            fontSize: 12,
                            letterSpacing: "0.08em",
                            color: "#5C6273",
                            margin: 0,
                          }}
                        >
                          You received this because you submitted the contact form at kennik.dk
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}
