import { useEffect } from 'react'
import Link from 'next/link'
import { withRouter } from 'next/router'
import Repo from './Repo'
const { http, Cache } = require('../lib/util')

const cache = new Cache()
const isServer = typeof window === 'undefined'

function makeQuery(queryObj) {
  const query = Object.entries(queryObj).reduce((result, entry) => {
    result.push(entry.join('='))
    return result
  }, []).join('&')

  return `?${query}`
}

export default (Comp, type="readme") => {
  const WithComp = ({ router, repoBasic = {}, ...rest }) => {

    const query = makeQuery(router.query)

    useEffect(() => {
      if (!isServer) {
        cache.setCache(repoBasic)
      }
    }, [])

    return (
      <div className="detail-wrapper">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            {
              type === 'readme' 
              ? <span className="tab">Readme</span>
              : (
                <Link href={`/detail${query}`}>
                  <a className="tab readme">Readme</a>
                </Link>
              )
            }
            {
              type === 'issues'
                ? <span className="tab">Issues</span>
                : (
                  <Link href={`/detail/issues${query}`}>
                    <a className="tab issues">Issues</a>
                  </Link>
                )
            }
          </div>
        </div>
        <div><Comp {...rest} /></div>
        <style jsx>{`
        .detail-wrapper {
          padding-top: 20px;
        }
        .repo-basic {
          padding: 20px;
          border: 1px solid #eee;
          margin-bottom: 20px;
          border-radius: 5px;
        }
        .tab + .tab {
          margin-left: 20px;
        }
      `}</style>
      </div>
    )
  }

  WithComp.getInitialProps = async (context) => {
    const { ctx } = context
    const { owner, name } = ctx.query

    const full_name = `${owner}/${name}`

    let compData = {}

    if(Comp.getInitialProps) {
      compData = await Comp.getInitialProps(context)
    }

    if (cache.getCache(full_name)) {
      return {
        repoBasic: cache.getCache(full_name),
        ...compData
      }
    }

    const repoBasicData = await http({
      url: `/v1/repos/${owner}/${name}`
    }, ctx.req)

    return {
      repoBasic: repoBasicData.data,
      ...compData
    }
  }

  return withRouter(WithComp)
}