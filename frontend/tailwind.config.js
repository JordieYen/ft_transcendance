/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        myyellow: '#E2B714',
        mylightdark: '#323437',
        mydark: '#2C2E31',
        mygrey: '#D1D0C5',
        mydarkgrey: '#646669',
      },
      fontFamily: {
        'roboto': ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
