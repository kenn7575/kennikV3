"use server"

export type valueReason = {
  t: string
  b: string
}

const VALUES: valueReason[] = [
  {
    t: "Maintainable code",
    b: "I write code that your team can understand and maintain. No clever tricks, just clear, well-structured code that gets the job done.",
  },
  {
    t: "Data caching",
    b: "I use caching strategies to make your app faster, responsive and cheaper to run, even under heavy load. I can cache data at the edge, in memory, or wherever it makes sense for your project.",
  },
  {
    t: "Security best practices",
    b: "I follow security best practices to protect your app and your users. I can help you avoid common vulnerabilities, and I can review your code for security issues.",
  },
  {
    t: "Scalable architecture",
    b: "I design your app's architecture to be scalable and flexible, so it can grow with your business. I can help you choose the right technologies and patterns to make sure your app can handle increased traffic and complexity over time.",
  },
  {
    t: "Solid SEO",
    b: "I implement SEO best practices to help your app rank higher in search engine results. I can optimize your content, structure, and performance to improve visibility and drive more organic traffic.",
  },
  {
    t: "Not just a WordPress site",
    b: "I build custom solutions that go beyond the limitations of WordPress, providing you with unique and tailored features for your users.",
  },
]

export async function getValueReasons(): Promise<valueReason[]> {
  return VALUES
}
