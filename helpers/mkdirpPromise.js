const { mkdirp } = require('mkdirp')

module.exports = function (dir, opts) {
  return mkdirp(dir, opts)
}
