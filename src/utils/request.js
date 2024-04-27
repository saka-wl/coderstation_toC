
import axios from "../api/request"

/**
 * 获取文件的后缀名
 * @param {string} filename 文件完整名称
 */
function extname(filename) {
    const i = filename.lastIndexOf('.');
    if (i < 0) {
        return '';
    }
    return filename.substr(i);
}

/**
 * 获取还需要上传的分片
 * 可能返回的状态：
 * 1. 文件已上传完成，返回url地址
 * 2. 文件上传了一部分，返回还需要上传的分片MD5数组
 * 3. 文件完全未上传，返回还需要上传的分片MD5数组
 * @param {*} name 
 * @param {*} fileId 
 * @param {*} chunks 
 * @returns 
 */
export async function getHandshake(name, fileId, chunks) {
    // 获取文件拓展名
    const fileExtName = extname(name);

    return await axios({
        url: "/api/uploadfile/handshake",
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        data: {
            fileId,
            name,
            ext: fileExtName,
            chunkIds: chunks.map(it => it.hash)
        }
    })
}

/**
 * 添加新的文件，但文件在数据库中的状态为0（未上传完成）
 * @param {*} fileName 
 * @param {*} fileId 
 * @param {*} userId 
 * @param {*} secret 
 * @returns 
 */
export async function addNewFileInfo(fileName, fileId, userId, secret, filePosition) {
    return await axios({
        url: "/api/uploadfile/addNewFileInfo",
        method: "POST",
        data: {
            fileName, fileId, userId, secret, filePosition
        }
    })
}

/**
 * 获取用户的所有文件 
 * @param {*} userId 
 * @returns 
 */
export async function getAllUserFiles(userId, condition) {
    return await axios({
        url: "/api/uploadfile/getAllUserFiles",
        method: "POST",
        data: {
            userId,
            condition
        }
    })
}

export async function getFilePositionUrl(fileId, pwd) {
    return await axios({
        url: "/api/uploadfile/getFilePositionUrl",
        method: "POST",
        data: {
            fileId, pwd
        }
    })
}

export async function changeFileInfo(_id, fileInfo) {
    return await axios({
        url: "/api/uploadfile/changeFileInfo",
        method: "POST",
        data: {
            _id, fileInfo
        }
    })
}

export async function deleteFile(_id) {
    return await axios({
        url: "/api/uploadfile/deleteFile",
        method: "POST",
        data: {
            _id
        }
    })
}

export async function checkFile(fileId, fileName) {
    return await axios({
        url: "/api/uploadfile/checkFile",
        method: "POST",
        data: {
            fileId,
            ext: fileName.substr(fileName.lastIndexOf('.'), fileName.length)
        }
    })
}

export async function normalUpload(formData) {
    return await axios({
        url: "/api/uploadfile/normalUpload",
        method: "POST",
        data: formData
    })
}

export async function uploadFile(formData) {
    return await axios({
        url: "/api/uploadfile",
        method: "POST",
        data: formData
    })
}

export async function getVideoStream(url, start, end) {
    return await axios({
        method: "GET",
        url,
        headers: {
            Range: `bytes=${start}-${end}`,
        },
        responseType: 'arraybuffer'
    })
}

export async function forgetFile(_id, fileName, fileId) {
    let ext = extname(fileName)
    return await axios({
        url: "/api/uploadfile/forgetFile",
        method: "POST",
        data: {
            _id, fileId, ext
        }
    })
}