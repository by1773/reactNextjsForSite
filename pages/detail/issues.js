import { useState, useCallback, useEffect } from 'react'
import { Avatar, Button, Select, Empty, Spin } from 'antd'
import dynamic from 'next/dynamic'
const { http, formatDate } = require('../../lib/util')
import DetailLoading from '../../components/DetailLoading'
import WithRepoBasic from '../../components/with-repo-basic'
import SearchUser from '../../components/SearchUser'

const MarkdownRender = dynamic(
  () => import('../../components/MarkdownRender'),
  {
    loading: () => <DetailLoading />
  }
)
const isServer = typeof window === 'undefined'
const CACHE = {}
const Option = Select.Option

function Label({ label={} }) {
  return (
    <>
      <span
        className="label"
        style={{backgroundColor: `#${label.color}`}}>{label.name || ''}</span>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding: 3px 6px;
          border-radius: 3px;
          font-size: 14px;
        }
      `}</style>
    </>
  )
}

function IssueDetail({issue}) {
  return (
    <div className="box">
      <MarkdownRender content={issue.body} />
      <div className="actions">
        <Button 
          href={issue.html_url} 
          target="_blank">打开Issue讨论页面</Button>
      </div>
      <style jsx>{`
        .box {
          background: #f8f8f8;
          padding: 20px;
        }
        .actions {
          text-align: right;
        }
      `}</style>
    </div>
  )
}

function IssuesItem({ issue }){
  const [showDetail, setShowDetail] = useState(false)

  const toggleShowDetail = useCallback(() => {
    setShowDetail(detail => !detail)
  }, [])
  

  return (
    <div className="box">
      <div className="issue">
        <Button 
          type="primary" 
          size="small"
          onClick={toggleShowDetail}
          style={{position: 'absolute', right: 10, top: 10}}>
          {
            showDetail ? '隐藏' : '查看'
          }
          </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            {
              issue.labels && issue.labels.map(lab => <Label label={lab} key={lab.id} />)
            }
          </h6>
          <p className="sub-info">
            <span>Updated at {formatDate(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }
          .issue:hover {
            background: #fafafa;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .main-info h6 {
            padding-right: 40px;
            max-width: 600px;
            font-size: 16px;
          }
          .avatar {
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}</style>
      </div>
        {
          showDetail ? <IssueDetail issue={issue} /> : null
        }
    </div>
  )
}

function makeQuery(creator='', state='', labels=[]) {
  let arr = []
  let labelStr = ''
  if(labels && labels.length > 0) {
    labelStr = `labels=${labels.join(',')}`
  }
  if(creator) {
    arr.push(`&creator=${creator}`)
  }
  if (state) {
    arr.push(`&state=${state}`)
  }
  if (labelStr) {
    arr.push(labelStr)
  }
  return `?${arr.join('&')}`
}

const Issues = ({ initialIssues=[], labels=[], owner, name }) => {

  const [creator, setCreator] = useState()
  const [status, setStatus] = useState()
  const [label, setLabel] = useState([])
  const [issues, setIssues] = useState(initialIssues)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if(!isServer) {
      CACHE[`${owner}/${name}`] = labels
    }
  }, [labels, owner, name])

  const handleCreatorChange = useCallback((val) => {
    setCreator(val)
  }, [])

  const handleStatusChange = useCallback((val) => {
    setStatus(val)
  }, [])

  const handleLabelChange = useCallback((val) => {
    setLabel(val)
  }, [])

  const handleSearch = useCallback(() => {
    setFetching(true)
    http({
      url: `/v1/repos/${owner}/${name}/issues${makeQuery(creator, status, label)}`
    }).then(resp => {
      setFetching(false)
      setIssues(resp.data)
    }).catch(err => {
      setFetching(false)
      console.error(err)
    })
  }, [owner, name, creator, status, label])

  return (
    <div className="issues-wrapper">
      <div className="search">
        <SearchUser onChange={handleCreatorChange} value={creator} />
        <Select
          placeholder="状态"
          onChange={handleStatusChange}
          value={status}
          style={{ width: 200,marginLeft: 20 }}
        >
          <Option value="all">全部</Option>
          <Option value="open">打开</Option>
          <Option value="closed">关闭</Option>
        </Select>
        <Select
          mode="multiple"
          placeholder="Lable"
          onChange={handleLabelChange}
          value={label}
          style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}
        >
          {
            labels.map(lab => <Option value={lab.name} key={lab.id}>{lab.name}</Option>)
          }
        </Select>
        <Button 
          type="primary"
          onClick={handleSearch}
          disabled={fetching}
          >搜索</Button>
      </div>

      {
        fetching ? <DetailLoading /> : (
          <div className="issues">
            {
              issues.length > 0
                ? issues.map(issue => <IssuesItem issue={issue} key={issue.id} />)
                : <Empty description="暂无数据" />
            }
          </div>
        )
      }
      
      <style jsx>{`
        .issues {
          border: 1px solid #eee;
          border-radius: 5px;
          margin-bottom: 20px;
          margin-top: 20px;
        }
        .search {
          display: flex;
        }
      `}</style>
    </div>
  )
}

Issues.getInitialProps = async ({ ctx }) => {
  const { owner, name } = ctx.query
  const fullName = `${owner}/${name}`

  const fetchs = await Promise.all([
    http({
      url: `/v1/repos/${owner}/${name}/issues`
    }, ctx.req),
    CACHE[fullName] ? Promise.resolve({ data: CACHE[fullName]}) : await http({
      url: `/v1/repos/${owner}/${name}/labels`
    }, ctx.req)
  ])

  return {
    initialIssues: fetchs[0].data,
    labels: fetchs[1].data,
    owner,
    name
  }
}

export default WithRepoBasic(Issues, 'issues')