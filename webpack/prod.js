const { resolve } = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./common.js');

const {
  createCopyAssets,
  createJsMinify,
  createImageMinify,
  createCleanup,
  createBundleAnalyzer,
  createDotEnv,
} = require('./plugins');

const prodConfig = merge(commonConfig, {
  mode: 'production',
  devtool: false,
  output: {
    ...commonConfig.output,
    path: resolve('build'),
    filename: '[name].min.js',
  },
  plugins: [
    ...commonConfig.plugins,
    createCopyAssets(),
    createBundleAnalyzer(),
    createDotEnv({ path: './.env/.prod' }),
  ].filter(Boolean),

  optimization: {
    minimize: true,
    minimizer: [createJsMinify(), createImageMinify(), createCleanup()].filter(
      Boolean
    ),
  },
});

module.exports = prodConfig;
