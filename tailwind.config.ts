import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1E1D1B',
        warm: '#F3F0EB',
        stone: '#DDD7CE',
        accent: '#8B6A4A'
      }
    }
  },
  plugins: []
};

export default config;
