module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/NailPolish/'
    : '/',
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Madeleine Hill - Nail Polish App'
    }
  }
}