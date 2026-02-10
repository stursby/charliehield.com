import { defineCollection, z } from 'astro:content'

const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    url: z.string().url().nullable(),
    client: z.string().optional(),
    order: z.number(),
    layout: z.enum(['A', 'B']),
    imagesPath: z.string().optional(), // Path to project images directory
    backgroundColor: z.string(), // Hex color (e.g., #7cf59b)
    textColor: z.string(), // Hex color (e.g., #FFFFFF)
    tagBackgroundColor: z.string(), // Hex color with optional opacity (e.g., #4227401A)
    tagTextColor: z.string(), // Hex color (e.g., #1F2937)
    technologies: z.array(z.string()),
    content: z.array(
      z.object({
        type: z.enum(['image', 'video']),
        url: z.string(), // Allow relative paths for local assets
        alt: z.string(),
        aspectRatio: z.string().optional(),
        // Video-specific options
        autoplay: z.boolean().optional(),
        muted: z.boolean().optional(),
        loop: z.boolean().optional(),
        playsinline: z.boolean().optional(),
      })
    ),
  }),
})

export const collections = {
  projects: projectsCollection,
}
