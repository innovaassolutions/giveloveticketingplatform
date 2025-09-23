# Hero Video Background Setup Guide

## ✅ Implementation Complete

The video background system is now implemented with the following features:

### 🎬 VideoBackground Component (`/src/components/VideoBackground.tsx`)

**Features:**
- **Multiple Video Playlist**: Cycles through 4 concert videos automatically
- **Interactive Controls**: Play/pause, mute/unmute, video selection
- **Responsive Design**: Works on all screen sizes
- **Fallback Support**: Shows image if videos fail to load
- **Accessibility**: Proper ARIA labels and keyboard support

**Current Video Playlist:**
1. Lady Gaga - The Chromatica Ball
2. Taylor Swift - Eras Tour
3. Ed Sheeran - Mathematics Tour
4. Coldplay - Music of the Spheres

### 🎨 Enhanced Landing Page

**Visual Improvements:**
- **Video Background**: Full-screen concert footage
- **Improved Contrast**: Backdrop blur and shadows for text readability
- **Professional Overlay**: Gradient overlay for cinematic effect
- **Responsive Text**: Scales beautifully on all devices

## 📁 File Structure

```
public/
├── videos/
│   ├── concert-1.mp4    # Lady Gaga concert
│   ├── concert-2.mp4    # Taylor Swift show
│   ├── concert-3.mp4    # Ed Sheeran live
│   └── concert-4.mp4    # Coldplay performance
├── images/
│   └── concert-hero.jpg # Fallback image
src/components/
├── VideoBackground.tsx  # Full-featured video component
└── CSSVideoBackground.tsx # Lightweight CSS-only version
```

## 🚀 Getting Concert Videos

### Option 1: Free Stock Footage (Recommended)
**Pexels (Free):** https://www.pexels.com/videos/search/concert/
- Search: "concert", "music festival", "stage lights"
- Download 1920x1080 MP4 files
- No attribution required

**Pixabay (Free):** https://pixabay.com/videos/search/concert/
- High-quality concert footage
- Free for commercial use

**Unsplash (Free):** https://unsplash.com/s/videos/concert
- Professional concert videos
- Free license

### Option 2: Create Mock Videos
**Tools:**
- **DaVinci Resolve** (Free) - Professional editing
- **OpenShot** (Free) - Simple editing
- **Canva** (Free tier) - Template-based videos

### Option 3: Use Placeholder Videos
For development, you can use any video and rename it to match the expected filenames.

## ⚙️ Video Optimization

### Recommended Specs:
- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 (Full HD)
- **Duration**: 15-30 seconds (for smooth loops)
- **Bitrate**: 2-5 Mbps (balance quality/size)
- **Frame Rate**: 30fps

### FFmpeg Commands:

**Compress video:**
```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart concert-1.mp4
```

**Create 30-second loop:**
```bash
ffmpeg -i input.mp4 -t 30 -c copy concert-loop.mp4
```

**Resize to 1080p:**
```bash
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:a copy output.mp4
```

## 🎮 Controls & Features

### User Controls (Hover to Show):
- ▶️ **Play/Pause**: Toggle video playback
- 🔊 **Mute/Unmute**: Control audio
- 📹 **Video Selector**: Click dots to switch videos
- 🏷️ **Video Title**: Shows current video info

### Auto Features:
- **Auto-cycle**: Videos automatically advance
- **Preload**: Next video loads in background
- **Fallback**: Shows image if video fails
- **Mobile Optimized**: Reduced controls on mobile

## 🔄 Alternative Implementation

If you prefer a simpler CSS-only approach, use `CSSVideoBackground`:

```tsx
import CSSVideoBackground from '@/components/CSSVideoBackground';

// Simple single video background
<CSSVideoBackground
  videoSrc="/videos/main-concert.mp4"
  fallbackImage="/images/concert-hero.jpg"
/>
```

## 🌐 Browser Support

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari (Full support)
- ✅ Mobile browsers (Auto-optimized)

## 📱 Mobile Considerations

- Videos auto-mute on mobile (browser requirement)
- Reduced control UI for smaller screens
- Fallback image loads faster on slow connections
- Touch-friendly controls

## 🎯 Next Steps

1. **Add Videos**: Place 4 concert videos in `/public/videos/`
2. **Add Fallback**: Place hero image in `/public/images/concert-hero.jpg`
3. **Test**: Visit http://localhost:3001 to see the effect
4. **Customize**: Modify video list in `/src/app/page.tsx`

## 🎨 Customization Options

**Change Videos:**
```tsx
videos={[
  { src: '/videos/your-video.mp4', type: 'video/mp4', title: 'Your Concert' }
]}
```

**Disable Controls:**
```tsx
<VideoBackground
  autoPlay={true}
  muted={true}
  // Remove hover controls by modifying component
/>
```

**Single Video Mode:**
```tsx
<VideoBackground
  videos={[{ src: '/videos/single.mp4', type: 'video/mp4', title: 'Concert' }]}
  loop={true}
/>
```

The video background system is production-ready and will create an immersive concert atmosphere for your landing page! 🎵✨