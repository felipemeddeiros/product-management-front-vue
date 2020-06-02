'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://crudprod.api.local/api"',
  IMG_PROD_DEFAULT: '"http://crudprod.api.local/storage/products/default.jpeg"'
})
