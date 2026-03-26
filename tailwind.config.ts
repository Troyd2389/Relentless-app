import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0c10',
        surface: '#12161c',
        border: '#222935',
        accent: '#22c55e',
        muted: '#9ca3af'
      }
    }
  },
  plugins: []
};

export default config;
