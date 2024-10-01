import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem'
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        default: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      // colors: {
      //   primary: '#B2CDFC',
      //   secondary: '#B7BBC0',
      //   success: '#AAE8BF',
      //   info: '#A4E2EE',
      //   warning: '#F8E1A7',
      //   danger: '#F9B6B5',
      //   light: '#FAFBFB',
      //   dark: '#A0A3A8'
      // },
      colors: {
        primary: '#4aafff',
        secondary: '#B7BBC0',
        success: '#28c76f',
        info: '#6c5ce7',
        warning: '#fbc531',
        danger: '#e84118',
        light: '#f5f6fa',
        dark: '#2f3640',
        purple: '#8a4baf'
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
};
export default config;
