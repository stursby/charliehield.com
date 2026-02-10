/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Gabarito', 'sans-serif'],
        serif: ['Instrument Serif', 'serif']
      },
      colors: {
        cream: '#fffdf7',
        orange: '#e8580c',
        yellow: '#ffd166',
        pink: '#f4a0c2',
        purple: '#3b3486',
        green: '#2d5a3d',
        beige: '#e9dcc9',
        blue: '#5da9e9',
        dark: '#1a1a1a'
      },
      keyframes: {
        heroSlideUp: {
          from: { opacity: '0', transform: 'translateY(80px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        heroPop: {
          from: { opacity: '0', transform: 'scale(0.85) rotate(-2deg)' },
          to: { opacity: '1', transform: 'scale(1) rotate(0deg)' }
        },
        floatBadge: {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' }
        },
        marqueeScroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '75%': { transform: 'rotate(-3deg)' }
        },
        pulseScale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-60px)' },
          to: { opacity: '1', transform: 'translateX(0)' }
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(60px)' },
          to: { opacity: '1', transform: 'translateX(0)' }
        },
        drawLine: {
          from: { width: '0' },
          to: { width: '100%' }
        }
      },
      animation: {
        'hero-slide-up': 'heroSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'hero-pop': 'heroPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'float-badge': 'floatBadge 4s ease-in-out infinite',
        'marquee': 'marqueeScroll 300s linear infinite',
        'marquee-slow': 'marqueeScroll 45s linear infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
        'spin-slow-30': 'spinSlow 30s linear infinite',
        'spin-slow-reverse': 'spinSlow 15s linear infinite reverse',
        'fade-in-up': 'fadeInUp 0.4s ease both',
        'scale-in': 'scaleIn 0.4s ease both',
        'wiggle': 'wiggle 3s ease-in-out infinite',
        'pulse-scale': 'pulseScale 2s ease-in-out infinite',
        'pulse-scale-5': 'pulseScale 5s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.4s ease both',
        'slide-in-right': 'slideInRight 0.4s ease both'
      }
    }
  },
  plugins: []
}
