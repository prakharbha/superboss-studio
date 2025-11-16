import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import schemas from './schemas';

// Get environment variables - these are available at build/runtime
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fv19cquu';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'superboss-studio',
  title: 'SuperBoss Studio CMS',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
  ],
  schema: {
    types: schemas,
  },
});

