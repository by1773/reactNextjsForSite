import { memo, isValidElement, useEffect } from 'react'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { Row, Col, List, Pagination } from 'antd'
import {
  searchLanguages,
  searchSortTypes
} from '../config/config'
import Repo from '../components/Repo'
const { http, Cache } = require('../lib/util')

const cache = new Cache()

const selectedItemStyle = {
  borderLeft: '2px solid #e36209',
  fontWeight: 700
}

const isServer = typeof window === 'undefined'

/**
 * 用于处理antd翻页按钮的onChange属性（因为这个属性是必传的）
 */
function noop() {}

const FilterLink = memo(({name, q, language, sort, order, page, per_page}) => {

  let queryString = `?q=${q}`
  if (language) {
    queryString += `&language=${language}`
  }
  if (sort) {
    queryString += `&sort=${sort}&order=${order}`
  }
  if (page) {
    queryString += `&page=${page}&per_page=${per_page}`
  }

  return (
    <Link href={`/search${queryString}`}>
      {
        isValidElement(name) ? name : <a>{name}</a>
      }
    </Link>
  )
})

const Search = ({router, repos={}}) => {
  const { query } = router
  const { page=1, per_page=30 } = query

  if (!isServer) {
    useEffect(() => {
      cache.setArrayCache(repos.items)
    }, [])
  }

  return (
    <div className="search-wrapper">
      <Row gutter={20}>
        <Col span={6}>
          <List 
            bordered
            header={<span className="list-header">语言</span>}
            style={{marginBottom: 20}}
            dataSource={searchLanguages}
            renderItem={item => {
              const selected = query.language === item
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {
                    selected
                    ? <span>{item}</span>
                    : <FilterLink {...{ ...query, language: item, name: item}} />
                  }
                </List.Item>
              )
            }} />

          <List
            bordered
            header={<span className="list-header">排序</span>}
            style={{ marginBottom: 20 }}
            dataSource={searchSortTypes}
            renderItem={item => {
              let selected = false
              if (item.name === 'Best Match' && !query.sort) {
                selected = true
              } else if (item.value === query.sort && item.order === query.order) {
                selected = true
              }
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {
                    selected 
                    ? <span>{item.name}</span>
                    : <FilterLink {...{ ...query, name: item.name, sort: item.value || '', order: item.order || '' }} />
                  }
                </List.Item>
              )
            }} />
        </Col>
        <Col span={18}>
          <h3 className="repos-title">{repos.total_count || 0} 个仓库</h3>
          {
            repos.items && repos.items.map(repo => < Repo repo = {
                  repo
                }
                key = {
                  repo.id
                }
                />)
          }
          <div className="pagination">
            <Pagination
              pageSize={Number(per_page)}
              current={Number(page)}
              total={1000}
              onChange={noop}
              itemRender={(current_page, type, ol) => {
                // github默认只能访问1000条数据，超过就无法访问

                const pageTotal = Math.ceil(1000 / per_page)
                let p = current_page
                switch (type) {
                  case 'prev':
                    p = (parseInt(page) - 1) <= 1 ? 1 : parseInt(page) - 1
                    break;
                  case 'next':
                    p = (parseInt(page) + 1) >= pageTotal ? pageTotal : parseInt(page) + 1
                    break;
                  default:
                    break;
                }
                const name = type === 'page' ? current_page : ol
                return <FilterLink {...{ ...query, page: p, name: name }} />
              }}/>
          </div>
        </Col>
      </Row>
      <style jsx>{`
        .search-wrapper {
          padding: 20px 0;
        }
        .list-header {
          font-weight: 800;
          font-size: 16px;
        }
        .repos-title {
          border-bottom: 1px solid #eee;
          font-size: 24px;
          line-height: 1.6;
        }
        .pagination {
          padding: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Search.getInitialProps = async ({ctx}) => {
  const {
    order = 'desc',
    per_page=30,
    page=1,
    q,
    sort,
    language
  } = ctx.query
  if (!q) {
    return {
      repos: {
        total_count: 0
      }
    }
  }

  // ?q=react+language:javascript&sort=stars&order=desc&page=1&per_page=20
  let queryString = `?q=${q}`
  if (language) {
    queryString += `+language:${language}`
  }
  if (sort) {
    queryString += `&sort=${sort}&order=${order}`
  }
  if (page) {
    queryString += `&page=${page}&per_page=${per_page}`
  }

  const result = await http({
    url: `/v1/search/repositories${queryString}`
  }, ctx.req)

  return {
    repos: result.data
  }
}

export default withRouter(Search)