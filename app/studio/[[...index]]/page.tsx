'use client';

import { NextStudio } from 'next-sanity/studio';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import schemas from '../../../sanity/schemas';

export default function StudioPage() {
  const config = defineConfig({
    name: 'superboss-studio',
    title: 'SuperBoss Studio CMS',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fv19cquu',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    basePath: '/studio',
    plugins: [
      structureTool(),
      visionTool(),
    ],
    schema: {
      types: schemas,
    },
  });

  return <NextStudio config={config} scheme="light" />;
}

