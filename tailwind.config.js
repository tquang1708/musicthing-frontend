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
            '40': '20rem',
            '42': '21rem',
            '56': '28rem',
            '60': '30rem',
            '70': '35rem',
            '80': '40rem',
            '100': '50rem',
        },
        gridTemplateColumns: {
            'auto': 'repeat(auto-fill, 10rem)',
            'auto-mobile': 'repeat(auto-fill, 8rem)'
        }
    },
  },
  plugins: [],
}
