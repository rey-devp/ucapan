/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                matcha: {
                    100: '#FDFCF0', // Cream/Off-white
                    300: '#D0E8A8', // Light Matcha
                    500: '#A8C686', // Main Matcha
                    700: '#556B2F', // Dark/Text
                },
                berry: {
                    300: '#F4C2C2', // Soft Pink
                },
            },
        },
    },
    plugins: [],
}
