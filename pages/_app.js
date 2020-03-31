/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-30 15:21:05
 * @LastEditors: by1773
 * @LastEditTime: 2020-03-31 10:39:43
 */
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


/**
 * 路由钩子函数   含6个
 * routeChangeStart
 * routeChangeComplete
 * routeChangeError
 */
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
    console.log('------我是一个异步的组件初始化的一些状态')
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
    console.log('-------',pageProps)
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