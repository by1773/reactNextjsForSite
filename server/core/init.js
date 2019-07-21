const Router = require('koa-router')
const requireDirectory = require('require-directory')
const atob = require('atob')

class InitManager {
  static initCore(app) {
    global.atob = atob
    InitManager.app = app
    InitManager.loadRouters()
  }

  static loadRouters() {
    const apiDirectory = `${process.cwd()}/server/routers`
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    })

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes()).use(obj.allowedMethods()) // allowedMethods处理不被允许的请求方式
      }
    }
  }
}

module.exports = InitManager