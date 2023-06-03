import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getTypeListAsync } from '../redux/typeSlice'
import { updateIssueTypeId, updateBookTypeId } from '../redux/typeSlice'
import { useLocation } from 'react-router-dom'
import { Tag } from 'antd'

function TypeSelect(props) {
  const { typeList } = useSelector(state => state.type)
  const dispatch = useDispatch()
  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']
  const [tagContainer, setTagContainer] = useState([])
  const location = useLocation()

  const handleTagClick = (typeId) => {
    console.log(location)
    if(location.pathname === '/issue') {
      // 问答页面
      dispatch(updateIssueTypeId(typeId))
    }else if(location.pathname === '/books'){
      // 书籍页面
      dispatch(updateBookTypeId(typeId))
    }
  }

  useEffect(() => {
    if (!typeList.length) {
      dispatch(getTypeListAsync())
    }
    if (typeList.length) {
      const arr = []
      arr.push(
        <Tag color="magenta" value="all" key="all" style={{ cursor: 'pointer' }} onClick={() => handleTagClick('all')}>
          全部
        </Tag>
      )
      for (let i = 0; i < typeList.length; i++) {
        arr.push(
          <Tag color={colorArr[i % colorArr.length]} value={typeList[i]._id} key={typeList[i]._id} style={{ cursor: 'pointer' }} onClick={() => handleTagClick(typeList[i]._id)}>
            {typeList[i].typeName}
          </Tag>
        )
        setTagContainer(arr)
      }
    }
  }, [typeList])

  return <div>{tagContainer}</div>
}

export default TypeSelect
