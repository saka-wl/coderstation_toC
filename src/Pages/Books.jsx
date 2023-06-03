import { getBooksByPage } from '../api/books'
import PageHeader from '../components/PageHeader'
import TypeSelect from '../components/TypeSelect'
import styles from '../css/Books.module.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, Pagination } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { useNavigate } from 'react-router-dom'

function Books(props) {
  const { bookTypeId } = useSelector(state => state.type)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [booksInfo, setbooksInfo] = useState([])
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })
  let typeTarget = 'all'

  useEffect(() => {
    async function fetchData() {
      let searchParams = {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
        issueStatus: true
      }
      if(typeTarget !== bookTypeId) {
        searchParams.typeId = bookTypeId
        searchParams.current = 1
        typeTarget = bookTypeId
      }
      const { data } = await getBooksByPage(searchParams)
      setbooksInfo(data.data)
      setPageInfo({
        current: data.currentPage,
        total: data.count,
        pageSize: data.eachPage
      })
      setIsLoading(false)
    }
    if (bookTypeId) fetchData()
  }, [bookTypeId, pageInfo.current, pageInfo.pageSize])

  let booksList = []
  for (let i = 0; i < booksInfo.length; i++) {
    booksList.push(
      <Card
        bordered={true}
        loading={isLoading}
        style={{ width: 200, marginBottom: 30 }}
        key={i*Math.random()}
        hoverable
        onClick={() => {
          navigate('/books/' + booksInfo[i]._id)
        }}
        cover={
          <img
            alt={booksInfo[i].bookTitle}
            style={{
              width: 160,
              height: 200,
              margin: 'auto',
              marginTop: 10
            }}
            src={booksInfo[i].bookPic}
          />
        }
      >
        <Meta title={booksInfo[i].bookTitle} />
        <div className={styles.numberContainer}>
          <div>浏览数：{booksInfo[i]?.scanNumber}</div>
          <div>评论数：{booksInfo[i]?.commentNumber}</div>
        </div>
      </Card>
    )
  }
  if (booksInfo.length % 5 !== 0) {
    var blank = 5 - (booksInfo.length % 5)
    for (let i = 1; i <= blank; i++) {
      booksList.push(<div style={{ width: 220, marginBottom: 20 }} key={i * Math.random()}></div>)
    }
  }

  const handlePageChange = e => {
    if (pageInfo.current === e) return
    let obj = { ...pageInfo }
    obj.current = e
    setPageInfo(obj)
  }

  return (
    <div>
      <PageHeader title="最新资源">
        <TypeSelect />
      </PageHeader>
      {/* 书本内容 */}
      <div className={styles.bookContainer}>{booksList}</div>
      {/* 分页 */}
      {booksInfo.length > 0 ? (
        <Pagination
          style={{
            width: '100%',
            padding: 0,
            marginTop: '50px',
            marginBottom: '50px',
            textAlign: 'center'
          }}
          defaultCurrent={pageInfo.current}
          total={pageInfo.total}
          showQuickJumper
          onChange={handlePageChange}
        ></Pagination>
      ) : (
        <div
          style={{
            fontSize: '26px',
            fontWeight: '200',
            textAlign: 'center',
            margin: '30px 0'
          }}
        >
          该分类下暂无书籍
        </div>
      )}
    </div>
  )
}

export default Books
