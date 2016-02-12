module.exports = config => {
  const options = {
    basePath: ``,

    frameworks: [`mocha`, `chai`],

    browsers: [`Chrome`, `Firefox`],

    files: [`tests.webpack.js`],

    preprocessors: {
      'tests.webpack.js': [`webpack`, `sourcemap`],
    },

    colors: true,

    webpack: {
      devtool: `inline-source-map`,
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: `babel` }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true,
    },

    reporters: [
      `coverage`,
      `mocha`,
    ],

    coverageReporter: {
      type: `lcov`,
      dir: `coverage/`,
    },
  }

  if (process.env.CIRCLECI) {
    options.singleRun = true
  }

  config.set(options)
}
