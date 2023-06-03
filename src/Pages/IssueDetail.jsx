import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getIssueById } from '../api/issue'

import styles from '../css/IssueDetail.module.css'
import PageHeader from '../components/PageHeader'
import Recommend from '../components/Recommend'
import ScoreRank from '../components/ScoreRank'

import { getUserById } from '../api/user'
import { Avatar } from 'antd'
import { formatDate } from '../utils/tools'
import Discuss from '../components/Discuss'

/**
 * 问答详情
 * @param {*} props
 * @returns
 */
function IssueDetail(props) {
  const { id } = useParams()
  const [issueInfo, setIssueInfo] = useState(null)
  const [issueUser, setIssueUser] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const { data } = await getIssueById(id)
      setIssueInfo(data)
      const user = await getUserById(data.userId)
      setIssueUser(user.data)
    }
    if (id) {
      fetchData()
    }
  }, [id])

  return (
    <div className={styles.container}>
      <PageHeader title="问题详情" />
      <div className={styles.detailContainer}>
        <div className={styles.leftSide}>
          {/* 问答详情 */}
          <div className={styles.question}>
            <h1>{issueInfo?.issueTitle}</h1>
            <div className={styles.questioner}>
              <Avatar src={issueUser?.avatar}></Avatar>
              <span className={styles.user}>{issueUser?.nickname}</span>
              <span>发布于:{formatDate(issueInfo?.issueDate)}</span>
            </div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: issueInfo?.issueContent }}></div>
            </div>
          </div>
          {/* 评论 */}
          <Discuss
            commentType={1}
            targetId={issueInfo?._id}
            issueInfo={issueInfo}
          />
        </div>
        <div className={styles.rightSide}>
          <Recommend />
          <ScoreRank />
        </div>
      </div>
    </div>
  )
}

export default IssueDetail
