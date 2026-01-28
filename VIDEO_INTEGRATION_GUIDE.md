# 🎥 Video Integration Guide - FoodVely Blog

## Current Implementation

The blog details page includes an embedded YouTube video player using iframe. Here's how to customize it:

---

## ✅ Quick Setup (Current Default)

The video is already configured in `[slug]/page.tsx`:

```tsx
<iframe
  width="100%"
  height="100%"
  src="https://www.youtube.com/embed/9bZkp7q19f0"
  title={blog.title}
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="absolute inset-0"
></iframe>
```

**Current Video:** Popular food recipe video  
**Video ID:** `9bZkp7q19f0`

---

## 📺 Platform-Specific Instructions

### 1. **YouTube Videos** (Recommended)

**Getting Video ID:**
1. Open YouTube video
2. Copy URL: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Extract the ID after `v=`

**Implementation:**
```tsx
<iframe
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="Blog Title"
  // ... rest of props
/>
```

**Examples:**
- Short form: `https://www.youtube.com/embed/dQw4w9WgXcQ`
- Playlist: `https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID`
- Start at timestamp: `https://www.youtube.com/embed/dQw4w9WgXcQ?start=45`

---

### 2. **Vimeo Videos**

**Getting Video ID:**
1. Open Vimeo video
2. Copy URL: `https://vimeo.com/VIDEO_ID`
3. Extract the number

**Implementation:**
```tsx
<iframe
  src="https://player.vimeo.com/video/123456789"
  title="Blog Title"
  allow="autoplay; fullscreen; picture-in-picture"
  // ... rest of props
/>
```

---

### 3. **Self-Hosted Videos**

**For MP4 files hosted on your server:**

```tsx
<video 
  width="100%" 
  height="100%" 
  controls 
  className="absolute inset-0"
>
  <source 
    src="/videos/recipe-demo.mp4" 
    type="video/mp4" 
  />
  Your browser does not support the video tag.
</video>
```

**Or with HLS streaming:**
```tsx
<video 
  width="100%" 
  height="100%" 
  controls
>
  <source 
    src="https://cdn.example.com/videos/recipe.m3u8" 
    type="application/x-mpegURL" 
  />
</video>
```

---

## 🔧 Advanced: Dynamic Videos from Blog Data

### Step 1: Update blogs.json

Add `videoUrl` field to blog entries:

```json
{
  "id": "blog_001",
  "title": "Best Pizza Recipe",
  "slug": "best-pizza-recipe",
  // ... other fields ...
  "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
}
```

### Step 2: Update Blog Type

```typescript
interface Blog {
  // ... existing fields ...
  videoUrl?: string; // Add this field
}
```

### Step 3: Update Component

```tsx
{/* Video Section - Use dynamic URL from blog data */}
{blog.videoUrl && (
  <motion.div
    className="mb-12 bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-lg"
  >
    <h2 className="text-2xl font-Sofia font-bold text-gray-800 mb-4 flex items-center gap-2">
      📹 Video Recipe & Demonstration
    </h2>
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={blog.videoUrl} // Use blog.videoUrl instead of hardcoded URL
        title={blog.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0"
      ></iframe>
    </div>
    <p className="mt-4 text-sm text-gray-600">
      Watch this video to see step-by-step instructions for {blog.title.toLowerCase()}
    </p>
  </motion.div>
)}
```

---

## 🎯 Common Video Sources & URLs

### YouTube
| Type | URL Format |
|------|-----------|
| Regular video | `https://www.youtube.com/embed/{VIDEO_ID}` |
| Playlist | `https://www.youtube.com/embed/videoseries?list={LIST_ID}` |
| With start time | `https://www.youtube.com/embed/{VIDEO_ID}?start=120` |

### Vimeo
| Type | URL Format |
|------|-----------|
| Regular video | `https://player.vimeo.com/video/{VIDEO_ID}` |
| With chapters | `https://player.vimeo.com/video/{VIDEO_ID}/chapters` |

### Others
| Platform | URL Format |
|----------|-----------|
| Dailymotion | `https://www.dailymotion.com/embed/video/{VIDEO_ID}` |
| Bilibili | `https://player.bilibili.com/player.html?bvid={BVID}` |
| Wistia | `https://home.wistia.com/medias/{MEDIA_ID}` |

---

## ⚙️ Iframe Attributes Explained

```tsx
<iframe
  width="100%"              // Full width container
  height="100%"             // Full height container
  src="VIDEO_URL"           // Video source
  title="Description"       // Accessibility label
  frameBorder="0"           // Remove border
  allow="..."              // Permissions (see below)
  allowFullScreen          // Allow fullscreen mode
  className="..."          // Tailwind styling
></iframe>
```

### Allow Attributes for YouTube
```tsx
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
```

- **accelerometer** - Device motion sensor
- **autoplay** - Play on page load
- **clipboard-write** - Copy video URL to clipboard
- **encrypted-media** - DRM content (Netflix-style)
- **gyroscope** - Device rotation
- **picture-in-picture** - Floating video mode

### Allow Attributes for Vimeo
```tsx
allow="autoplay; fullscreen; picture-in-picture"
```

---

## 🎨 Custom Styling Examples

### Make video responsive with aspect ratio
```tsx
<div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
  <iframe
    src="VIDEO_URL"
    className="absolute inset-0 w-full h-full"
    // ... other props
  />
</div>
```

### Add rounded corners
```tsx
<iframe
  className="rounded-3xl"
  // ... other props
/>
```

### Add shadow/border
```tsx
<div className="rounded-3xl shadow-lg border border-white/20 overflow-hidden">
  <iframe
    src="VIDEO_URL"
    className="w-full h-full"
    // ... other props
  />
</div>
```

---

## 🔐 Privacy & Consent

### For GDPR Compliance

Add cookie consent check before loading YouTube:

```tsx
{blog.videoUrl && userConsentedToYouTube && (
  <iframe src={blog.videoUrl} /* ... */ />
)}
```

### Alternative: Thumbnail with Play Button

```tsx
<div 
  onClick={() => setShowVideo(true)}
  className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden cursor-pointer group"
>
  <Image 
    src={blog.thumbnail} 
    fill 
    className="object-cover"
  />
  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
      <Play size={40} fill="black" />
    </div>
  </div>
</div>

{showVideo && (
  <iframe src={blog.videoUrl} /* ... */ />
)}
```

---

## ✅ Testing Checklist

- [ ] Video loads without errors
- [ ] Video plays on click
- [ ] Video is responsive (scales with container)
- [ ] Video can go fullscreen
- [ ] Sound works
- [ ] Video controls visible
- [ ] Works on mobile
- [ ] Works on tablets
- [ ] Works on desktop

---

## 🐛 Troubleshooting

### Video won't load
- Check VIDEO_ID is correct
- Check iframe src URL is properly formatted
- Check allow attributes are correct
- Check browser console for errors

### Video is embedded but won't play
- Add `allow="autoplay"`
- Check browser autoplay policies
- Verify iframe allow attribute

### Video looks stretched
- Use `aspect-video` class
- Ensure container is `relative`
- Set iframe to `absolute inset-0`

### Video is not responsive
- Wrap in `relative w-full aspect-video`
- Set iframe width/height to "100%"
- Use `absolute inset-0` on iframe

---

## 📚 Resources

- [YouTube Embed Guide](https://support.google.com/youtube/answer/171780)
- [Vimeo Embed Guide](https://vimeo.zendesk.com/hc/en-us/articles/224969968)
- [HTML5 Video Guide](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [Aspect Ratio CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)

---

**Last Updated:** January 29, 2026  
**Status:** Ready for Implementation
