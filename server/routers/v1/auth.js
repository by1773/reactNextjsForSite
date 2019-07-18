const Router = require('koa-router')
const {
  generateToken
} = require('../../core/util')
const {
  getToken,
  logout,
  prepareAuth
} = require('../../controllers/auth')

const router = new Router()

router.get('/auth', getToken)
router.post('/logout', logout)
router.get('/prepare-auth', prepareAuth)

module.exports = router