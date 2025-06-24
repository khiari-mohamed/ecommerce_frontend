module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'custom-properties': true
      }
    },
    'postcss-dark-theme-class': {
      darkSelector: '[data-theme="dark"]',
      lightSelector: '[data-theme="light"]'
    },
    autoprefixer: {},
  }
}