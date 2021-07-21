var loadJs = require('loadjs');

export default (module, version = '1.0') => {
  let basePath = '/manage'
  let umdModuleName = 'flick' + module.replace(/^\S/, s => s.toUpperCase());
  return new Promise((resolve, reject) => {
    loadJs(`${basePath}/${module}/main.js?v=${version}`, {
      success: () => {
        resolve({
          default: window[umdModuleName].default
        })
      },
      error: err => {
        reject(err)
      }
    })
  })
}