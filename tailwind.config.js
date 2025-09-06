/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      "sm": "580px",
      "sm-max": { "max" : "580px"},
      md: "768px",
      lg: "976px",
      xl: "1440px",


    },
 
   
    fontFamily: {
      default: [
        "Consolas",
        "Menlo",
        "Monaco",
        "Lucida Console",
        "Liberation Mono",
        "DejaVu Sans Mono",
        "Bitstream Vera Sans Mono",
        "Courier New",
        "Courier",
        "monospace",
      ],
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      colors: {

        pink: {
          50: "#fff5f8",
          75: "#ffebf1",
          100: "#ffdae7",
          200: "#ffabc7",
          300: "#ff72a1",
          400: "#ff2e74",
          500: "#d42a66",
          600: "#a32553",
          700: "#6d1e3e",
          800: "#36192a",
        },
        red: {
          50: "#feeff2",
          75: "#fde8eb",
          100: "#fbd8dc",
          200: "#faa0aa",
          300: "#f15c6d",
          400: "#ea0038",
          500: "#b80531",
          600: "#911435",
          700: "#61182e",
          800: "#321622",
        },
        orange: {
          50: "#fff7f5",
          75: "#ffebe6",
          100: "#fee2d8",
          200: "#fdc1ad",
          300: "#fc9775",
          400: "#fa6533",
          500: "#c4532d",
          600: "#9a4529",
          700: "#6b3424",
          800: "#35221e",
        },
        yellow: {
          50: "#fcfcf5",
          75: "#fff7e5",
          100: "#fff0d4",
          200: "#ffe4af",
          300: "#ffd279",
          400: "#ffbc38",
          500: "#c89631",
          600: "#9d792c",
          700: "#6d5726",
          800: "#36311f",
        },
        green: {
          50: "#f2fdf0",
          75: "#e7fce3",
          100: "#d9fdd3",
          200: "#acfcac",
          300: "#71eb85",
          400: "#25d366",
          500: "#1fa855",
          600: "#1b8748",
          700: "#156038",
          800: "#103527",
        },
        emerald: {
          50: "#f0fff9",
          75: "#e1fef2",
          100: "#d5fded",
          200: "#b2f5da",
          300: "#7ae3c3",
          400: "#06cf9c",
          500: "#00a884",
          600: "#008069",
          700: "#125c4e",
          800: "#0a332c",
        },
        teal: {
          50: "#edfafa",
          75: "#dff6f5",
          100: "#cbf2ee",
          200: "#95dbd4",
          300: "#42c7b8",
          400: "#02a698",
          500: "#028377",
          600: "#046a62",
          700: "#074d4a",
          800: "#092d2f",
        },
        blue: {
          50: "#f2fafe",
          75: "#def3fc",
          100: "#caecfa",
          200: "#93d7f5",
          300: "#53bdeb",
          400: "#009de2",
          500: "#027eb5",
          600: "#046692",
          700: "#074b6a",
          800: "#092c3d",
        },
        cobalt: {
          50: "#f2f8ff",
          75: "#e1f0ff",
          100: "#d2e8ff",
          200: "#99cafe",
          300: "#53a6fd",
          400: "#007bfc",
          500: "#0063cb",
          600: "#0451a3",
          700: "#073d76",
          800: "#092642",
        },
        purple: {
          50: "#f7f5ff",
          75: "#efebff",
          100: "#e8e0ff",
          200: "#d1c4ff",
          300: "#a791ff",
          400: "#7f66ff",
          500: "#5e47de",
          600: "#4837af",
          700: "#3a327b",
          800: "#242447",
        },
        gray: {
          50: "#f7f8fa",
          75: "#f0f2f5",
          100: "#e9edef",
          200: "#d1d7db",
          300: "#aebac1",
          400: "#8696a0",
          500: "#667781",
          600: "#54656f",
          700: "#3b4a54",
          800: "#202c33",
          900: "#111b21",
          1000: "#0b141a",
          30: "#f7f8fa",
          60: "#f0f2f5",
          70: "#f0f2f5",
          150: "#d1d7db",
        },
        white: {
          5: "hsla(0,0%,100%,0.05)",
          10: "hsla(0,0%,100%,0.1)",
          20: "hsla(0,0%,100%,0.2)",
          30: "hsla(0,0%,100%,0.3)",
          40: "hsla(0,0%,100%,0.4)",
          50: "hsla(0,0%,100%,0.5)",
          60: "hsla(0,0%,100%,0.6)",
          70: "hsla(0,0%,100%,0.7)",
          80: "hsla(0,0%,100%,0.8)",
          90: "hsla(0,0%,100%,0.9)",
        },
        icon : {
          header : "#aebac1",
          400: "#8696a0",
          500 : "rgba(233,237,239, .32)"
  
        },
        main : {
          primary : "#d1d7db",
          primaryhard : "#e9edef",
          secondary : "#8696a0"
        }
      },
      spacing: {
        128: "32rem",
        144: "36rem",
        
      },
      borderRadius: {
        "4xl": "2rem",
        "msg" : "7.5px"
      },
      backgroundColor : {
        header : {
          100 : "#202c33",
          "default" : "#111b21",
        },
        icon : {
          100  : 'hsla(0,0%,100%,0.1)',
        
        },
        msg  : {
          out : "#202c33",
          in : "#005c4b"
        },
        search : {
          100 : "#202c33",
          200 : "#2a3942",
          300 : "#222e35"
        },
        input : {
          100 : "#202c33",
          200 : "#2a3942"
        },
        footer : {
          100 : "#202c33"
        },
        menu : {
          "default" : "#233138",
          "hover" : "#182229",

        },
        default : "#111b21",
        hover : "#202c33",
        tab_marker : "#00a884"
      },
      flexBasis: {
       '7/10' : '70%',
       '3/10' : '30%' ,
      },
      height : {
        header  : '59px',
        searchbox : '35px',
        contactbox : "72px",
        side : "calc(100vh - 59px )",
        footer : '62px',
        input : "42px",
        tabs : "44px",
      },
      borderColor : {
        'main' : 'rgba(134,150,160,0.15)'
      },
      width : {
        tabs : "44px",

      },
      opacity : {
        default : '0.06'
      },
      maxWidth: {
        '17/20': '85%',
      },
      minHeight : {
        emojis : {
        }
      },
      maxHeight : {
          emoji_panel : "35vh"
      },
      boxShadow : {
        menu : "0 2px 5px 0 rgba(11,20,26,.26),0 2px 10px 0 rgba(11,20,26,.16);"
      }
      ,
      animation : {
        "scale-popup" : "scale-popup 0.15s linear forwards ",
        "reverse-scale-popup" : "reverse-scale-popup 0.15s linear  forwards"

      },
      keyframes : {

        'scale-popup' : {
          '0%' : { transform : 'scale(0)'},
          '100%' : {transform : 'scale(1)'}
        },
        'reverse-scale-popup' : {
          '0%' : { transform : 'scale(1)'},
          '100%' : {transform : 'scale(0)'}
        }

      }

    },
  },
  plugins: [],
}
