require('module-alias/register')

const Koa = require('koa')
const next = require('next')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const koaJsonError = require('koa-json-error')
const koaParameter = require('koa-parameter')
const koaBody = require('koa-body')
const InitManager = require('./core/init')

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()

  server.use(koaJsonError({
    postFormat: (err, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
  }))

  server.use(koaBody())

  server.keys = ['javafs develop Github App']
  server.use(session({
    key: 'jid:sid',
    prefix: 'ssid:',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24*60*60*1000
    },
    store: redisStore({
      all: '127.0.0.1:6379'
    })
  }))
  
  server.use(koaParameter(server))
  InitManager.initCore(server)
  
  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false

    await next()
  })

  server.listen(3000, () => console.log('服务启动在 3000 端口'))
})


