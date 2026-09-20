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
                surface: {
                    light: "#ffffff",
                    dark: "#09090b", // zinc-950
                },
                card: {
                    light: "#f8fafc",
                    dark: "#18181b", // zinc-900
                },
                "background-dark": "#050505",
                "card-dark": "#0f0f0f",
                "border-dark": "#1f1f1f",
                primary: {
                    DEFAULT: "#ff5e1e", // Vibrant orange
                    foreground: "#ffffff",
                    50: "#fff7ed",
                    100: "#ffedd5",
                    200: "#fed7aa",
                    300: "#fdba74",
                    400: "#fb923c",
                    500: "#f97316",
                    600: "#ea580c",
                    700: "#c2410c",
                    800: "#9a3412",
                    900: "#7c2d12",
                    950: "#431407",
                },
            },
            animation: {
                aurora: "aurora 60s linear infinite",
                "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
                rainbow: "rainbow var(--speed, 2s) infinite linear",
                ripple: "ripple var(--duration,600ms) linear",
            },
            keyframes: {
                aurora: {
                    "from": {
                        backgroundPosition: "50% 50%, 50% 50%",
                    },
                    "to": {
                        backgroundPosition: "350% 50%, 350% 50%",
                    },
                },
                "border-beam": {
                    "100%": {
                        "offset-distance": "100%",
                    },
                },
                rainbow: {
                    "0%": { "background-position": "0%" },
                    "100%": { "background-position": "200%" },
                },
                ripple: {
                    "0%": { transform: "scale(0)", opacity: "0.5" },
                    "100%": { transform: "scale(4)", opacity: "0" },
                },
            },
        },
    },

    plugins: [forms],
};
