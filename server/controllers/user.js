const { http } = require('@root/lib/util')

class UserController {
  static async userRepos(ctx) {
    const githubAuth = ctx.session.githubAuth
    const token = githubAuth && githubAuth.access_token
    let headers = {}
    if (token) {
      headers['Authorization'] = `${githubAuth.token_type} ${token}`
    }
    const result = await http({
      url: ctx.originalUrl,
      headers
    }, ctx)
    
    ctx.body = result.data
  }
  
  static async userStarred(ctx) {
    const githubAuth = ctx.session.githubAuth
    const token = githubAuth && githubAuth.access_token
    let headers = {}
    if (token) {
      headers['Authorization'] = `${githubAuth.token_type} ${token}`
    }
    const result = await http({
      url: ctx.originalUrl,
      headers
    }, ctx)

    ctx.body = result.data
  }
}

module.exports = UserController