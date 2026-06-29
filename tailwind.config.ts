import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        asphalt: '#13160F',
        'asphalt-2': '#1C2018',
        paint: '#F5F3EA',
        'paint-2': '#ECEAE0',
        ink: '#181C13',
        'ink-soft': '#52584A',
        guide: '#1B9C56',
        'guide-deep': '#127A41',
        amber: '#F2A734',
        red: '#E0474C',
        blue: '#2C6FC9',
      },
      fontFamily: {
        display: ['Archivo', 'Noto Sans JP', 'Noto Sans Myanmar', 'sans-serif'],
        body: ['Hanken Grotesk', 'Noto Sans JP', 'Noto Sans Myanmar', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
