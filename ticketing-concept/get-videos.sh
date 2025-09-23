#!/bin/bash

# Quick script to download free concert videos from Pexels
# Make sure you have curl installed

echo "🎵 Downloading free concert videos..."

# Create directories
mkdir -p public/videos
mkdir -p public/images

# Download concert videos from Pexels (these are free to use)
echo "📥 Downloading concert video 1..."
curl -L "https://videos.pexels.com/video-files/3771787/3771787-uhd_1440_2560_30fps.mp4" -o public/videos/concert-1.mp4

echo "📥 Downloading concert video 2..."
curl -L "https://videos.pexels.com/video-files/2022395/2022395-uhd_1440_2560_30fps.mp4" -o public/videos/concert-2.mp4

echo "📥 Downloading concert video 3..."
curl -L "https://videos.pexels.com/video-files/3943720/3943720-uhd_1440_2560_30fps.mp4" -o public/videos/concert-3.mp4

echo "📥 Downloading concert video 4..."
curl -L "https://videos.pexels.com/video-files/4670239/4670239-uhd_1440_2560_30fps.mp4" -o public/videos/concert-4.mp4

echo "📸 Downloading fallback image..."
curl -L "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg" -o public/images/concert-hero.jpg

echo "✅ Done! Videos downloaded to public/videos/"
echo "🎬 Now switch back to VideoBackground component in page.tsx"