const Router = require('koa-router')
const {
  search
} = require('../../controllers/search')

const router = new Router({
  prefix: '/v1'
})

router.get('/search/repositories', search)

module.exports = router