import { setToken } from '../utils/authc';
import React, { Component } from 'react';
import { Form, Input, Button , Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import style from './login.css';
import http from '../utils/axios';


class Login extends Component {
  onFinish = values => {
    http.post('/user/login', values).then(
      res => {
        if (res.data.code === 0) {
          setToken(values.number);
          message.success('登录成功');
          this.props.history.push('/admin')
        } else {
          message.error(res.data.msg);
        }
      }
    ).catch(err => { console.log(err); message.error('未知错误'); })
  };

  render() {
    return (
      <Card title="管理后台登录" className={style.form}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name="number"
            rules={[{ required: true, message: '请输入学号!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} type='number' placeholder="学号" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
        </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default Login;