import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    content: [
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './composables/**/*.{js,ts}',
        './plugins/**/*.{js,ts}',
        './app.{vue,js,ts}',
        './error.{vue,js,ts}',
    ],
    theme: {
        extend: {
            // якщо хочеш — замап будь-які CSS-змінні у кольори Tailwind
            colors: {
                // приклади: тоді можна буде писати text-ui-text-main, bg-ui-accent, тощо
                'ui-text-main': 'var(--ui-text-main)',
                'ui-accent': 'var(--color-ui-accent)',
                success: 'var(--color-success)',
                danger: 'var(--color-danger)',
            },
            keyframes: {
                wiggle: {
                    '0%': { transform: 'translateX(0)' },
                    '20%': { transform: 'translateX(-2px)' },
                    '40%': { transform: 'translateX(2px)' },
                    '60%': { transform: 'translateX(-2px)' },
                    '80%': { transform: 'translateX(2px)' },
                    '100%': { transform: 'translateX(0)' },
                },
            },
            animation: {
                'spin-fast': 'spin 0.5s linear',
                wiggle: 'wiggle 0.2s ease',
            },
        },
    },
    plugins: [],
}
