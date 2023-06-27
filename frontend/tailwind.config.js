/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        onyxgrey: '#323437',
        timberwolf: '#D1D0C5',
        dimgrey: '#646669',
        jetblack: '#2C2E31',
        saffron: '#E2B714',
        tomato: '#CA4754',
        green: '#305029',
        myyellow: '#E2B714',
        mylightdark: '#323437',
        mydark: '#2C2E31',
        mygrey: '#D1D0C5',
        mydarkgrey: '#646669',
      },
      fontFamily: {
        'roboto': ['Roboto Mono', 'monospace'],
        'pmarker': ['Permanent Marker', 'monospace'],
      },
    },
  },
  plugins: [],
}
