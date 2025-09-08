# Environment Configuration

This project uses environment variables for API and WebSocket configuration.

## Setup

1. Create a `.env.local` file in the `glitch-ui` directory
2. Add the following environment variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_WS_BASE_URL=ws://127.0.0.1:8000
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for the backend API (default: `http://127.0.0.1:8000/api`)
- `NEXT_PUBLIC_WS_BASE_URL`: The base URL for the WebSocket connection (default: `ws://127.0.0.1:8000`)

## Notes

- The `NEXT_PUBLIC_` prefix is required for Next.js to expose these variables to the client-side code
- If environment variables are not set, the application will use the default localhost values
- Make sure to restart the development server after changing environment variables
