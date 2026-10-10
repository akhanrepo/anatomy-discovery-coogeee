import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    reporters: process.env.CLAUDE_HOOK ? ['dot'] : ['default'],
  },
});
