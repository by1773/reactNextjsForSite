const Router = require('koa-router')
const {
  userRepos,
  userStarred
} = require('../../controllers/user')

const router = new Router({
  prefix: '/v1'
})

router.get('/user/repos', userRepos)
router.get('/user/starred', userStarred)

module.exports = router