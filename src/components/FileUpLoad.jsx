import { useRef, useState } from 'react';
import '../css/FileUpLoad.css';
import { handleInputChange, handleSendClick, handleStopClick } from '../utils/help';
import { Button, Input, Progress, message } from 'antd';
import { useSelector } from 'react-redux';

function FileUpLoad() {
  const [process, setProcess] = useState(0)
  const [btnStatus, setBtnStatus] = useState("stop")
  const [secret, setSecret] = useState("")
  const [isShowVideo, setIsShowVideo] = useState(false)

  const videoRef = useRef(null)

  const { userInfo } = useSelector(state => state.user)

  return (
    <>
      {/* {contextHolder} */}
      <div className="box">
        <h1>文件上传</h1>
        <div className='box_file'>
          <input type='file' id='file'
            onChange={
              (e) => handleInputChange(e, setProcess, setIsShowVideo, videoRef.current, (type = "warning", msg) => {
                if (type === 'warning') {
                  message.warning(msg)
                } else {
                  message.success(msg)
                }
              })
            }
          ></input>
          <Input placeholder="输入文件分享密码" value={secret} onChange={(e) => setSecret(e.target.value)} />
        </div>
        <div className='box_btn'>
          <div style={{ marginTop: "30px" }}>
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
                  }
                )
              }
            >
              send
            </Button>
            <Button onClick={() => handleStopClick(setBtnStatus)}>{btnStatus}</Button>
          </div>
          <div style={{ marginTop: "30px" }}>
            <span>进度条：</span>
            <Progress percent={process} />
          </div>
        </div>
        <h1>文件预览</h1>
        <div className='box_video' style={{
          opacity: isShowVideo ? 1 : 0
        }}>
          <video ref={videoRef} controls preload="auto">
          </video>
        </div>
      </div>
    </>
  );
}

export default FileUpLoad