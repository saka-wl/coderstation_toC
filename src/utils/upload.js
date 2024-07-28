import { uploadPreviewPic } from "./request";
import sparkmd5 from "./sparkmd5";

/**
 * 每个分片的大小
 */
const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB
const THREAD_COUNT = 4;


/**
 * 创建文件分片数组
 * 单片文件类型：
 * {
 *    start: 开始下标（数据大小下标）
 *    end: 结束下标
 *    index: 第几段分片
 *    hash: 分片的MD5编码，唯一下标
 *    content: 文件分片的内容
 * }
 * @param {*} file 
 * @param {*} index 
 * @param {*} chunkSize 
 * @returns 
 */
export function createChunk(file, index, chunkSize) {
    return new Promise((resolve) => {
        const start = index * chunkSize;
        const end = start + chunkSize;
        // 使用sparkmd5的ArrayBuffer构造方法，读取二进制文件
        const spark = new sparkmd5.ArrayBuffer();
        const fileReader = new FileReader();
        /**
         * onload 该事件在读取操作完成时触发
         * @param {*} e 就是 -> file.slice(start, end)
         */
        fileReader.onload = (e) => {
            // 将该段分片转为MD5编码
            spark.append(e.target.result);
            resolve({
                start,
                end,
                index,
                hash: spark.end(),
                // 文件分片的内容
                content: new Blob([e.target.result])
            });
        };
        fileReader.readAsArrayBuffer(file.slice(start, end));
    });
}

/**
 * 获取总文件的MD5编码
 * @param {*} file 
 * @returns 
 */
export function getMD5(file) {
    return new Promise((resolve) => {
        const spark = new sparkmd5.ArrayBuffer();
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            spark.append(e.target.result);
            resolve({
                hash: spark.end()
            });
        };
        fileReader.readAsArrayBuffer(file);
    })
}

/**
 * 文件分片处理
 * @param {*} file 文件类型
 * @returns 
 */
export function cutFile(file) {
    return new Promise((resolve) => {
        const result = [];
        /**
         * 文件分片总数
         */
        const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
        /**
         * 每个线程需要处理的文件分片数量
         */
        const workerChunkCount = Math.ceil(chunkCount / THREAD_COUNT);
        let finishCount = 0;
        for (let i = 0; i < THREAD_COUNT; i++) {
            // 创建一个新的 Worker 线程
            const worker = new Worker(
                new URL(
                    './worker.js',
                    import.meta.url
                )
            );
            // 计算每个线程的开始索引和结束索引
            const startIndex = i * workerChunkCount;
            let endIndex = startIndex + workerChunkCount;
            if (endIndex > chunkCount) {
                endIndex = chunkCount;
            }
            /**
             * 开启线程，执行任务
             */
            worker.postMessage({
                file,
                CHUNK_SIZE,
                startIndex,
                endIndex,
            });
            /**
             * 接收线程的返回消息
             * @param {*} e worker.js中onmessage的返回内容
             */
            worker.onmessage = (e) => {
                for (let i = startIndex; i < endIndex; i++) {
                    result[i] = e.data[i - startIndex];
                }
                // 关闭线程
                worker.terminate();
                finishCount++;
                if (finishCount === THREAD_COUNT) {
                    resolve(result);
                }
            };
        }
    });
}

/**
 * 获取图片的md5
 */
export function getImgsMD5(imgsBlobArr) {
    return new Promise((resolve) => {
        let finishedIndex = 0
        let res = []
        const spark = new sparkmd5.ArrayBuffer();
        for (let i = 0; i < imgsBlobArr.length; i++) {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                spark.append(e.target.result);
                res[i] = spark.end()
                finishedIndex++
                if (finishedIndex === imgsBlobArr.length) {
                    resolve(res)
                }
            };
            fileReader.readAsArrayBuffer(imgsBlobArr[i]);
        }
    })
}

/**
 * 视频帧处理
 * @param {*} file 
 * @param {*} duration 
 * @returns 
 */
export function getVideoFrame(file, duration) {
    duration = ~~duration
    return new Promise((resolve, rej) => {
        if (typeof duration !== 'number') {
            resolve("输入的时间应是一个数字！")
            return
        };
        duration = Math.ceil(duration)
        if (duration < 1) {
            resolve("时间间隔太小啦！应该在2s以上！")
            return;
        }
        let task = (time = 1) => {
            return new Promise((r, j) => {
                if (!file) return null;
                vdo.currentTime = time
                vdo.oncanplay = () => {
                    const cvs = document.createElement('canvas')
                    cvs.width = vdo.videoWidth
                    cvs.height = vdo.videoHeight
                    const ctx = cvs.getContext('2d')
                    ctx.drawImage(vdo, 0, 0, cvs.width, cvs.height)
                    cvs.toBlob((blob) => {
                        const url = URL.createObjectURL(blob)
                        r({
                            url,
                            blob
                        })
                    })
                }
            })
        }
        let res = []
        const vdo = document.createElement('video')
        vdo.muted = true
        vdo.autoplay = true
        vdo.src = URL.createObjectURL(file)
        vdo.oncanplay = async () => {
            const vdoEndTime = Math.floor(vdo.duration)
            for (let time = 1, i = 0; time < vdoEndTime; time = time + duration, i++) {
                res[i] = await task(time, i)
            }
            const worker = new Worker(
                new URL(
                    './worker-img.js',
                    import.meta.url
                )
            );
            worker.postMessage(res.map(it => it.blob))
            worker.onmessage = (e) => {
                uploadPreviewPic(res.map((it, index) => ({ hash: e.data[index], blob: it.blob })))
                resolve(res.map((it, index) => ({ url: it.url, hash: e.data[index] })))
                worker.terminate();
            }

        }
    })
}

