import { cutFile, getMD5 } from "./upload";
import { checkFile, getVideoStream, normalUpload, uploadFile, getHandshake, addNewFileInfo } from "./request";


const STATUS = {
    /**
     * 普通方式上传
     */
    NORMAL_UPLOAD: "NORMAL_UPLOAD",
    /**
     * 未分片状态，初始状态
     */
    NOT_SLICE: "NOT_SLICE",
    /**
     * 分片中状态
     */
    LOADING_SLICE: "LOADING_SLICE",
    /**
     * 完成分片状态
     */
    FINISHED_SLICE: "FINISHED_SLICE",
    /**
     * 文件上传中状态
     */
    LOADING_UPLOAD: "LOADING_UPLOAD",
    /**
     * 手动停止上传状态
     */
    STOP_UPLOAD: "STOP_UPLOAD",
    /**
     * 完成上传状态
     */
    HAS_FINISHED_UPLOAD: "HAS_FINISHED_UPLOAD"
}

/**
 * 文件分片的结果，普通分片为file内容
 */
let chunks;
/**
 * 文件的id，类型为MD5，用于在后端确认文件
 */
let fileId;
/**
 * 还需要的文件分片MD5数组
 */
let needs;
/**
 * 文件名字
 */
let fileName;
/**
 * 上传的状态
 */
let status = STATUS.NOT_SLICE

/**
 * 初始化
 * @param {Function} setProcess 
 */
const init = (setProcess) => {
    chunks = null;
    fileId = null;
    needs = null;
    fileName = null;
    status = STATUS.NOT_SLICE
    setProcess(0)
}

/**
 * 点击Input组件确认文件之后，将数据分片然后上传给服务器端确认文件下载状态
 * 文件下载状态：
 * 1. 文件完全未下载
 * 2. 文件下载了一部分
 * 3. 文件下载完成
 * @param {*} e 
 * @param {*} setProcess 
 * @returns 
 */
export async function handleInputChange(e, setProcess, setIsShowVideo, videoRef, messageFn) {
    init(setProcess)
    // 小于100mb就不进行文件分片，直接上传(NORMAL_UPLOAD)即可
    if (!e.target.files[0]) return;
    if (e.target.files[0].size < 100 * 1024 * 1024) {
        status = STATUS.NORMAL_UPLOAD
        fileId = (await getMD5(e.target.files[0])).hash;
        fileName = e.target.files[0].name
        chunks = e.target.files[0]
        const resp = await checkFile(fileId, fileName)
        if (!resp.data) {
            messageFn('success', '文件较小，点send直接上传！')
        } else {
            messageFn('success', '该资源已经上传完成！')
            handlePlayVideoStream(resp.data, e.target.files[0].size, videoRef, setIsShowVideo, messageFn)
        }
        return
    }

    if (!(status === STATUS.NOT_SLICE || status === STATUS.STOP_UPLOAD)) return;
    status = STATUS.LOADING_SLICE
    messageFn('success', '文件较大，分片上传！')
    fileName = e.target.files[0].name
    chunks = await cutFile(e.target.files[0]);
    fileId = (await getMD5(e.target.files[0])).hash;
    const res = await getHandshake(fileName, fileId, chunks)

    if (!res.data) {
        messageFn('warning', res.message)
        init(setProcess)
    } else if (typeof res.data === 'string') {
        messageFn('success', '该资源已经上传完成！')
        status = STATUS.HAS_FINISHED_UPLOAD
        handlePlayVideoStream(res.data, res.size, videoRef, setIsShowVideo, messageFn)
        init(setProcess)
    } else if (typeof res.data === 'object' && res.data.length > 0) {
        messageFn('success', '分片成功！')
        needs = res.data
        status = STATUS.FINISHED_SLICE
        setProcess(100 * (chunks.length - needs.length) / chunks.length)
    }
}

/**
 * 递归上传文件分片
 * @param {*} setProcess 
 * @returns 
 */
export async function handleSendClick(setProcess, setIsShowVideo, videoRef, userId, secret, messageFn) {
    if (status === STATUS.NORMAL_UPLOAD) {
        const formData = new FormData()
        formData.append("file", chunks)
        formData.append("fileId", fileId)
        formData.append("fileName", fileName)
        formData.append("userId", userId)
        formData.append("secret", secret)
        formData.append("ext", fileName.substr(fileName.lastIndexOf('.'), fileName.length))
        const resp = await normalUpload(formData)
        let timer = setInterval(() => {
            setProcess((process) => {
                if (process <= 80) {
                    return process + 10
                } else {
                    return process + 1 / process
                }
            })
        }, 600)
        status = STATUS.HAS_FINISHED_UPLOAD
        if (resp.code === 0) {
            messageFn('success', '上传完成')
            clearInterval(timer)
            setProcess(100)
            handlePlayVideoStream(resp.data, chunks.size, videoRef, setIsShowVideo, messageFn)
        }
        return
    }

    if (status === STATUS.HAS_FINISHED_UPLOAD) {
        const resp = await getHandshake(fileName, fileId, chunks)
        // 这里不需要异步等待，因为只是确认文件上传完成，只需要修改数据库状态
        // resp.data 为物理地址
        const resp2 = await addNewFileInfo(fileName, fileId, userId, secret, resp.data)
        if (resp2.code === 0) {
            messageFn('success', '上传完成')
        } else {
            messageFn('warning', resp2.msg)
        }
        init(setProcess)
        return
    }
    if (!(status === STATUS.FINISHED_SLICE || status === STATUS.LOADING_UPLOAD)) return;
    status = STATUS.LOADING_UPLOAD

    // 上传文件处理
    const formData = new FormData();
    formData.append("file", chunks.find(it => it.hash === needs[0]).content)
    formData.append("chunkId", needs[0])
    formData.append("fileId", fileId)
    const resp = await uploadFile(formData)
    if (resp.data === null) {
        messageFn('warning', '上传失败,请重试！')
        init(setProcess)
        return
    }
    needs = resp.data
    if (needs.length === 0) {
        setProcess(100)
        const resp = await getHandshake(fileName, fileId, chunks)
        // 这里不需要异步等待，因为只是确认文件上传完成，只需要修改数据库状态
        // resp.data 为物理地址
        await addNewFileInfo(fileName, fileId, userId, secret, resp.data)

        init(setProcess)
        messageFn('success', '上传完成')

        handlePlayVideoStream(resp.data, resp.size, videoRef, setIsShowVideo, messageFn)
        return
    }
    setProcess(process => process + 100 / chunks.length)
    handleSendClick(setProcess, setIsShowVideo, videoRef, userId, secret, messageFn)
}

/**
 * 文件暂停下载
 * @param {*} setBtnStatus 
 */
export async function handleStopClick(setBtnStatus) {
    if (status === STATUS.NORMAL_UPLOAD) return;
    if (status === STATUS.LOADING_UPLOAD) {
        setBtnStatus("continue")
        status = STATUS.STOP_UPLOAD
    } else if (status === STATUS.STOP_UPLOAD) {
        setBtnStatus("stop")
        status = STATUS.LOADING_UPLOAD
    }
}

/**
 * 使用视频流的方式播放上传的视频
 * @param {*} url 上传视频路径
 * @param {*} totalSize 上传视频大小
 * @param {*} videoRef dom控件
 */
function handlePlayVideoStream(url, totalSize, videoRef, setIsShowVideo, messageFn) {

    let extName = url.substr(url.lastIndexOf('.') + 1, url.length)
    if (extName !== 'mp4') {
        return
    }
    if (typeof setIsShowVideo !== 'function') {
        messageFn('warning', '该类型不支持预览')
        return
    }
    // 边看边缓存的最大缓存大小，如果超过这个大小就采用普通的形式播放视频
    if (totalSize >= 167000000) {
        setIsShowVideo(true)
        videoRef.src = url
        videoRef.height = 500
        return
    }
    setIsShowVideo(true)
    const chunkSize = 1000000
    const numChunks = Math.ceil(totalSize / chunkSize)
    let index = 0

    // 'video/mp4; codecs="avc1.64001F, mp4a.40.2"'
    // 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
    var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'

    videoRef.height = 500

    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        // 流式播放
        var mediaSource = new MediaSource()
        videoRef.src = URL.createObjectURL(mediaSource)
        mediaSource.addEventListener('sourceopen', sourceOpen)
    } else {
        console.error('Unsupported MIME type or codec: ', mimeCodec)
    }

    let flag = true

    function sourceOpen(e) {
        var mediaSource = e.target
        var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
        /**
         * 递归请求播放数据，Rangle请求头，请求视频数据片段
         */
        const send = async () => {
            if (index >= numChunks) {
                sourceBuffer.addEventListener('updateend', async function (_) {
                    mediaSource.endOfStream()
                })
            } else {
                const start = index * chunkSize
                const end = Math.min(start + chunkSize - 1, totalSize - 1)
                // console.log(start, end)
                const respBlob = await getVideoStream(url, start, end)
                index++
                sourceBuffer.appendBuffer(respBlob)
                // ！！！这里为何有延迟？上一次appendBuffer还未完成就执行下一个appendBuffer就会报错！！！-_-
                await delay(50)
                send()
                flag && videoRef.play()
                flag = false
            }
        }
        send()
    }
}

export const handlePlayVideoStreams = handlePlayVideoStream

function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}