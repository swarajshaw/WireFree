#!/bin/bash

# Setup script for WireFree Admin Portal

echo "Setting up WireFree Admin Portal..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "Pushing schema to database..."
npx prisma db push

# Build the application
echo "Building the application..."
npm run build

echo "Setup complete! You can now run the application with 'npm run dev'"
