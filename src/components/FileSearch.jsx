import { Button, Input, message } from "antd"
import "../css/FileSearch.css"
import { handlePlayVideoStreams } from "../utils/help"
import { useRef, useState } from "react"
import { getFilePositionUrl } from "../utils/request"

function FileSearch() {

    const [fileId, setFileId] = useState("")
    const [isShowVideo, setIsShowVideo] = useState(false)
    const [secret, setSecret] = useState("")
    const [downloadUrl, setDownloadUrl] = useState("")

    // const [messageApi, contextHolder] = message.useMessage();

    const videoRef = useRef(null)

    const handleClickSearch = async () => {
        let fileInfo = (await getFilePositionUrl(fileId, secret)).data

        if (fileInfo === null) {
            message.warning("请输入正确文件id和密码")
            return
        }
        let url = fileInfo.filePosition
        let size = fileInfo.size

        let indexPoint = url.lastIndexOf(".")
        if (indexPoint === -1) {
            message.warning("请输入正确文件id和密码")
            return
        }
        // console.log(url)
        setDownloadUrl(url)
        let extName = url.substr(indexPoint + 1, url.length)
        if (extName !== 'mp4') {
            message.warning("该类型不支持预览")
            return
        }

        handlePlayVideoStreams(url, size, videoRef.current, setIsShowVideo,
            (type = "warning", msg) => {
                if (type === 'warning') {
                    message.warning(msg)
                } else {
                    message.success(msg)
                }
            }
        )
    }

    return (
        <>
            <div>
                <h1>文件搜索</h1>
                <Input placeholder="输入文件分享id" style={{ marginTop: "30px" }} value={fileId} onChange={(e) => setFileId(e.target.value)} />
                <Input placeholder="输入文件分享密码" style={{ marginTop: "30px", marginBottom: "30px" }} value={secret} onChange={(e) => setSecret(e.target.value)} />
                <Button type="primary" onClick={() => handleClickSearch()}>搜索</Button>
                {
                    downloadUrl !== "" ? (
                        <a href={"thunder://" + downloadUrl}>迅雷下载</a>
                    ) : null
                }
                <h1>文件预览</h1>
                <div className='box_video' style={{
                    opacity: isShowVideo ? 1 : 0
                }}>
                    <video ref={videoRef} controls preload="auto">
                    </video>
                </div>
            </div>
        </>
    )
}

export default FileSearch