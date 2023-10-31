export default function generateResponse(
  body: {
    [key: string]: any
  },
  meta?: {
    [key: string]: any
  },
) {
  const obj = {
    meta: meta || {},
    ...body,
  }

  return obj
}
