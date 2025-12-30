#!/bin/bash

# Script to run the WireFree Admin Portal on port 6001

echo "Starting WireFree Admin Portal on port 6001..."

# Set the port environment variable
export PORT=6001

# Run the development server
echo "Running in development mode..."
npm run dev

# If you want to run in production mode instead, comment out the line above and uncomment the following:
# npm run build
# npm start

echo "WireFree Admin Portal is running on http://localhost:6001"
