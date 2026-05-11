import { defineConfig } from 'vitest/config';
import { transform as astroTransform } from '@astrojs/compiler';
import { createRequire } from 'node:module';
import type { Plugin } from 'vite';

const require = createRequire(import.meta.url);
// typescript is a CJS module — use require() in ESM context
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ts = require('typescript') as typeof import('typescript');

// Shim for createMetadata removed in Astro 6 but still emitted by @astrojs/compiler@4
const CREATE_METADATA_SHIM = `
function $$createMetadata(moduleId, meta) { return { ...meta, moduleId }; }
`;

// Custom Vite plugin to compile .astro files for vitest using @astrojs/compiler.
// Uses `transform` (not `compile`) to convert .astro → JS, then TypeScript strips types.
// This bypasses Astro's full Vite 7 plugin stack (incompatible with vitest@2/Vite@5).
// Shims createMetadata which was removed in Astro 6 but still emitted by @astrojs/compiler@4.
function astroCompilerPlugin(): Plugin {
  return {
    name: 'vitest:astro-compiler',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.astro')) return null;
      const compiled = await astroTransform(code, {
        filename: id,
        sourcemap: false,
        internalURL: 'astro/runtime/server/index.js',
      });
      // Strip TypeScript from compiled output (output is TSX, must be lowered to JS)
      const stripped = ts.transpileModule(compiled.code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.Preserve,
        },
      });
      // Inject shim for createMetadata (removed in Astro 6, still emitted by compiler@4)
      const finalCode = stripped.outputText.includes('$$createMetadata')
        ? stripped.outputText.replace(
            /import\s*\{([^}]*)\}\s*from\s*['"]astro\/runtime\/server\/index\.js['"]/,
            (match, imports: string) => {
              // Remove createMetadata from the import if present
              const cleaned = imports.replace(/,?\s*createMetadata\s*as\s*\$\$createMetadata/, '').replace(/\s*createMetadata\s*,?/, '');
              return `import {${cleaned}} from 'astro/runtime/server/index.js';\n${CREATE_METADATA_SHIM}`;
            }
          )
        : stripped.outputText;
      return { code: finalCode, map: null };
    },
  };
}

export default defineConfig({
  plugins: [astroCompilerPlugin()],
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
});
