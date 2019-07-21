import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Icon, Tabs } from 'antd'
import getConfig from 'next/config'
import Router, { withRouter } from 'next/router' 
import Repo from '../components/Repo'
const { http, Cache } = require('../lib/util')

const { publicRuntimeConfig } = getConfig()
const cache = new Cache(1000 * 60 * 10)

const isServer = typeof window === 'undefined'

function Index({
  userRepos,
  userStared,
  user,
  router
}) {

  const tabKey = router.query.key || '1'

  if(!user || !user.id) {
    return (
      <div className="login-wrapper">
        <p>亲，您还没有登录哦 ~~~</p>
        <Button 
          type="primary" 
          href={`${publicRuntimeConfig.oauthUrl}`} 
          icon="github">Github登录</Button>
          <style jsx>{`
            .login-wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 400px;
            }
          `}</style>
      </div>
    )
  }

  const handleTabChange = activeKey => {
    Router.push(`/?key=${activeKey}`)
  }

  useEffect(() => {
    if(!isServer) {
      if(userRepos) {
        cache.setCacheByName('userRepos', userRepos)
      }
      if(userStared) {
        cache.setCacheByName('userStared', userStared)
      }
    }
  }, [userRepos, userStared])

  return (
    <div className="main-wrapper">
      <div className="user-info">
        <img src={user.avatar_url} alt="user avatar" className="avatar"/>
        <span className="name">{user.name}</span>
        <span className="login">{user.login}</span>
        <span className="bio">{user.bio}</span>
        <p className="email">
          <Icon type="mail" style={{marginRight: 10}} />
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      </div>
      <div className="user-repos">
        <Tabs activeKey={tabKey} animated={false} onChange={handleTabChange}>
          <Tabs.TabPane tab="你的仓库" key="1">
            {
              userRepos && userRepos.map(repo => <Repo key={repo.id} repo={repo} />)
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="你关注的仓库" key="2" onChange={handleTabChange}>
            {
              userStared && userStared.map(stared => <Repo key={stared.id} repo={stared} />)
            }
          </Tabs.TabPane>
        </Tabs>
        
      </div>
      <style jsx>{`
        .main-wrapper {
          display: flex;
          align-items: flex-start;
          padding: 20px 0;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          width: 300px;
          margin-right: 40px;
          flex-shrink: 0;
        }
        .login {
          font-size: 16px;
          color: #777;
        }
        .name {
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }
        .bio {
          margin-top: 20px;
          color: #333;
        }
        .avatar {
          width: 100%;
          border-radius: 5px;
          border: 1px solid #e2e2e2;
        }
        .user-repos {
          flex-grow: 1;
        }
      `}</style>
    </div>
  )
}

Index.getInitialProps = async ({ctx}) => {
  const user = ctx.reduxStore.getState().user
  if(!user || !user.id) {
    return {}
  }

  if(!isServer) {
    if (cache.getCache('userRepos') && cache.getCache('userStared')) {
      return{
        userRepos: cache.getCache('userRepos'),
        userStared: cache.getCache('userStared')
      }
    }
  }

  const userReposData = await http({
    url: '/v1/user/repos'
  }, ctx.req)

  const userStaredData = await http({
    url: '/v1/user/starred'
  }, ctx.req)

  return {
    userRepos: userReposData.data,
    userStared: userStaredData.data
  }
}

export default withRouter(connect(
  state => ({
    user: state.user
  })
)(Index))