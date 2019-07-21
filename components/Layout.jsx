import { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu, BackTop } from 'antd'
import Container from '../components/Container'
import { actionCreators } from '../store'

const { Header, Content, Footer } = Layout

const githubIconStyle = {
  color: '#fff',
  fontSize: 40,
  display: 'block',
  paddingTop: 10,
  marginRight: 20
}
const footerStyle = {
  textAlign: 'center'
}

const LayoutComp = ({ children, user, logout, router }) => {
  const urlQuery = router.query && router.query.q
  const [search, setSearch] = useState(urlQuery || '')

  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  const handleOnSearch = useCallback(() => {
    router.push(`/search?q=${search}`)
  }, [search])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])
  

  const userDropDown = (
    <Menu>
      <Menu.Item>
        <a href="javascript:;" onClick={handleLogout}>登 出</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <Container renderer={<div className="header-wrapper" />}>
          <div className="header-left">
            <div className="logo">
              <Link href="/">
                <span>
                  <Icon type="github" style={githubIconStyle} />
                </span>
              </Link>
            </div>
            <div>
              <Input.Search
                placeholder="搜索仓库"
                value={search}
                onChange={handleSearchChange}
                onSearch={handleOnSearch} />
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              {
                user && user.id ? (
                  <Dropdown overlay={userDropDown}>
                    <a href='/' className="avatar">
                      <Avatar size={40} src={user.avatar_url} />
                    </a>
                  </Dropdown>
                ) : (
                  <Tooltip title="点击进行登录">
                      <a 
                        href={`/prepare-auth?url=${router.asPath}`} 
                        className="avatar">
                      <Avatar size={40} icon="user" />
                    </a>
                  </Tooltip>
                )
              }
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container>
          {children}
        </Container>
        <BackTop visibilityHeight={64} />
      </Content>
      <Footer style={footerStyle}>
        Develop by javafs @<a href="mailto:1169655050@qq.com">1169655050@qq.com</a>
      </Footer>
      <style jsx>{`
        .header-wrapper {
          display: flex;
          justify-content: space-between;
        }
        .header-left {
          display: flex;
          justify-content: flex-start;
        }
        .avatar {
          display: block;
        }
      `}</style>
    </Layout>
  )
}

export default connect(
  state => ({user: state.user}),
  {
    logout: actionCreators.logout
  }
)(withRouter(LayoutComp))
  