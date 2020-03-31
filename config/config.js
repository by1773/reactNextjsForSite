/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-30 15:21:05
 * @LastEditors: by1773
 * @LastEditTime: 2020-03-30 15:47:58
 */
module.exports = {
  github: {
    clientId: '8b3554d1bc7d11688d9a',
    clientSecret: '748ef32cbe900810cd36f1cebf59c1b46f71cb3c',
    oauthUrl: 'https://github.com/login/oauth/authorize',
    scope: 'user',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    apiBaseUrl: 'https://api.github.com'
  },
  searchLanguages: [
    'Javascript',
    'HTML',
    'CSS',
    'TypeScript',
    'Python',
    'Java',
    'PHP'
  ],
  searchSortTypes: [
    {
      name: 'Best Match'
    },
    {
      name: 'Most Stars',
      value: 'stars',
      order: 'desc'
    },
    {
      name: 'Fewest Stars',
      value: 'stars',
      order: 'asc'
    },
    {
      name: 'Most Forks',
      value: 'forks',
      order: 'desc'
    },
    {
      name: 'Fewest Forks',
      value: 'forks',
      order: 'asc'
    },
  ]
}