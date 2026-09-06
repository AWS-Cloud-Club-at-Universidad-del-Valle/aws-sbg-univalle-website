import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const challenges = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/challenges' }),
  schema: z.object({
    /** Número del reto (1–8). */
    challengeId: z.number().int().min(1).max(8),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(['Básico', 'Intermedio', 'Avanzado']),
    duration: z.string(),
    services: z.array(z.string()),
    concepts: z.array(z.string()),
    order: z.number().int(),
    /** Fecha de la sesión presencial (YYYY-MM-DD). */
    sessionDate: z.string(),
  }),
});

export const collections = { challenges };
