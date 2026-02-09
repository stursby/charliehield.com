# Project Generator

This script automatically generates complete project configurations including CSS grid layouts and color themes based on project images.

## How It Works

1. **Store your project images**: Place all images for a project in a directory under `/public/`
2. **Add `imagesPath` to project JSON**: Point to the directory containing the images
3. **Run the generator**: Execute `npm run generate-projects`
4. **The script will**:
   - Scan all images in the specified directory
   - Analyze their dimensions
   - Generate appropriate grid column/row spans based on aspect ratios
   - Calculate optimal aspect ratio classes for Tailwind
   - **Extract dominant colors** from the first image
   - **Auto-generate color scheme** (background, text, and tag colors)
   - Update the project's configuration automatically

## Image Size Mapping (12-column grid)

The script intelligently maps image dimensions to CSS grid sizes:

- **Ultra-wide** (ratio > 2.5): 12 cols × 1 row (full width)
- **Wide landscape** (ratio > 1.6): 8 cols × 1 row
- **Standard landscape** (ratio > 1.2): 7 cols × 1 row
- **Square-ish** (ratio 0.8-1.2): 6 cols × 1 row
- **Portrait** (ratio 0.6-0.8): 5 cols × 2 rows
- **Tall portrait** (ratio < 0.6): 4 cols × 2 rows

## Aspect Ratio Classes

Automatically assigns Tailwind aspect ratio classes:
- `aspect-[21/9]` - Ultra-wide
- `aspect-video` - 16:9
- `aspect-[16/10]` - Standard landscape
- `aspect-[4/3]` - Classic
- `aspect-square` - 1:1
- `aspect-[3/4]`, `aspect-[9/16]` - Portrait

## Color Extraction

The script uses **node-vibrant** to extract the dominant color palette from the first image:
- Finds the most vibrant/dominant color
- Maps it to the closest Tailwind color class
- Determines if the color is light or dark
- Automatically sets contrasting text colors
- Configures tag colors for optimal readability

**Generated color properties:**
- `backgroundColor`: Main project section background
- `textColor`: Primary text color (auto-contrasted)
- `tagBackgroundColor`: Technology tag background
- `tagTextColor`: Technology tag text color

## Usage Example

### 1. Organize your images

```
public/
  └── images/
      └── project-name/
          ├── hero.png
          ├── detail-1.jpg
          └── detail-2.jpg
```

### 2. Update project JSON

```json
{
  "title": "My Project",
  "imagesPath": "/images/project-name",
  ...other fields...
}
```

### 3. Generate project configuration

```bash
npm run generate-projects
```

The script will automatically:
- Read all images from `/public/images/project-name/`
- Analyze their dimensions
- Generate the `content` array with appropriate sizes
- Extract colors from the first image
- Set background and text colors based on the color palette
- Save the updated JSON with complete theme configuration

## Notes

- Images are processed in alphabetical order
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` (SVG not supported for color extraction)
- The script preserves all other project data (title, description, etc.)
- Alt text is auto-generated from filename (with extensions and special chars removed)
- Colors are extracted from the **first image** in the directory
- To update layouts and colors, simply re-run `npm run generate-projects`
- You can manually override generated colors by editing the JSON file
