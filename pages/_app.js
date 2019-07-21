/**
 * 这个文件默认覆盖nextjs的app文件
 */
import App, { Container } from 'next/app'
import Router from 'next/router'
import Layout from '../components/Layout'
import PageLoading from '../components/PageLoading'
import { Provider } from 'react-redux'
import WithRedux from "../lib/with-redux"

import 'antd/dist/antd.css'

class MyApp extends App {
  state = {
    loading: false
  }

  startLoading = () => {
    this.setState({
      loading: true
    })
  }

  stopLoading = () => {
    this.setState({
      loading: false
    })
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading)
    Router.events.on('routeChangeComplete', this.stopLoading)
    Router.events.on('routeChangeError', this.stopLoading)
  }

  componentWillMount(){
    Router.events.off('routeChangeStart')
    Router.events.off('routeChangeComplete')
    Router.events.off('routeChangeError')
  }

  static async getInitialProps(ctx) {
    const { Component } = ctx
    let pageProps = {}
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      pageProps
    }
  }
  
  render() {
    const { Component, reduxStore, pageProps={} } = this.props
    return (
      <Container>
        <Provider store={reduxStore}>
          {
            this.state.loading ? <PageLoading /> : null
          }
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
        <style jsx global>{`
          #__next {
            height: 100%;
          }
          .ant-layout {
            min-height: 100%;
          }
          .ant-layout-header {
            padding-left: 0;
            padding-right: 0;
          }
          .ant-layout-content {
            margin-top: 64px;
            background: #fff;
          }
        `}</style>
      </Container>
    )
  }
}

export default WithRedux(MyApp)