module.exports = {
  content: [
      "./src/**/*.js"
  ],
  theme: {
    extend: {
        spacing: {
            '1': '0.5rem',
            '1.5': '0.75rem',
            '2': '1rem',
            '2.5': '1.25rem',
            '3': '1.5rem',
            '4': '2rem',
            '5': '2.5rem',
            '6': '3rem',
            '8': '4rem',
            '10': '5rem',
            '12': '6rem',
            '14': '7rem',
            '16': '8rem',
            '20': '10rem',
            '34': '17rem',
            '36': '18rem',
            '38': '19rem',
            '40': '20rem',
            '42': '21rem',
            '52': '26rem',
            '56': '28rem',
            '60': '30rem',
            '70': '35rem',
            '80': '40rem',
            '81': '40.75rem',
            '100': '50rem',
        },
        gridTemplateColumns: {
            'auto': 'repeat(auto-fill, 10rem)',
            'auto-mobile': 'repeat(auto-fill, 6rem)'
        },
        borderWidth: {
            '6': '6px',
            '8': '8px',
        },
        transitionDuration: {
            '350': '350ms',
        },
        minWidth: {
            '80': '40rem',
            '81': '40.75rem',
        },
        fontSize: {
            '1.5xl': '1.375rem',
        },
        colors: {
            // 'gray-500': 'rgb(156 163 175)',
        },
    },
  },
  plugins: [],
}
