const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463
   */
  publicPath: '/',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */
  configureWebpack: config => {
    //生产环境取消 console.log
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }  else if (process.env.NODE_ENV === "development") {
      // config.devtool = "source-map";
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
  },

  // Vue-ECharts 默认在 webpack 环境下会引入未编译的源码，解决此问题
  transpileDependencies: [
    // 'vue-echarts',
    'resize-detector',
    'vue-baidu-map',
    // 'lodash',
  ],

  css: {
    extract: false,
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          /*
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true,
      }
    }
  },

  devServer: {
    port: 3008,
    proxy: {
      '/mess-boot': {
        // target: 'http://localhost:8088', //请求本地 需要mess-boot后台项目
        target: 'http://47.94.10.52:8088', //远程服务器
        ws: false,
        changeOrigin: true
      },
    }
  },

  lintOnSave: undefined
}