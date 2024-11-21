module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Ensure all your React files are scanned for class names
  ],
  theme: {
    extend: {
      colors: {
        customColor: '#ff6347', // Example: Adding a custom color
      },
    },
  },
  plugins: [],
}
