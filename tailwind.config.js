/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#fff",
        text: "#000",
      },
      borderWidth: {
        1: "1px",
      },
    },
    zIndex: [0, 10, 100, 1000].reduce((acc, curr) => {
      acc[curr] = curr;
      acc[`-${curr}`] = -curr;
      return acc;
    }, {}),
  },
  plugins: [],
};
