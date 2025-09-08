#!/bin/bash

# Setup script for environment variables
echo "Setting up environment variables for Glitch UI..."

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_WS_BASE_URL=ws://127.0.0.1:8000
EOF
    echo "✅ Created .env.local file with default values"
else
    echo "⚠️  .env.local file already exists"
fi

echo ""
echo "Environment setup complete!"
echo "You can now modify .env.local to change the API and WebSocket URLs"
echo "Make sure to restart your development server after making changes"
