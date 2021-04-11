// const mutli = require('@jay/gpnode')
// console.log(mutli(1,2,3))
module.exports = (...args) => {
  return args.reduce((pre, v) => pre + v, 0)
}
