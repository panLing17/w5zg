var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
   /* publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath*/
     publicPath: process.env.NODE_ENV === 'production'
       ? 'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/w5mall-web/'
       : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'static': path.resolve(__dirname, '../static'),
      'api': path.resolve(__dirname, '../src/api'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'mixins': path.resolve(__dirname, '../src/mixins'),
      'router': path.resolve(__dirname, '../src/router'),
      'store': path.resolve(__dirname, '../src/store'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'views': path.resolve(__dirname, '../src/views')
    }
  },
  module: {
    rules: [
      /*{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },*/
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(ogg|mp4)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: utils.assetsPath('video/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  // 此处配置使用script标签引入的js 不会被打包
  externals: {
    $: 'window.jQuery'
  },
}
