import tailwindcss_animate from "tailwindcss-animate";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["NB Akademie", "sans-serif"],
        mono: ["NB Akademie Mono", "monospace"],
      },
      colors: {
        white: 'hsl(var(--color-white))',
        whitest: 'hsl(var(--color-whitest))',
        'semi-white': 'hsl(var(--color-semi-white))',
        'grey-dark': 'hsl(var(--color-grey-dark))',
        'grey-medium': 'hsl(var(--color-grey-medium))',
        'grey-light': 'hsl(var(--color-grey-light))',
        'grey-lighter': 'hsl(var(--color-grey-lighter))',
        black: 'hsl(var(--color-black))',
        red: 'hsl(var(--color-red))',
        orange: 'hsl(var(--color-orange))',
        'orange-soft': 'hsl(var(--color-orange-soft))',
        green: 'hsl(var(--color-green))',
        'blue-light': 'hsl(var(--color-blue-light))',
        yellow: 'hsl(var(--color-yellow))',
        status: {
          success: 'hsl(var(--color-green))',
          info: 'hsl(var(--color-blue-light))',
          warning: 'hsl(var(--color-yellow))',
          danger: 'hsl(var(--color-red))'
        },
        error: {
          lighter: 'hsl(354, 66%, 91%)',
          light: 'hsl(354, 70%, 87%)',
          dark: 'hsl(354, 61%, 28%)'
        },
        textColor: {
          light: '#f5f5f5',
          'light-gray': '#999',
          dark: 'hsl(0, 0%, 20%)'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      transitionDuration: {
        DEFAULT: '300ms', // Sets the default duration to 300ms
      },
      transitionTimingFunction: {
        DEFAULT: 'ease', // Optional: Sets the default easing
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'fade-out': {
          '0%': {
            opacity: '1'
          },
          '100%': {
            opacity: '0'
          }
        },
        lightUpOrange: {
          '0%, 100%': {
            opacity: '0.2',
            boxShadow: 'none',
            borderColor: 'hsl(0, 0%, 96%)'
          },
          '50%': {
            opacity: '1',
            boxShadow: '0 0 10px hsl(17, 73%, 50%), 0 0 20px hsl(35, 87%, 54%)',
            borderColor: 'hsl(35, 87%, 54%)'
          }
        },
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'light-up-orange': 'lightUpOrange 1s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      backgroundImage: {
        'astria-gradient': 'linear-gradient(to right, hsl(35, 87%, 54%), hsl(17, 73%, 50%))',
        'radial-dark': 'radial-gradient(144.23% 141.13% at 50.15% 0%, hsl(0, 7%, 13%) 0%, hsl(203, 45%, 4%) 100%)',
        'button-gradient': 'linear-gradient(to right, hsl(35, 87%, 54%), hsl(17, 73%, 50%))',
        'gradient-radial': 'radial-gradient(144.23% 141.13% at 50.15% 0%, var(--tw-gradient-stops))'
      },
      backgroundColor: {
        body: 'hsl(203deg 45% 4%)'
      },
      borderImage: {
        'astria-gradient': 'linear-gradient(to right, hsl(35, 87%, 54%), hsl(17, 73%, 50%)) 1'
      },
      borderColor: {
        dark: 'hsl(var(--border))'
      }
    }
  },
  plugins: [tailwindcss_animate],
  compilerOptions: {
    baseUrl: ".",
    paths: {
      "@/*": ["./*"],
    },
  },
};
