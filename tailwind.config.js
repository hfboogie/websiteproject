/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'secondary-bg': 'var(--secondary-bg)',
        border: 'var(--border)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        'card-bg': 'var(--card-bg)',
        'card-hover': 'var(--card-hover)',
        'header-bg': 'var(--header-bg)',
        'sidebar-bg': 'var(--sidebar-bg)',
        // MTG colors
        mtg: {
          white: '#f9fafb',
          blue: '#2563eb',
          black: '#1f2937',
          red: '#dc2626',
          green: '#16a34a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
