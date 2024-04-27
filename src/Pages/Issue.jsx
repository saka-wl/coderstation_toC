import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import styles from '../css/Issue.module.css'
import { getIssueByPage } from '../api/issue'
import IssueItems from '../components/IssueItems'
import { Pagination } from 'antd'
import AddIssueBtn from '../components/AddIssueBtn'
import Recommend from '../components/Recommend'
import ScoreRank from '../components/ScoreRank'
import TypeSelect from '../components/TypeSelect'
import { useSelector } from 'react-redux'

function Issue(props) {
  const [issueInfo, setIssueInfo] = useState([])
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })
  const { issueTypeId } = useSelector(state => state.type)
  let typeTarget = 'all'

  const onPageChange = val => {
    if (val === pageInfo.current) return
    let obj = { ...pageInfo }
    obj.current = val
    setPageInfo(obj)
  }

  const showPageTotal = () => {
    return '一共' + pageInfo.total + '个问题'
  }


  useEffect(() => {
    const fetchData = async () => {
      let searchParams = {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
        issueStatus: true
      }
      if(typeTarget !== issueTypeId) {
        searchParams.typeId = issueTypeId
        searchParams.current = 1
        typeTarget = issueTypeId
      }
      const { data } = await getIssueByPage(searchParams)
      setIssueInfo(data?.data)
      setPageInfo({
        current: data?.currentPage,
        pageSize: data?.eachPage,
        total: data?.count
      })
    }
    fetchData()
  }, [issueTypeId, pageInfo.current, pageInfo.pageSize])

  let issueList = []
  if(issueInfo?.length > 0) {
    for (let i = 0; i < issueInfo.length; i++) {
      issueList.push(<IssueItems key={i} issueInfo={issueInfo[i]} />)
    }
  }

  return (
    <div className={styles.container}>
      {/* 头部区域 */}
      <PageHeader title="问答列表">
        <TypeSelect></TypeSelect>
      </PageHeader>
      <div className={styles.issueContainer}>
        {/* 左边区域 */}
        <div className={styles.leftSide}>
          {issueList}
          {/* 分页 */}
          {issueInfo.length > 0 ? (
            <div className="paginationContainer">
              <Pagination showQuickJumper defaultCurrent={pageInfo.current} total={pageInfo.total} onChange={onPageChange} showTotal={showPageTotal} />
            </div>
          ) : (
            <div
              style={{
                fontWeight: '200',
                textAlign: 'center',
                margin: '50px'
              }}
            >
              暂无相关内容
            </div>
          )}
        </div>
        {/* 右边区域 */}
        <div className={styles.rightSide}>
          <AddIssueBtn />
          <Recommend />
          <ScoreRank />
        </div>
      </div>
    </div>
  )
}

export default Issue
