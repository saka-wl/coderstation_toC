import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { getBookById } from '../api/books'
import styles from '../css/BookDetail.module.css'
import { Image, Modal, message } from 'antd'
import { useSelector } from 'react-redux'
import Discuss from '../components/Discuss'
import { updateUserInfoAsync } from '../redux/userSlice'
import { useDispatch } from 'react-redux'

function BookDetail(props) {
  const { id } = useParams()
  const [bookInfo, setbookInfo] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isLogin, userInfo } = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getBookById(id)
      setbookInfo(data)
    }
    if (id) fetchData()
  }, [id])

  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    if (userInfo.points - bookInfo.requirePoints < 0) {
      message.warning('积分不足，无法下载！')
    } else {
      dispatch(
        updateUserInfoAsync({
          userId: userInfo._id,
          newInfo: {
            points: userInfo.points - bookInfo.requirePoints
          }
        })
      )
      window.open(`${bookInfo.downloadLink}`);
      message.success("积分已扣除");
    }
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div>
      <PageHeader title="书籍详情"></PageHeader>
      <div className={styles.bookInfoContainer}>
        <div className={styles.leftSide}>
          <div className={styles.img}>
            <Image height={350} src={bookInfo?.bookPic} />
          </div>
          <div className={styles.link}>
            <span>
              下载所需积分: <span className={styles.requirePoints}>{bookInfo?.requirePoints}</span> 分
            </span>
            {isLogin ? (
              <div className={styles.downloadLink} onClick={showModal}>
                百度云下载地址
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.rightSide}>
          <h1 className={styles.title}>{bookInfo?.bookTitle}</h1>
          <div dangerouslySetInnerHTML={{ __html: bookInfo?.bookIntro }}></div>
        </div>
      </div>
      <div className={styles.comment}>
        <Discuss bookInfo={bookInfo} commentType={2} targetId={bookInfo._id} />
      </div>
      <Modal title="重要提示" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>
          是否使用 <span className={styles.requirePoints}>{bookInfo?.requirePoints}</span> 积分下载此书籍？
        </p>
      </Modal>
    </div>
  )
}

export default BookDetail
