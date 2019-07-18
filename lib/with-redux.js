import React, { Component } from 'react'
import { createStore } from '../store'
const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialStore) {
  if(isServer) {
    return createStore(initialStore)
  }
  if (window && !window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = createStore(initialStore)
  }

  return window[__NEXT_REDUX_STORE__]
}

export default Comp => {
  class HocComp extends Component {
    constructor(){
      super(...arguments)
      this.reduxStore = getOrCreateStore(this.props.initialReduxState)
    }

    render() {
      return <Comp {...this.props} reduxStore={this.reduxStore} />
    }
  }

  HocComp.getInitialProps = async (appCtx) => {
    let reduxStore
    if(isServer) {
      const { req } = appCtx.ctx
      const session = req.session
      if (session && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo
        })
      } else {
        reduxStore = getOrCreateStore()
      }
    }else{
      reduxStore = getOrCreateStore()
    }
    appCtx.ctx.reduxStore = reduxStore
    let appProps = {}
    if(typeof Comp.getInitialProps === 'function') {
      appProps = await Comp.getInitialProps(appCtx)
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState()
    }
  }

  return HocComp
}