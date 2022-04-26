import React, {Component, useContext} from "react";
import {Button, Col, Form, Input, notification, Row} from "antd";
import {connect, useDispatch} from 'react-redux';
import axiosClient from "../../api/axiosClient";
import LoginWelcomeBackIcon from "../../assets/images/login_welcome_back.jpg";
import LoginIcon from "../../assets/images/logo.png"
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import PropTypes from 'prop-types';
import {AppContext} from "../../contexts/AppContext";
import {setDataUser} from "../../redux/actions/auth";

const styles = {
  container: {
    // height: '100%'
  },
  left: {
    padding: 20,
    // height: '100%'
  },
  welcome: {
    // backgroundColor: 'red',
    color: 'rgb(33, 43, 54)',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
    borderRadius: 16,
    padding: 20,
    height: '100%',
    '& .logoIcon': {
      height: 64,
      width: 64,
    },
    '& .welcomeText': {
      fontWeight: '600',
      fontSize: '1.5rem',
      padding: "20px 0"
    },
    '& .loginWelcomeIcon': {
      width: 360,
      height: 360,
      maxWidth: '100%'
    }
  },
  right: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
    padding: 20,
    '& .loginText': {

    },
    '& .itemInput': {
      padding: '10px 0',
      width: 360
    },
    '& .btnLogin': {
      backgroundColor: 'rgb(0, 123, 85)',
      boxShadow: 'none',
      textTransform: 'initial',
      color: '#fff',
      width: '100%'
    }
  },
}
const Login = (props) => {
  const {classes} = props;
  // const {
  //   user,
  //   setUser
  // } = useContext(AppContext);
  const dispatch = useDispatch();
  const openNotificationWithIcon = (type, text) => {
    notification[type]({
      message: "Thông báo",
      description: text
    });
  }
  const  onFinish = (values) => {
    const formData = new FormData();
    formData.append('username', values.username)
    formData.append('password', values.password)
    axiosClient.post("api/v1/user/login", formData)
      .then(res => {
        console.log(res.data)
        if (res.status === 200 && res.data && res.data.data) {
          // setUser(res.data);
          dispatch(setDataUser(res.data))
          openNotificationWithIcon("success", "Đăng nhập thành công");
        } else {
          dispatch(setDataUser(null))
          openNotificationWithIcon("error", "Có lỗi xảy ra");
        }
      })
      .catch(err => {
        // setUser(null);
        dispatch(setDataUser(null))
        if (err.response && err.response.data && err.response.data.message) {
          openNotificationWithIcon("error", err.response.data.message);
        } else {
          openNotificationWithIcon("error", "Có lỗi xảy ra");
        }
      })
      .finally(res => {

      })
  }
  return (
    <Row className={classes.container}>
      <Col item xs={24} sm={12} md={12} lg={8} className={classes.left}>
        <div className={classes.welcome}>
          <img className="logoIcon" src={LoginIcon} alt=""/>
          <div className="welcomeText">
            Hi, Welcome Back
          </div>
          <img className="loginWelcomeIcon" src={LoginWelcomeBackIcon} alt=""/>
        </div>
      </Col>
      <Col item xs={24} sm={12} md={12} lg={16} className={classes.right}>
        <div className={classes.login}>
          <div className="loginText">
            Sign in to Minimal
          </div>
          <Form
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Xin hãy nhập tên tài khoản của bạn!',
                },
              ]}
              // initialValue={"dvcuong94@gmail.com"}
            >
              <Input placeholder="Địa chỉ email"/>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Xin hãy nhập mật khẩu!'
                }
              ]}
              // initialValue={"12345678"}
            >
              <Input.Password placeholder="Mật khẩu"/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  )
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles))(Login);
