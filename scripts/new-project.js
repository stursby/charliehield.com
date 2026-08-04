import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectsDir = join(__dirname, '../src/content/projects')

const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = async (q, { required } = {}) => {
  while (true) {
    const a = (await rl.question(q)).trim()
    if (a || !required) return a
    console.log('  ↳ required')
  }
}

const title = await ask('Title (required): ', { required: true })
const description = await ask('Description: ')
const url = await ask('URL: ')
const orderRaw = await ask('Order (#): ')
const order = Number(orderRaw) || 0

const slug = slugify(title)
const filePath = join(projectsDir, `${slug}.json`)
if (existsSync(filePath)) {
  console.error(`\n✗ ${slug}.json already exists — aborting.`)
  rl.close()
  process.exit(1)
}

// Reflow: bump existing projects at or after this order to make room.
if (orderRaw) {
  for (const file of readdirSync(projectsDir).filter(f => f.endsWith('.json'))) {
    const p = join(projectsDir, file)
    const data = JSON.parse(readFileSync(p, 'utf-8'))
    if (typeof data.order === 'number' && data.order >= order) {
      data.order += 1
      writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
      console.log(`  ↳ bumped ${file} → order ${data.order}`)
    }
  }
}

const project = {
  title,
  description,
  url: url || null,
  order,
  imagesPath: `/images/${slug}`,
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  tagBackgroundColor: '#FFFFFF1A',
  tagTextColor: '#FFFFFF',
  technologies: [],
  content: [],
}

writeFileSync(filePath, JSON.stringify(project, null, 2) + '\n')
rl.close()

console.log(`\n✓ Created src/content/projects/${slug}.json`)
console.log(`  Drop images in public/images/${slug}/, then run: npm run generate-projects`)
