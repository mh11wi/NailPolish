module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/NailPolish/'
    : '/',
  pages: {
    index: {
      entry: 'src/main.js',
      title: process.env.VUE_APP_TITLE
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: '$primary-color: ' + process.env.VUE_APP_PRIMARY_COLOR + ';'
      }
    }
  }
}