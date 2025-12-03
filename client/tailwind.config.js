/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      backgroundImage: {
        'hero_back': "url('./img/hero_back.jpg')",
      },
      colors:{
          orangeff7b00:'#ff7b00'
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        marquee: "marquee 15s linear infinite",
        fadeUp: "fadeUp 0.6s ease-out forwards",
      },

      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },

  corePlugins: {
    scrollBehavior: true,
  },

  plugins: [],
};
