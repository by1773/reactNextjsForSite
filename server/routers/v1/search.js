const Router = require('koa-router')
const {
  search,
  repos
} = require('../../controllers/search')

const router = new Router({
  prefix: '/v1'
})

router.get('/search/repositories', search)
router.get('/search/users', search)
router.get('/repos/:owner/:name', repos)
router.get('/repos/:owner/:name/readme', repos)
router.get('/repos/:owner/:name/issues', repos)
router.get('/repos/:owner/:name/labels', repos)

module.exports = router