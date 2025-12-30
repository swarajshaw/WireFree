#!/bin/bash

# Script to initialize and run the WireFree Admin Portal

echo "Initializing WireFree Admin Portal..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema
echo "Pushing database schema..."
npx prisma db push

# Build the application
echo "Building the application..."
npm run build

# Start the application on port 6001
echo "Starting WireFree Admin Portal on port 6001..."
PORT=6001 npm run dev

echo "WireFree Admin Portal is now running on http://localhost:6001"
