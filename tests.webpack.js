// https://github.com/dustingetz/react-cursor/commit/385ca0d01f6906f4712efaf01a0dafdac4c4b3ee

const context = require.context(`./src`, true, /.test\.js$/)
context.keys().forEach(context)
