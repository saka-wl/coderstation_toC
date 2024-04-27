import { useRef, useState, useEffect } from 'react'
import { Comment, Avatar, Form, Button, List, Tooltip, Pagination, message, Input } from 'antd'
import { useSelector } from 'react-redux'
import { UserOutlined } from '@ant-design/icons'
import { Editor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
import { getBookCommentById, getIssueCommentById, updateIssue, updateBook } from '../api/comment'
import { useParams } from 'react-router-dom'
import { getUserById } from '../api/user'
import { formatDate } from '../utils/tools'
import { addIssueCommentById } from '../api/comment'
import { updateUserInfoAsync } from '../redux/userSlice'
import { useDispatch } from 'react-redux'
import styles from '../css/Discuss.module.css'

/**
 * 评论组件
 * @param {*} props
 * @returns
 */
function Discuss(props) {
  const dispatch = useDispatch()
  const { userInfo, isLogin } = useSelector(state => state.user)
  const [commentList, setCommentList] = useState([])
  const [value, setValue] = useState('')
  const [refresh, setRefreh] = useState(false)
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  const editorRef = useRef()

  let avatar = null
  if (isLogin) {
    avatar = <Avatar src={userInfo.avatar} />
  } else {
    avatar = <Avatar icon={<UserOutlined />} />
  }

  useEffect(() => {
    async function fetchData() {
      let data = null
      if (props.commentType === 1) {
        // 问答模块，需要获取问答id的评论
        const res = await getIssueCommentById(props.targetId, {
          current: pageInfo.current,
          pageSize: pageInfo.pageSize
        })
        data = res.data
      } else if (props.commentType === 2) {
        // 书籍模块
        const res = await getBookCommentById(props.targetId, {
          current: pageInfo.current,
          pageSize: pageInfo.pageSize
        })
        data = res.data
      }
      if(data.data.length > 0) {
        for (let i = 0; i < data.data.length; i++) {
          const resp = await getUserById(data.data[i].userId)
          data.data[i].userInfo = resp.data
        }
      }
      setCommentList(data.data)
      setPageInfo({
        current: data.currentPage,
        pageSize: data.eachPage,
        total: data.count
      })
    }
    if (props.targetId) fetchData()
  }, [props.targetId, refresh])

  const handlePageChange = e => {
    let obj = pageInfo
    obj.current = e
    setPageInfo(obj)
    setRefreh(!refresh)
  }

  const handleAddClick = async () => {
    let newComment = null
    if (props.commentType === 1) {
      // 新增问答评论
      newComment = editorRef.current.getInstance().getHTML()
      if (newComment === '<p><br></p>') {
        newComment = ''
      }
    } else if (props.commentType === 2) {
      // 新增书籍评论
      newComment = value
    }
    if (newComment === '') {
      message.warning('请输入评论！')
      return
    }
    // 提交评论
    let resp = null
    if (props.commentType === 1) {
      resp = await addIssueCommentById({
        userId: userInfo._id,
        typeId: props.issueInfo.typeId,
        commentContent: newComment,
        commentType: 1,
        issueId: props.targetId,
        bookId: null
      })
      // 更新改评论数
      updateIssue(props.targetId, {
        commentNumber: props.issueInfo.commentNumber + 1
      })
      editorRef.current.getInstance().setHTML('')
    } else if (props.commentType === 2) {
      resp = await addIssueCommentById({
        userId: userInfo._id,
        typeId: props.bookInfo.typeId,
        commentContent: newComment,
        commentType: 2,
        issueId: null,
        bookId: props.targetId
      })
      updateBook(props.targetId, {
        commentNumber: props.bookInfo.commentNumber + 1
      })
      setValue('')
    }
    setRefreh(!refresh)
    // 更新积分的变化
    dispatch(
      updateUserInfoAsync({
        userId: userInfo._id,
        newInfo: {
          points: userInfo.points + 4
        }
      })
    )
  }

  return (
    <div>
      {/* 评论框 */}
      <Comment
        avatar={avatar}
        content={
          <>
            <Form>
              <Form.Item>
                {props.commentType === 1 ? 
                <Editor initialValue="" previewStyle="vertical" height="300px" useCommandShortcut={true} language="zh-CN" ref={editorRef} /> 
                : 
                <Input.TextArea rows={4} placeholder={isLogin ? '' : '请登录后评论...'} value={value} onChange={e => setValue(e.target.value)} />
                }
              </Form.Item>
              <Form.Item>
                <Button type="primary" disabled={!isLogin} onClick={handleAddClick}>
                  添加评论
                </Button>
              </Form.Item>
            </Form>
          </>
        }
      />
      {/* 评论列表 */}
      {commentList.length > 0 && (
        <List
          header="当前评论"
          dataSource={commentList}
          renderItem={item => (
            <Comment
              avatar={<Avatar src={item.userInfo.avatar} />}
              content={<div dangerouslySetInnerHTML={{ __html: item.commentContent }}></div>}
              datetime={
                <Tooltip title={formatDate(item.commentDate)}>
                  <span>{formatDate(item.commentDate, 'year')}</span>
                </Tooltip>
              }
            />
          )}
        />
      )}
      {/* 分页 */}
      {commentList.length === 0 ? (
        <div
          style={{
            fontWeight: '200',
            textAlign: 'center',
            margin: '50px'
          }}
        >
          暂无评论
        </div>
      ) : (
        ''
      )}
      {pageInfo.total > 10 ? (
        <Pagination
          defaultCurrent={pageInfo.current}
          total={pageInfo.total}
          onChange={handlePageChange}
          showQuickJumper
          style={{
            margin: 50
          }}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default Discuss
