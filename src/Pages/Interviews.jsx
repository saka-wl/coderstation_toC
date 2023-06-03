import { useEffect, useState } from 'react'
import { getInterviewTitleAsync } from '../redux/interviewSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getTypeListAsync } from '../redux/typeSlice'
import styles from '../css/Interview.module.css'
import PageHeader from '../components/PageHeader'
import { BackTop, Tree } from 'antd'
import { getInterviewById } from '../api/interviews'

function Interviews(props) {
  const dispatch = useDispatch()
  const { interviewTitleList } = useSelector(state => state.interview)
  const { typeList } = useSelector(state => state.type)
  const [treeData, setTreeData] = useState([])
  const [interviewInfo, setInterviewInfo] = useState(null) // 根据id获取到的详细面试题内容

  const handleTitleClick = async id => {
    const { data } = await getInterviewById(id)
    setInterviewInfo(data)
  }

  useEffect(() => {
    if (interviewTitleList.length === 0) {
      dispatch(getInterviewTitleAsync())
    }
    if (typeList.length === 0) {
      dispatch(getTypeListAsync())
    }
    if (typeList.length && interviewTitleList.length) {
      let arr = []
      // 添加分类标题
      for (let i = 0; i < typeList.length; i++) {
        arr.push({
          title: <h3>{typeList[i].typeName}</h3>,
          key: i
        })
      }
      // 每一个标题下面的面试题
      for (let i = 0; i < interviewTitleList.length; i++) {
        const childArr = []
        for (let j = 0; j < interviewTitleList[i].length; j++) {
          childArr.push({
            title: (
              <h4 style={{ fontWeight: 200 }} onClick={() => handleTitleClick(interviewTitleList[i][j]._id)}>
                {interviewTitleList[i][j].interviewTitle}
              </h4>
            ),
            key: `${i} - ${j}`
          })
        }
        arr[i].children = childArr
      }
      setTreeData(arr)
    }
  }, [typeList, interviewTitleList])

  let interviewRightSide = null
  if (interviewInfo) {
    interviewRightSide = (
      <div className={styles.content}>
        <h1 className={styles.interviewRightTitle}>{interviewInfo?.interviewTitle}</h1>
        <div className={styles.contentContainer}>
          <div dangerouslySetInnerHTML={{ __html: interviewInfo?.interviewContent }}></div>
        </div>
      </div>
    )
  } else {
    interviewRightSide = (
      <div
        style={{
          textAlign: 'center',
          fontSize: 40,
          fontWeight: 100,
          marginTop: 150
        }}
      >
        请在左侧选择面试题
      </div>
    )
  }

  let backTopStyle = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: "50%",
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  }

  return (
    <div className={styles.container}>
      <PageHeader title="面试题大全"></PageHeader>
      <div className={styles.interviewContainer}>
        <div className={styles.leftSide}>
          <Tree treeData={treeData} />
        </div>
        <div className={styles.rightSide}>{interviewRightSide}</div>
      </div>
      <BackTop>
        <div style={backTopStyle}>UP</div>
      </BackTop>
    </div>
  )
}

export default Interviews
