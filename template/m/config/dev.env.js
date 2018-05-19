'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_TYPE: '"dev"',
  BASE_API: '"http://localhost:3100"'  // 用于开发环境的axios等通用路径
})
