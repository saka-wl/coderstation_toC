import { useRef, useState } from 'react';
import '../css/FileUpLoad.css';
import { handleInputChange, handleSendClick, handleStopClick } from '../utils/help';
import { Button, Checkbox, Input, Progress, message } from 'antd';
import { useSelector } from 'react-redux';

function FileUpLoad() {
  const [process, setProcess] = useState(0)
  const [btnStatus, setBtnStatus] = useState("stop")
  const [secret, setSecret] = useState("")
  const [isShowVideo, setIsShowVideo] = useState(false)
  const [picFrameDuration, setPicFrameDuration] = useState()
  const [imgsUrl, setImgsUrl] = useState([])
  const [isUploadPicPreview, setIsUploadPicPreview] = useState(false)

  const videoRef = useRef(null)
  const previewImgsUrl = useRef(null)

  const { userInfo } = useSelector(state => state.user)

  return (
    <>
      {/* {contextHolder} */}
      <div className="box">
        <h1>文件上传（文件切片请在2天内上传完成，否则自动删除）</h1>
        <div className='box_file'>
          <div>
            <Input placeholder="输入视频类型文件的图片类型预览的间隔时间" style={{ width: '30%' }} value={picFrameDuration} onChange={(e) => setPicFrameDuration(e.target.value)} />
            <span style={{ fontSize: '13px', color: 'rgb(188, 188, 188)', marginLeft: '15px' }}>输入视频类型文件的图片类型预览的间隔时间，如果时间为0，默认不进行视频类型文件图片预览获取,单位为秒</span>
          </div>
          <input type='file' id='file'
            onChange={
              (e) => handleInputChange(e, setProcess, setIsShowVideo, videoRef.current,
                (type = "warning", msg) => {
                  if (type === 'warning') {
                    message.warning(msg)
                  } else {
                    message.success(msg)
                  }
                },
                picFrameDuration,
                setImgsUrl,
                previewImgsUrl
              )
            }
          ></input>
          <Input placeholder="输入文件分享密码" value={secret} onChange={(e) => setSecret(e.target.value)} />
        </div>
        <h1>预览</h1>
        <div style={{ display: 'flex' }}>
          <div className='box_video' style={{
            opacity: isShowVideo ? 1 : 0,
            height: isShowVideo ? '' : '0px'
          }}>
            <h3>视频预览</h3>
            <video ref={videoRef} controls preload="auto"></video>
          </div>
          <div className='pic-container' style={{ height: isShowVideo ? '' : '0px' }}>
            {
              imgsUrl.map((it, index) => {
                return (
                  <div className='inside-item'>
                    <img
                      key={it}
                      src={it}
                      onClick={() => {
                        videoRef.current.currentTime = 1 + index * picFrameDuration
                      }}
                    ></img>
                    <p>时间：{1 + index * picFrameDuration}秒</p>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className='box_btn'>
          <div style={{ marginTop: "30px" }}>
            <span>进度条：</span>
            <Progress percent={process} />
          </div>
          <div style={{ marginTop: "30px" }}>
            <span>是否上传图片预览：</span>
            <Checkbox
              disabled={!isShowVideo}
              value={isUploadPicPreview} 
              onClick={() => {
                setIsUploadPicPreview(!isUploadPicPreview)
              }} />
          </div>
          <div style={{ marginTop: "30px", marginBottom: '30px' }}>
            <Button type="primary"
              onClick={
                () => handleSendClick(
                  setProcess,
                  setIsShowVideo,
                  videoRef.current,
                  userInfo._id,
                  secret,
                  (type = "warning", msg) => {
                    if (type === 'warning') {
                      message.warning(msg)
                    } else {
                      message.success(msg)
                    }
                  },
                  previewImgsUrl,
                  isUploadPicPreview
                )
              }
            >
              send
            </Button>
            <Button onClick={() => handleStopClick(setBtnStatus)}>{btnStatus}</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FileUpLoad