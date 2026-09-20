/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Основные поверхности
        cream: '#F7F9F4',        // фон страницы — мягкий бело-зелёный
        surface: '#FFFFFF',      // карточки
        line: '#EAEEE4',         // тонкие границы

        // Брендовые цвета
        sage: '#7CA982',         // основной (глубже прежнего — лучше контраст)
        'sage-dark': '#5D8B65',  // ховер
        'sage-light': '#E8F0E3', // мягкие фоны, бейджи
        lime: '#C9D9B8',         // вторичный акцент
        olive: '#8B9B7E',        // границы, иконки

        // Текст
        dark: '#1A2419',         // почти чёрный с тёплым оттенком
        text: '#5A6354',         // второстепенный текст
        muted: '#8A9384',        // подписи
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'btn': '12px',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(26, 36, 25, 0.03), 0 4px 16px rgba(26, 36, 25, 0.04)',
        'hover': '0 4px 24px rgba(26, 36, 25, 0.08)',
        'glow': '0 0 0 4px rgba(124, 169, 130, 0.12)',
      },
      letterSpacing: {
        'tightest': '-0.04em',
      },
    },
  },
  plugins: [],
}