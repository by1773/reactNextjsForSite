module.exports = {
  github: {
    clientId: '2f7ccc2b2c1c0e67c2bc',
    clientSecret: '9d07389cb263ba0a6cb75440c0547721300411a0',
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