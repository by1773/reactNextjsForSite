const axios = require('axios')
const { github } = require('../config/config')

const isServer = typeof window === 'undefined'

async function http({method='GET', url, data={}}, req) {
  if(!url) {
    throw Error('url muse provide')
  }
  let headers = {}
  let retUrl = url
  if(isServer) {
    const { githubAuth = {} } = req.session
    if(githubAuth.access_token) {
      headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
    }
    const reg = /^\/v1(.+)/
    const matchUrlList = url.match(reg)
    const matchUrl = matchUrlList && matchUrlList[1]
    retUrl = `${github.apiBaseUrl}${matchUrl}`
  }

  try {
    const result = await axios({
      url: retUrl,
      method,
      data,
      headers
    })
    
    return result
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = {
  http
}
