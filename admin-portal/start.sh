#!/bin/bash

# Startup script for WireFree Admin Portal
# This script ensures the application runs on port 6001

echo "Starting WireFree Admin Portal on port 6001..."

# Set the port environment variable
export PORT=6001

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma db push

# Build the application
echo "Building the application..."
npm run build

# Start the application
echo "Starting WireFree Admin Portal..."
npm start

echo "WireFree Admin Portal is now running on http://localhost:6001"
