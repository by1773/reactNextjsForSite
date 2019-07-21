import dynamic from 'next/dynamic'
import WithRepoBasic from '../../components/with-repo-basic'
import DetailLoading from '../../components/DetailLoading'
const { http } = require('../../lib/util')
const MarkdownRender = dynamic(
  () => import('../../components/MarkdownRender'),
  {
    loading: () => <DetailLoading />
  }
)

const Detail = ({ readme }) => {
  return <MarkdownRender content={readme.content} isBase64={true} />
}

Detail.getInitialProps = async ({ ctx }) => {
  const { owner, name } = ctx.query
  const readmeData = await http({
    url: `/v1/repos/${owner}/${name}/readme`
  }, ctx.req)

  return {
    readme: readmeData.data
  }
}

export default WithRepoBasic(Detail, 'readme')