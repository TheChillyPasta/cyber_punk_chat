// Environment configuration
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api",
  wsBaseUrl: process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://127.0.0.1:8000",
}
