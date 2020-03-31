/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-30 15:21:05
 * @LastEditors: by1773
 * @LastEditTime: 2020-03-31 09:36:49
 */
const {
  generateToken,
  getUserInfo
} = require('../core/util')
const { github } = require('@root/config/config')

class AuthController {
  static async getToken(ctx) {
    ctx.verifyParams({
      code: {
        type: 'string',
        required: true
      }
    })

    const code = ctx.query.code
    const result = await generateToken(code)
    const data = result.data
    if (result.status === 200 && !data.error) {
      ctx.session.githubAuth = data
      const { access_token, token_type } = data
      const userInfoData = await getUserInfo(github.userInfoUrl, `${token_type} ${access_token}`)
      ctx.session.userInfo = userInfoData.data
      ctx.redirect( (ctx.session && ctx.session.urlBeforeOAuth) || '/')
      ctx.session.urlBeforeOAuth = ''
    } else {
      ctx.throw(404, data)
    }
  }

  static logout(ctx) {
    ctx.session = null
    ctx.throw(200, '退出登录成功', {
      name: 'Success'
    })
  }

  static prepareAuth(ctx) {
    console.log('******************ctx*********************')
    console.log(ctx)
    ctx.verifyParams({
      url: {
        type: 'string',
        required: true
      }
    })

    const { url } = ctx.query
    ctx.session.urlBeforeOAuth = url
    ctx.redirect(`${github.oauthUrl}?client_id=${github.clientId}&scope=${github.scope}`)
  }
}

module.exports = AuthController
