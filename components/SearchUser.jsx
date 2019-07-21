import { useState, useCallback, useRef } from 'react'
import { Select, Spin, Empty } from 'antd'
import { debounce, hasIn} from 'lodash' 
const { http } = require('../lib/util')

const Option = Select.Option

const SearchUser = ({ onChange, value }) => {
  const lastFetchIdRef = useRef(0)
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])

  const fetchUser = useCallback(debounce(val => {
    lastFetchIdRef.current += 1
    const fetchId = lastFetchIdRef.current
    setFetching(true)
    setOptions([])

    http({
      url: `/v1/search/users?q=${val}`
    }).then(resp => {
      if(fetchId !== lastFetchIdRef.current) {
        return
      }
      const data = hasIn(resp, 'data.items') && resp.data.items.map(user => ({
        text: user.login,
        value: user.login
      }))
      setFetching(false)
      setOptions(data)
    })
  }, 500), [])

  const handleChange = (val) => {
    setOptions([])
    setFetching(false)
    onChange(val)
  }

  return (
    <Select
      value={value}
      showSearch={true}
      notFoundContent={fetching ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
      filterOption={false}
      placeholder="创建者"
      allowClear={true}
      onSearch={fetchUser}
      onChange={handleChange}
      style={{width: 300}}
      >
        {
          options && options.map(option => (
            <Option value={option.value} key={option.value}>{option.text}</Option>
          ))
        }
      </Select>
  )
}

export default SearchUser
