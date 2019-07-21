const webpack = require('webpack')
const withCss = require('@zeit/next-css')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const {
  github
} = require('./config/config')

// const config ={
//   // 编译文件的输出目录
//   distDir: 'dist',
//   // 是否给每个路由生成Etag，主要是用于缓存，默认是开启的
//   // 一般配置的时候使用了nginx，则这里就关闭，避免不必要的性能消耗
//   generateEtags: true,
//   // 开发时，内容页面缓存配置，注：只用于开发时
//   onDemandEntries: {
//     // 内容在内存中缓存时长
//     maxInactiveAge: 25 * 1000,
//     // 同时缓存多少个页面
//     pagesBufferLength: 2
//   },
//   // page目录下面那种后缀的文件会被认为是页面
//   pageExtensions: ['jsx', 'js'],
//   // 配置buildId
//   generateBuildId: async () => {
//     if(process.env.YOUR_BUILD_ID) {
//       return process.env.YOUR_BUILD_ID
//     }
//     // 返回null使用默认的uniqueId
//     return null
//   },
//   // 后动修改webpack config
//   webpack(comfig, options) {
//     return config
//   },
//   // 修改webpackDevMiddleware配置
//   webpackDevMiddleware: config => {
//     return config
//   },
//   // 可以在页面上通过 procsess.env.customKey 获取 value
//   env: {
//     customKey: 'value'
//   },
//   // 下面两个要通过 'next/config' 来读取只有服务端渲染的时候才会获取的配置
//   serverRuntimeConfig: {
//     mySecret: 'secret',
//     secondSecret: process.env.SECOND_SECRET
//   },
//   // 在服务端和客户端渲染都可获取的配置
//   publicRuntimeConfig: {
//     staticFolder: '/static'
//   }
// }

if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {}
}

module.exports = withBundleAnalyzer(withCss({
  webpack(config){
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    return config
  },
  publicRuntimeConfig: {
    oauthUrl: `${github.oauthUrl}?client_id=${github.clientId}&scope=${github.scope}`
  },
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  }
}))