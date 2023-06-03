import { useState, useRef } from 'react'
import { Form, Input, Select, Button, message } from 'antd'
import styles from '../css/AddIssue.module.css'
import { useSelector } from 'react-redux'
import { typeOptionCreator } from '../utils/tools'
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
import { getTypeListAsync } from '../redux/typeSlice'
import { addIssue } from '../api/issue'
import { useNavigate } from 'react-router-dom'

/**
 * 添加问答页面
 * @param {} props
 * @returns
 */
function AddIssue(props) {
  const formRef = useRef()
  const editorRef = useRef()
  const navigator = useNavigate()
  const [issueInfo, setIssueInfo] = useState({
    issueTitle: '',
    issueContent: '',
    userId: '',
    typeId: ''
  })
  const { typeList } = useSelector(state => state.type)
  const { userInfo } = useSelector(state => state.user)
  if(typeList === "" || typeList === null) {
    getTypeListAsync()
  }

  const updateInfo = (val, key) => {
    let obj = { ...issueInfo }
    obj[key] = val
    setIssueInfo(obj)
  }

  const onReset = () => {
    setIssueInfo({
      issueTitle: '',
      issueContent: '',
      userId: '',
      typeId: ''
    })
  }
  const addInfo = () => {
    const content = editorRef.current.getInstance().getHTML()
    addIssue({
      issueTitle: issueInfo.issueTitle,
      issueContent: content,
      userId: userInfo._id,
      typeId: issueInfo.typeId
    })
    navigator("/")
    message.success("你的问题已经提交，正在审核...")
  }

  return (
    <div className={styles.container}>
      <Form name="control-hooks" style={{ maxWidth: 2000 }} ref={formRef} onFinish={addInfo}>
        <Form.Item name="title" label="标题" rules={[{ required: true }]}>
          <Input value={issueInfo.issueTitle} onChange={e => updateInfo(e.target.value, 'issueTitle')} size='large'/>
        </Form.Item>
        <Form.Item name="questions" label="问题分类" rules={[{ required: true }]}>
          <Select placeholder="" onChange={e => updateInfo(e, 'typeId')} allowClear value={issueInfo.typeId} size='large' style={{
            width: "300px"
          }}>
            {typeOptionCreator(Select, typeList)}
          </Select>
        </Form.Item>

        <Form.Item
          label="问题描述"
          name="issueContent"
          rules={[{ required: true }]}
          
        >
          <Editor
            initialValue=""
            previewStyle="vertical"
            height="600px"
            useCommandShortcut={true}
            language='zh-CN'
            ref={editorRef}
          />
        </Form.Item>

        <Form.Item wrapperCol={{
          offset: 20,
          span: 10
        }}>
          <Button type="primary" htmlType="submit" style={{
            marginRight: 20
          }}>
            Submit
          </Button>
          <Button htmlType="reset" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddIssue
