import { Spin } from 'antd'

export default () => {
  return (
    <div className="page-loading">
      <Spin 
        tip="Loading..." 
        size="large" />
      <style jsx>{`
        .page-loading {
          position: fixed;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(230,247,255,.4);
          z-index: 10001;
        }
      `}</style>
    </div>
  )
}