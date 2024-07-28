import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { changeFileInfo, deleteFile, getAllUserFiles } from "../utils/request"
import { Button, Input, Modal, Popconfirm, Table, message } from "antd";
import "../css/MyFileList.css"

function MyFileList() {

    const { userInfo } = useSelector(state => state.user)
    const [fileList, setFileList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPwd, setNewPwd] = useState("")
    const [activeFileId, setActiveFileId] = useState("")

    const showChangePwdModal = (_id, pwd) => {
        setNewPwd(pwd)
        setActiveFileId(_id)
        setIsModalOpen(true);
    };

    const handleChangePwdOk = async () => {
        const resp = await changeFileInfo(activeFileId, { pwd: newPwd })
        if (resp.code == 0) {
            setIsModalOpen(false);
            let tmp = fileList
            tmp.forEach(item => {
                if (item._id === activeFileId) {
                    item.pwd = newPwd
                }
            })
            message.success('修改成功')
            setFileList([...tmp])
            setNewPwd("")
            setActiveFileId("")
        } else {
            message.error('修改失败')
            setIsModalOpen(false);
            setNewPwd("")
            setActiveFileId("")
        }
    };

    const handleChangePwdCancel = () => {
        setIsModalOpen(false);
        setNewPwd("")
    };

    const deleteConfirm = async (_id) => {
        let tmp = fileList.filter(it => it._id !== _id)
        setFileList([...tmp])
        await deleteFile(_id)
    }

    const columns = [
        {
            title: 'FileName',
            dataIndex: 'fileName',
            key: 'myfilelist-fileName',
            width: "30%",
        },
        {
            title: '_id',
            dataIndex: '_id',
            key: 'myfilelist-_Id',
            width: "40%",
            render: (_id) => {
                return (
                    <div className="fileId" key={_id}>
                        <div className="fileId-text">
                            <span id="fileId_text">{_id}</span>
                        </div>
                        <div className="fileId-btn">
                            <Button
                                type="text"
                                onClick={async () => {
                                    // 创建text area
                                    const textArea = document.createElement('textarea')
                                    textArea.style.height = 0
                                    textArea.value = _id
                                    // 使text area不在viewport，同时设置不可见
                                    document.body.appendChild(textArea)
                                    textArea.focus()
                                    textArea.select()
                                    return new Promise((res, rej) => {
                                        // 执行复制命令并移除文本框
                                        document.execCommand('copy') ? res() : rej()
                                        textArea.remove()
                                    })

                                    // await navigator.clipboard.writeText(_id)
                                    // message.success('复制成功')
                                }}
                                className="copyBtn"
                                size="small"
                                icon={<svg t="1713863076050" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2006" width="16" height="16"><path d="M661.333333 234.666667A64 64 0 0 1 725.333333 298.666667v597.333333a64 64 0 0 1-64 64h-469.333333A64 64 0 0 1 128 896V298.666667a64 64 0 0 1 64-64z m-21.333333 85.333333H213.333333v554.666667h426.666667v-554.666667z m191.829333-256a64 64 0 0 1 63.744 57.856l0.256 6.144v575.701333a42.666667 42.666667 0 0 1-85.034666 4.992l-0.298667-4.992V149.333333H384a42.666667 42.666667 0 0 1-42.368-37.674666L341.333333 106.666667a42.666667 42.666667 0 0 1 37.674667-42.368L384 64h447.829333z" fill="#000000" p-id="2007"></path></svg>}
                            >
                                <span style={{ fontSize: "12px" }}>点击复制</span>
                            </Button>
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'FilePwd',
            dataIndex: 'pwd',
            key: 'myfilelist-pwd',
            render: (_, record) => {
                return (
                    <div className="password" key={record._id}>
                        <div className="password_span">
                            <span>{record.pwd}</span>
                        </div>
                        <div className="password_btn">
                            <Button type="primary" onClick={() => showChangePwdModal(record._id, record.pwd)}>修改密码</Button>
                            <Popconfirm
                                title="Delete File"
                                description="你确定要删除该文件?"
                                onConfirm={() => deleteConfirm(record._id)}
                                okText="确认删除"
                                cancelText="取消"
                            >
                                <Button type="primary" danger style={{ marginLeft: "20px" }}>删除文件</Button>
                            </Popconfirm>

                            <Modal title="修改密码" open={isModalOpen} onOk={() => handleChangePwdOk()} onCancel={handleChangePwdCancel}>
                                <Input placeholder="输入新的密码" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                            </Modal>
                        </div>
                    </div>
                )
            }
        }
    ];

    useEffect(() => {
        async function fetchData() {
            const resp = await getAllUserFiles(userInfo._id, {
                status: 1
            })
            if (resp.code == 0) {
                setFileList(resp.data)
            }
        }
        fetchData()
    }, [])

    return (
        <>
            <div>
                <h1>我的文件</h1>
                <div>
                    <Table columns={columns} dataSource={fileList} />
                </div>
            </div>
        </>

    )
}

export default MyFileList