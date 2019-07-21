import { Spin } from 'antd'

export default () => {
  return (
    <div className="detail-loading">
      <Spin
        size="large" />
      <style jsx>{`
        .detail-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
        }
      `}</style>
    </div>
  )
}