const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    postcssPresetEnv({
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
      },
    }),
  ],
};