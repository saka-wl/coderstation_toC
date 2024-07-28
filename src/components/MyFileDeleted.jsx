
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { changeFileInfo, forgetFile, getAllUserFiles } from "../utils/request"
import { Button, Popconfirm, Table, message } from "antd";

function MyFileDeleted() {

    const { userInfo } = useSelector(state => state.user)
    const [fileList, setFileList] = useState([])

    const handleRecordFile = async (_id) => {
        await changeFileInfo(_id, { status: 1 })
        message.success('恢复成功')
        let tmp = fileList.filter(it => it._id !== _id)
        setFileList([...tmp])
    }

    const forgetFileConfirm = (_id, fileName, fileId) => {
        forgetFile(_id, fileName, fileId)
        let tmp = fileList.filter(it => it._id !== _id)
        setFileList([...tmp])
    }

    const columns = [
        {
            title: 'FileName',
            dataIndex: 'fileName',
            key: 'myfiledelete-fileName',
            width: "40%"
        },
        {
            title: '_id',
            dataIndex: '_id',
            key: 'myfiledelete-fileId',
            width: "30%"
        },
        {
            title: 'FilePwd',
            dataIndex: 'pwd',
            key: 'myfiledelete-pwd',
            render: (_, record) => {
                return (
                    <div key={record._id}>
                        <Button type="primary" onClick={() => handleRecordFile(record._id)}>恢复文件</Button>
                        <Popconfirm
                                title="彻底遗忘该文件"
                                description="你确定要彻底遗忘这些文件吗?（这次不可撤回了）"
                                onConfirm={() => forgetFileConfirm(record._id, record.fileName, record.fileId)}
                                okText="确认遗忘"
                                cancelText="取消"
                            >
                                <Button type="primary" danger style={{ marginLeft: "20px" }}>彻底遗忘</Button>
                            </Popconfirm>
                    </div>
                )
            }
        }
    ];

    useEffect(() => {
        async function fetchData() {
            const resp = await getAllUserFiles(userInfo._id, {
                status: 0
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
                <h1>回收站</h1>
                <div>
                    <Table columns={columns} dataSource={fileList} />
                </div>
            </div>
        </>
    )
}

export default MyFileDeleted