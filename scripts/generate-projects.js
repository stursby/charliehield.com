import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import sizeOf from 'image-size'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Vibrant } from 'node-vibrant/node'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectsDir = join(__dirname, '../src/content/projects')
const publicDir = join(__dirname, '../public')

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

// Function to determine if a color is light or dark
function isLightColor(rgb) {
  // Calculate relative luminance
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255
  return luminance > 0.5
}

// Function to check if a color is neutral (gray, beige, white, black)
function isNeutralColor(rgb) {
  const [r, g, b] = rgb

  // Check if color is too close to gray (all channels similar)
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b))
  if (maxDiff < 30) return true // Too gray

  // Check if color is too light (close to white)
  if (r > 220 && g > 220 && b > 220) return true

  // Check if color is too dark (close to black)
  if (r < 40 && g < 40 && b < 40) return true

  return false
}

// Function to calculate color vibrancy score
function getVibrancyScore(rgb, hsl) {
  const [r, g, b] = rgb
  const [h, s, l] = hsl

  // Prefer high saturation
  let score = s * 100

  // Prefer medium lightness (not too dark, not too light)
  const lightnessScore = 100 - Math.abs(l - 0.5) * 200
  score += lightnessScore * 0.5

  // Boost score for non-neutral colors
  if (!isNeutralColor([r, g, b])) {
    score += 50
  }

  return score
}

// Function to extract colors from first image using node-vibrant
async function extractColorsFromImage(imagePath) {
  const fullPath = join(publicDir, imagePath)

  try {
    const palette = await Vibrant.from(fullPath).getPalette()

    // Prioritize vibrant colors over muted ones
    const swatchPriority = [
      palette.Vibrant,
      palette.LightVibrant,
      palette.DarkVibrant,
      palette.Muted,
      palette.LightMuted,
      palette.DarkMuted
    ]

    let bestSwatch = null
    let bestScore = 0

    for (const swatch of swatchPriority) {
      if (!swatch) continue

      const rgb = swatch.rgb
      const hsl = swatch.hsl

      // Skip neutral colors
      if (isNeutralColor(rgb)) {
        continue
      }

      // Skip very low saturation
      if (hsl[1] < 0.2) {
        continue
      }

      const score = getVibrancyScore(rgb, hsl)

      if (score > bestScore) {
        bestScore = score
        bestSwatch = swatch
      }
    }

    // If no vibrant color found, use the first available swatch
    if (!bestSwatch) {
      bestSwatch = swatchPriority.find(s => s !== null)
    }

    if (!bestSwatch) {
      return null
    }

    const hex = bestSwatch.hex
    const rgb = bestSwatch.rgb
    const isLight = isLightColor(rgb)

    // Get complementary/contrasting colors from the palette for tags
    const tagSwatch = isLight ? palette.DarkMuted || palette.DarkVibrant : palette.LightMuted || palette.LightVibrant
    const tagColor = tagSwatch ? tagSwatch.hex : (isLight ? '#1F2937' : '#F3F4F6')

    console.log(`    Background: ${hex}`)
    console.log(`    Text: ${isLight ? '#1F2937' : '#FFFFFF'}`)
    console.log(`    Tag: ${tagColor}`)
    console.log(`    Population: ${bestSwatch.population}`)

    return {
      backgroundColor: hex,
      textColor: isLight ? '#1F2937' : '#FFFFFF',
      tagBackgroundColor: `${tagColor}1A`, // 10% opacity
      tagTextColor: isLight ? '#1F2937' : '#FFFFFF'
    }
  } catch (error) {
    console.error(`    ✗ Error extracting colors:`, error.message)
    return null
  }
}

// Function to get CSS grid dimensions based on image aspect ratio
function getGridDimensions(width, height) {
  const aspectRatio = width / height

  // Very wide landscape images (ultra-wide)
  if (aspectRatio > 2.5) {
    return { colSpan: 12, rowSpan: 1 } // Full width, short
  }
  // Wide landscape images
  else if (aspectRatio > 1.6) {
    return { colSpan: 8, rowSpan: 1 } // Large horizontal
  }
  // Standard landscape
  else if (aspectRatio > 1.2) {
    return { colSpan: 7, rowSpan: 1 } // Medium landscape
  }
  // Square or near-square images
  else if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
    return { colSpan: 6, rowSpan: 1 } // Square-ish
  }
  // Portrait images
  else if (aspectRatio < 0.8 && aspectRatio > 0.6) {
    return { colSpan: 5, rowSpan: 2 } // Tall portrait
  }
  // Very tall portrait
  else if (aspectRatio <= 0.6) {
    return { colSpan: 4, rowSpan: 2 } // Very tall
  }
  // Default
  else {
    return { colSpan: 6, rowSpan: 1 }
  }
}

// Function to calculate aspect ratio class
function getAspectRatioClass(width, height) {
  const aspectRatio = width / height

  // Round to common aspect ratios
  if (aspectRatio > 2.3) return 'aspect-[21/9]'
  if (aspectRatio > 2.0) return 'aspect-[2/1]'
  if (aspectRatio > 1.7) return 'aspect-video' // 16:9
  if (aspectRatio > 1.4) return 'aspect-[16/10]'
  if (aspectRatio > 1.2) return 'aspect-[4/3]'
  if (aspectRatio >= 0.9 && aspectRatio <= 1.1) return 'aspect-square'
  if (aspectRatio < 0.9 && aspectRatio > 0.7) return 'aspect-[3/4]'
  if (aspectRatio <= 0.7) return 'aspect-[9/16]'

  return 'aspect-[16/10]' // default
}

// Function to get all images from a directory
function getImagesFromPath(imagesPath) {
  const fullPath = join(publicDir, imagesPath)

  try {
    const files = readdirSync(fullPath)
    return files
      .filter(file => {
        const ext = extname(file).toLowerCase()
        return imageExtensions.includes(ext)
      })
      .sort() // Sort alphabetically
  } catch (error) {
    console.error(`Error reading directory ${fullPath}:`, error.message)
    return []
  }
}

// Function to generate content array from images
function generateContentFromImages(imagesPath) {
  const images = getImagesFromPath(imagesPath)
  const content = []

  for (const image of images) {
    const imagePath = join(publicDir, imagesPath, image)

    try {
      const buffer = readFileSync(imagePath)
      const dimensions = sizeOf(buffer)
      const { colSpan, rowSpan } = getGridDimensions(dimensions.width, dimensions.height)
      const aspectRatio = getAspectRatioClass(dimensions.width, dimensions.height)

      content.push({
        type: 'image',
        url: `${imagesPath}/${image}`,
        alt: image.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        colSpan,
        rowSpan,
        aspectRatio
      })

      console.log(`    - ${image}: ${dimensions.width}x${dimensions.height} → ${colSpan}x${rowSpan} (${aspectRatio})`)
    } catch (error) {
      console.error(`    ✗ Error processing ${image}:`, error.message)
    }
  }

  return content
}

// Main function to process all projects
async function processProjects() {
  const projectFiles = readdirSync(projectsDir).filter(file => file.endsWith('.json'))

  console.log(`Found ${projectFiles.length} project files\n`)

  for (const file of projectFiles) {
    const filePath = join(projectsDir, file)
    const projectData = JSON.parse(readFileSync(filePath, 'utf-8'))

    // Only process projects with imagesPath and colorsGenerated !== true
    if (projectData.imagesPath && projectData.colorsGenerated !== true) {
      console.log(`Processing: ${projectData.title}`)
      console.log(`  Images path: ${projectData.imagesPath}`)

      const content = generateContentFromImages(projectData.imagesPath)

      if (content.length > 0) {
        projectData.content = content

        // Extract colors from first image
        console.log(`  Extracting colors from first image...`)
        const colors = await extractColorsFromImage(content[0].url)

        if (colors) {
          projectData.backgroundColor = colors.backgroundColor
          projectData.textColor = colors.textColor
          projectData.tagBackgroundColor = colors.tagBackgroundColor
          projectData.tagTextColor = colors.tagTextColor
          projectData.colorsGenerated = true
        }

        writeFileSync(filePath, JSON.stringify(projectData, null, 2))
        console.log(`  ✓ Generated ${content.length} items\n`)
      } else {
        console.log(`  ⚠ No images found\n`)
      }
    } else if (!projectData.imagesPath) {
      console.log(`Skipping: ${projectData.title} (no imagesPath)\n`)
    } else {
      console.log(`Skipping: ${projectData.title} (colors already generated)\n`)
    }
  }

  console.log('Done!')
}

// Run the script
processProjects()
