/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'display': ['DM Sans', 'sans-serif'],
      },
      colors: {
        spring: {
          primary: '#FFD700',
          secondary: '#FF6B9D',
          accent: '#98D8C8',
        },
        summer: {
          primary: '#B4A7D6',
          secondary: '#AED9E0',
          accent: '#D5A6BD',
        },
        autumn: {
          primary: '#CD853F',
          secondary: '#8B4513',
          accent: '#D2691E',
        },
        winter: {
          primary: '#DC143C',
          secondary: '#000080',
          accent: '#4B0082',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-spring': 'linear-gradient(135deg, #FFD700 0%, #FF6B9D 50%, #98D8C8 100%)',
        'gradient-summer': 'linear-gradient(135deg, #B4A7D6 0%, #AED9E0 50%, #D5A6BD 100%)',
        'gradient-autumn': 'linear-gradient(135deg, #CD853F 0%, #8B4513 50%, #D2691E 100%)',
        'gradient-winter': 'linear-gradient(135deg, #DC143C 0%, #000080 50%, #4B0082 100%)',
        'gradient-hero': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(102, 126, 234, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.8)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
