import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                display: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: '#FF6B00', // Bright Orange
                    50: '#FFE8D6',
                    100: '#FFDCC2',
                    200: '#FFC499',
                    300: '#FFAB70',
                    400: '#FF9347',
                    500: '#FF6B00',
                    600: '#CC5500',
                    700: '#994000',
                    800: '#662B00',
                    900: '#331500',
                },
                surface: {
                    light: '#F9FAFB',
                    dark: '#0A0A0A', // Very dark black
                },
                card: {
                    light: '#FFFFFF',
                    dark: '#1A2332', // Dark navy blue
                },
            },
            backgroundColor: {
                'dark-navy': '#1A2332',
                'true-black': '#0A0A0A',
            },
        },
    },

    plugins: [forms],
};
