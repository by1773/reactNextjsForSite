import Link from 'next/link'
import { Icon } from 'antd'
import { formatDate } from '../lib/util'

function getLicense(license) {
  return license ? `${license.spdx_id} license` : ''
}

function formatStarCount(num) {
  const str = num.toString()
  const len = str.length
  if(len > 3) {
    const before = str.substring(0, len-3)

    return `${before}K`
  }

  return num
}

export default ({repo}) => {
  return (
    <div className="repo-wrapper">
      <div className="basic-info">
        <h3 className="repo-title">
          <Link href={`/detail?owner=${repo.owner ? repo.owner.login : ''}&name=${repo.name || ''}`}>
            <a href="javascript:;">{repo.full_name}</a>
          </Link>
        </h3>
        <p className="repo-desc">{repo.description}</p>
        <p className="other-info">
          {
            repo.license ? <span className="license">{getLicense(repo.license)}</span> : null
          }
          <span className="last-updated">{formatDate(repo.updated_at)}</span>
          <span className="open-issues">{repo.open_issues_count} open issues</span>
        </p>
      </div>
      <div className="lang-star">
        <span className="lang">{repo.language}</span>
        <span className="stars">
          {formatStarCount(repo.stargazers_count)} <Icon type="star" theme="filled" />
        </span>
      </div>
      <style jsx>{`
        .repo-wrapper {
          display: flex;
          justify-content: space-between;
        }
        .repo-wrapper + .repo-wrapper {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .repo-title {
          font-size: 20px;
        }
        .lang-star {
          display: flex;
        }
        .lang-star span {
          width: 120px;
          text-align: right;
        }
        .repo-desc {
          width: 400px;
        }
        .other-info>span + span {
          margin-left: 10px;
        }
      `}</style>
    </div>
  )
}