const LRU = require('lru-cache') // 缓存数据处理
const axios = require('axios')
const moment = require('moment')
const { isArray, isPlainObject } = require('lodash')
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

class Cache {
  constructor(time = 1000 * 60 * 60) {
    this.cache = new LRU({
      maxAge: time
    })
  }

  setCacheByName(name, obj) {
    this.cache.set(name, obj)
  }

  setCache(repo) {
    if (!isPlainObject(repo) || !repo.full_name) {
      console.error('argument nonconformity')
      return
    }
    const fullName = repo.full_name
    this.cache.set(fullName, repo)
  }

  setArrayCache(repos) {
    if(repos && isArray(repos)) {
      repos.forEach(repo => this.setCache(repo))
    }
  }

  getCache(cacheName) {
    return this.cache.get(cacheName)
  }
}

function formatDate(time) {
  return moment(time).fromNow()
}

module.exports = {
  http,
  Cache,
  formatDate
}
