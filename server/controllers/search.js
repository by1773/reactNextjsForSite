const { http } = require('@root/lib/util')

class SearchController {
  static async search(ctx) {
    ctx.verifyParams({
      q: {
        type: 'string',
        required: true
      }
    })
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

  static async repos(ctx){
    ctx.verifyParams({
      owner: {
        type: 'string',
        required: true
      },
      name: {
        type: 'string',
        required: true
      }
    })
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

module.exports = SearchController