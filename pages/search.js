import { withRouter } from 'next/router'
import Link from 'next/link'
import Router from 'next/router'
import { Row, Col, List } from 'antd'
import {
  searchLanguages,
  searchSortTypes
} from '../config/config'
const { http } = require('../lib/util')

const Search = ({router, repos}) => {
  
  const { query } = router
  const handleLanguageChange = (language) => {
    Router.push({
      pathname: '/search',
      query: {
        ...query,
        language
      }
    })
  }

  const handleSortChange = (sort) => {
    Router.push({
      pathname: '/search',
      query: {
        ...query,
        sort: sort.value,
        order: sort.order
      }
    })
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
              return (
                <List.Item>
                  <a href="javascript:;" onClick={() => handleLanguageChange(item)}>{item}</a>
                </List.Item>
              )
            }} />

          <List
            bordered
            header={<span className="list-header">排序</span>}
            style={{ marginBottom: 20 }}
            dataSource={searchSortTypes}
            renderItem={item => {
              return (
                <List.Item>
                  <a href="javascript:;" onClick={() => handleSortChange(item)}>{item.name}</a>
                </List.Item>
              )
            }} />
        </Col>
      </Row>
    </div>
  )
}

Search.getInitialProps = async ({ctx}) => {
  const {
    order = 'desc',
    per_page=20,
    q,
    sort,
    language,
    page=1
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
    queryString += `&page=${page}&pre_page=${per_page}`
  }

  const result = await http({
    url: `/v1/search/repositories${queryString}`
  }, ctx.req)

  return {
    repos: result.data
  }
}

export default withRouter(Search)