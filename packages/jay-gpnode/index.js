const add = require('@jay/gpwebpack')

console.log(add(1, 2, 3, 4, 5, 6))

module.exports = (...args) => {
  return args.reduce((pre, v) => pre * v, 1)
}
