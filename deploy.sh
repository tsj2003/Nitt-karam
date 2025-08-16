#!/bin/bash

# 🚀 Nitt Karam Deployment Script
echo "🚀 Starting Nitt Karam deployment..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if Vercel is installed
    if command -v vercel &> /dev/null; then
        echo "🌐 Deploying to Vercel..."
        vercel --prod
    else
        echo "📋 Vercel CLI not found. Installing..."
        npm install -g vercel
        echo "🌐 Deploying to Vercel..."
        vercel --prod
    fi
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Deployment complete!"
echo "📱 Your app is now live!"
