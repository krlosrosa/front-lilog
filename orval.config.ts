// orval.config.ts

import { defineConfig } from 'orval';

export default defineConfig({
  // Bloco 1: Gera o cliente React Query e os tipos TypeScript normais
  unnoqApi: {
    input: {
      target: 'http://localhost:4000/docs-json',
      filters: {
        tags: ['Rules']
      }
    },
    output: {
      headers: true,
      prettier: true,
      mode: 'tags-split',
      target: 'src/services/api/hooks',      // Cliente e hooks vão para cá
      schemas: 'src/services/api/model', // Tipos TS (interfaces) vão para cá
      client: 'react-query',
      override: {
        mutator: {
          path: './src/services/http/axios.http.ts',
          name: 'axiosFetcher',
        },
      },
    },
  },

  // Bloco 2: Gera APENAS os schemas Zod
  unnoqApiZod: {
    input: {
      target: 'http://localhost:4000/docs-json',
      filters: {
        tags: ['Rules']
      }
    },
    output: {
      client: 'zod',
      target: 'src/services/api/schema',
      fileExtension: '.zod.ts',
      mode: 'tags-split', // É bom manter o mesmo modo para consistência
    },
  },
});