# Content Collections

This directory contains Astro content collections for the portfolio site.

## Projects Collection

Each project is stored as a separate JSON file in `src/content/projects/`. This makes it easy to add, update, or remove projects.

### Adding a New Project

1. Create a new JSON file in `src/content/projects/` (e.g., `09-new-project.json`)
2. Follow this schema:

```json
{
  "title": "Main Title",
  "subtitle": "Optional Subtitle",
  "description": "Project description goes here",
  "url": "https://example.com",
  "client": "Optional Client Name",
  "order": 9,
  "backgroundColor": "bg-yellow",
  "textColor": "text-dark",
  "tagBackgroundColor": "bg-dark/10",
  "tagTextColor": "text-dark",
  "technologies": ["Tech 1", "Tech 2", "Tech 3"],
  "content": [
    {
      "type": "image",
      "url": "https://example.com/image.jpg",
      "alt": "Image description",
      "colSpan": 7,
      "rowSpan": 2,
      "offset": false,
      "aspectRatio": "aspect-[16/10]"
    },
    {
      "type": "video",
      "url": "https://example.com/video.mp4",
      "alt": "Video description",
      "colSpan": 5,
      "rowSpan": 1,
      "autoplay": true,
      "muted": true,
      "loop": true,
      "controls": false,
      "poster": "https://example.com/video-poster.jpg"
    }
  ]
}
```

### Available Design Variables

**Background Colors:**
- `bg-yellow` - Yellow background
- `bg-orange` - Orange background
- `bg-green` - Green background
- `bg-pink` - Pink background
- `bg-purple` - Purple background
- `bg-beige` - Beige background
- `bg-dark` - Dark background
- `bg-blue` - Blue background
- `bg-cream` - Cream background

**Text Colors:**
- `text-dark` - Dark text (use with light backgrounds)
- `text-white` - White text (use with dark backgrounds)

**Tag Styles:**
For dark text projects:
- `tagBackgroundColor: "bg-dark/10"`
- `tagTextColor: "text-dark"`

For white text projects:
- `tagBackgroundColor: "bg-white/20"`
- `tagTextColor: "text-white"`

### Content Array (Images & Videos)

The `content` array supports both images and videos in a 12-column grid layout.

#### Content Types

**Image:**
```json
{
  "type": "image",
  "url": "/images/project.jpg",
  "alt": "Project screenshot",
  "colSpan": 7,
  "rowSpan": 2,
  "aspectRatio": "aspect-[16/10]"
}
```

**Video:**
```json
{
  "type": "video",
  "url": "/videos/project-demo.mp4",
  "alt": "Project demo video",
  "colSpan": 12,
  "rowSpan": 1,
  "autoplay": true,
  "muted": true,
  "loop": true,
  "controls": false,
  "poster": "/images/video-thumbnail.jpg",
  "aspectRatio": "aspect-[21/9]"
}
```

**Video Properties:**
- `autoplay` - Auto-play on load (default: `false`)
- `muted` - Mute audio (default: `true`)
- `loop` - Loop video (default: `true`)
- `controls` - Show video controls (default: `false`)
- `poster` - Thumbnail image before video loads (optional)

### Grid Layout

Use `colSpan` and `rowSpan` to control content placement:

**Common layouts:**
- Full width hero: `colSpan: 12, rowSpan: 1, aspectRatio: "aspect-[21/9] md:aspect-[21/9]"`
- Large featured: `colSpan: 7, rowSpan: 2`
- Medium: `colSpan: 5, rowSpan: 1`
- Small: `colSpan: 4, rowSpan: 2`
- Equal split: `colSpan: 6, rowSpan: 1`

**Offset:** Set `offset: true` to add a top margin on the image (creates a staggered effect)

### Updating a Project

Simply edit the corresponding JSON file in `src/content/projects/` and the changes will be reflected after rebuilding the site.

**Note on Placeholders:** The current projects use placeholder.co for demonstration. Replace these with your actual images and videos:

**Images:**
```json
{
  "type": "image",
  "url": "/images/my-project-hero.jpg",
  // Or use an external URL:
  "url": "https://your-cdn.com/project-image.jpg"
}
```

**Videos:**
```json
{
  "type": "video",
  "url": "/videos/demo.mp4",
  // Or use an external URL:
  "url": "https://your-cdn.com/demo.mp4",
  "poster": "/images/video-poster.jpg"
}
```

### Schema Validation

The schema is defined in `src/content/config.ts`. Astro will validate your content against this schema at build time and show helpful error messages if something is wrong.
