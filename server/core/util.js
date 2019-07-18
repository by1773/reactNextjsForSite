const axios = require('axios')
const {
  github
} = require('@root/config/config')

const generateToken = async function(code) {
  const {
    clientId: client_id,
    clientSecret: client_secret,
    tokenUrl
  } = github
  const result = await axios({
    method: 'POST',
    url: tokenUrl,
    data: {
      client_id,
      client_secret,
      code
    },
    headers: {
      Accept: 'application/json; charset=utf-8'
    }
  })

  return result
}

const getUserInfo = async function (url, Authorization) {
  const userInfo = await axios({
    method: 'GET',
    url: url,
    headers: {
      Authorization
    }
  })

  return userInfo
}

module.exports = {
  generateToken,
  getUserInfo
}