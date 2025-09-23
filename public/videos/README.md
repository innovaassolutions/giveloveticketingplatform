# Video Assets

Place your concert video files here:

## Recommended Video Specifications

### File Format
- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 (Full HD) minimum
- **Aspect Ratio**: 16:9
- **Frame Rate**: 30fps or 60fps

### Optimization
- **Bitrate**: 2-5 Mbps for web delivery
- **Duration**: 15-30 seconds per clip (for background loops)
- **Compression**: Use tools like HandBrake or FFmpeg

### File Naming Convention
```
concert-1.mp4 - Lady Gaga - The Chromatica Ball
concert-2.mp4 - Taylor Swift - Eras Tour
concert-3.mp4 - Ed Sheeran - Mathematics Tour
concert-4.mp4 - Coldplay - Music of the Spheres
```

## Video Sources

### Option 1: Stock Concert Footage
- **Pexels**: https://www.pexels.com/videos/search/concert/
- **Unsplash**: https://unsplash.com/s/videos/concert
- **Pixabay**: https://pixabay.com/videos/search/concert/

### Option 2: YouTube to MP4 (Legal/Fair Use Only)
- Use tools like `yt-dlp` for concert clips
- Ensure proper licensing and attribution
- Limit to 30-second clips for background use

### Option 3: Create Mock Videos
Use tools like:
- **DaVinci Resolve** (Free)
- **OpenShot** (Free)
- **Adobe Premiere Pro**

## Example FFmpeg Commands

### Convert and compress video:
```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart concert-1.mp4
```

### Create a loop from existing video:
```bash
ffmpeg -stream_loop 3 -i input.mp4 -c copy -t 30 concert-loop.mp4
```

### Resize video:
```bash
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:a copy output.mp4
```

## Fallback Image

If videos fail to load, the component will show:
`/public/images/concert-hero.jpg`

Ensure this image is high quality (1920x1080) and represents the concert atmosphere.