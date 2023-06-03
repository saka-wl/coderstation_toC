import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from '../css/SearchPage.module.css'
import PageHeader from './PageHeader'
import AddIssueBtn from './AddIssueBtn'
import Recommend from './Recommend'
import ScoreRank from './ScoreRank'
import { getIssueByPage } from '../api/issue'
import { getBooksByPage } from '../api/books'
import SearchResultItem from './SearchResultItem'

/**
 * 搜索结果页
 * @param {*} props
 * @returns
 */
function SearchPage(props) {
  const location = useLocation()
  const [searchResult, setSearchResult] = useState([])
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  useEffect(() => {
    async function fetchData(state) {
      const { value, searchOption } = state
      let searchParams = {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
        issueState: true
      }
      switch (searchOption) {
        case 'issue': {
          searchParams.issueTitle = value
          const { data } = await getIssueByPage(searchParams)
          setSearchResult(data.data)
          setPageInfo({
            current: data.currentPage,
            pageSize: data.eachPage,
            total: data.count
          })
          break
        }
        case 'book': {
          searchParams.bookTitle = value
          const { data } = await getBooksByPage(searchParams)
          setSearchResult(data.data)
          setPageInfo({
            current: data.currentPage,
            pageSize: data.eachPage,
            total: data.count
          })
          break
        }
      }
    }
    if (location.state) fetchData(location.state)
  }, [location.state])

  return (
    <div className={styles.container}>
      <PageHeader title="搜索结果"></PageHeader>
      <div className={styles.searchPageContainer}>
        {/* 左边部分 */}
        <div className={styles.leftSide}>
          {searchResult.map((it, index) => {
            return <SearchResultItem info={it} key={it._id} />
          })}
        </div>
        {/* 右边部分 */}
        {location.state.searchOption === 'issue' ? (
          <div className={styles.rightSide}>
            <AddIssueBtn />
            <div style={{ marginBottom: 20 }}>
              <Recommend />
            </div>
            <div style={{ marginBottom: 20 }}>
              <ScoreRank />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default SearchPage
