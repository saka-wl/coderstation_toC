import React from 'react';
import { Button, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AddIssueBtn(props) {

  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const clickHandle = () => {
    if(user.isLogin) {
      navigate("/addIssue")
    }else {
      message.warning("请先登录")
    }
  }

  return (
    <div>
      <Button
        type='primary'
        size='large'
        style={{
          width: "100%",
          marginBottom: "30px"
        }}
        onClick={clickHandle}
      >
        我要发问
      </Button>
    </div>
  );
}

export default AddIssueBtn;