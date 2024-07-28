import { Button, Input, Progress, message } from "antd"
import "../css/FileSearch.css"
import { handlePlayVideoStreams, urlRegFn } from "../utils/help"
import { useRef, useState } from "react"
import { getFileUrl } from "../utils/request"
import axios from "axios"
import { URL } from "../utils/constant"

function FileSearch() {

    const [fileId, setFileId] = useState("")
    const [isShowVideo, setIsShowVideo] = useState(false)
    const [secret, setSecret] = useState("")
    const [downloadUrl, setDownloadUrl] = useState("")
    const [progress, setProgress] = useState(0)
    const [imgsUrl, setImgsUrl] = useState([])

    const videoRef = useRef(null)

    const handleClickSearch = async () => {
        let fileInfo = (await getFileUrl(fileId, secret)).data
        let imageUrls = null
        try {
            imageUrls = JSON.parse(fileInfo.imageUrls)
        }catch(err) {}
        
        if(typeof imageUrls === 'object' && imageUrls instanceof Array && imageUrls !== null) {
            setImgsUrl(imageUrls.map(it => URL + '/images/' + it + '.png'))
        }

        if (fileInfo === null) {
            message.warning("请输入正确文件id和密码")
            return
        }
        let url = fileInfo.url
        let size = fileInfo.size

        // let indexPoint = url.lastIndexOf(".")
        if (!urlRegFn(url)) {
            message.warning("请输入正确文件id和密码")
            return
        }
        // console.log(url)
        let extName = url.substr(url.lastIndexOf(".") + 1, url.length)
        setDownloadUrl(url)

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


    // 处理文件下载事件
    function handleFileDownload() {
        if (!urlRegFn(downloadUrl)) {
            message.warning("下载网址错误！")
            return
        }
        axios.get(downloadUrl, {
            responseType: 'blob',
            onDownloadProgress: progressEvent => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                setProgress(progress);
            }
        })
            .then(response => {
                // 获取文件名字 + 后缀名
                const fileName = downloadUrl.substr(downloadUrl.lastIndexOf('/') + 1, downloadUrl.length)
                // 创建一个临时的URL对象用于下载
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error('文件下载失败:', error);
            });
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
                        <>
                            <h1>文件下载</h1>
                            <Button onClick={handleFileDownload}>下载文件</Button>
                            <Progress percent={progress} />
                        </>
                    ) : null
                }

                <h1>文件预览</h1>


                <div style={{ display: 'flex' }}>
                    <div className='box_video' style={{
                        opacity: isShowVideo ? 1 : 0,
                        height: isShowVideo ? '' : '0px'
                    }}>
                        <h3>视频预览</h3>
                        <div className='box_video' style={{
                            opacity: isShowVideo ? 1 : 0
                        }}>
                            <video ref={videoRef} height={1} controls preload="auto">
                            </video>
                        </div>
                    </div>
                    <div className='pic-container' style={{ height: isShowVideo ? '' : '0px' }}>
                        {
                            imgsUrl.map((it, index) => {
                                return (
                                    <div className='inside-item'>
                                        <img
                                            key={it}
                                            src={it}
                                            // onClick={() => {
                                            //     videoRef.current.currentTime = 1 + index * picFrameDuration
                                            // }}
                                        ></img>
                                        {/* <p>时间：{1 + index * picFrameDuration}秒</p> */}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>



            </div>
        </>
    )
}

export default FileSearch