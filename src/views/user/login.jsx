import React, { Component } from 'react'
import { Row, Col, Button, Form, Input } from 'antd'
import { userLogin } from '@/api/user/userLogin'
import { dataFormData } from '@/utils/formData';

import '@/assets/css/login.scss'


class LoginPage extends Component {
  state = {
    phone: '',
    pwd: '',
    pwdType: 'password',
    codeShow: false,
  }

  handleCode = () => {
    this.setState({
      codeShow: !this.state.codeShow
    }, () => {
      if (this.state.codeShow) {
        this.setState({
          pwdType: 'text'
        })
      } else {
        this.setState({
          pwdType: 'password'
        })
      }
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.pwd = btoa(values.pwd)
        values = dataFormData(values)
        userLogin(values).then(res => {
          if (res.statusCode === "000000") {
            let data = res.data;
            console.log(data);
            window.location.href = '/platform'
            localStorage.setItem('Authorization', data.token);
            localStorage.setItem('username', data.realName);
          }
        })
      }
    });
  };

  render () {
    let { codeShow, pwdType } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login'>
        <div className='header_login'>
          <a href="https://baoquan.com" className='header_logo'> </a>
          <span className='header_icon'>·</span>
          <span className='header_title'>开放平台</span>
        </div>
        <div className='login_content'>
          <Row>
            <Col span={12}>
              <h4>开放平台</h4>
              <p className='p'>接入保全网开放平台，让你的系统支持快速存证确权、证据固定，保护你的数据权益。</p>
              <p className='p'>请确保注册保全网并进行企业实名认证后，再登录开放平台。<a href='https://www.baoquan.com/sign-up/personal?lang=zh'>立即注册</a></p>
            </Col>
            <Col span={12}>
              <div className='login_form'>
                <h1>登录</h1>
                <Form onSubmit={this.handleSubmit}>
                  <section>
                    <div className='row-input input_component'>
                      <Form.Item>
                        {getFieldDecorator('phone', {
                          rules: [
                            {
                              required: true,
                              message: '请输入正确手机号',
                            },
                            {
                              len: 11,
                              message: '请输入11位长度手机号'
                            }
                          ],
                        })(<Input type='text' name='phone' />)}
                      </Form.Item>
                    </div>
                    <span className='name'>请输入手机号</span>
                  </section>
                  <section>
                    <div className='verify'>
                      <span className='name'>请输入密码</span>
                      <div className='code' onClick={this.handleCode}>
                        <i className={codeShow ? 'iconfont font-yanjing-zhengyan' : 'iconfont font-yanjingbi'}></i>
                      </div>
                    </div>
                    <div className='row-input input_component'>
                      <Form.Item>
                        {getFieldDecorator('pwd', {
                          rules: [
                            {
                              required: true,
                              message: '请输入正确密码',
                            }, {
                              min: 6,
                              max: 18,
                              message: '请输入6到18位密码'
                            }
                          ],
                        })(<Input type={pwdType} name='pwd' />)}
                      </Form.Item>
                    </div>
                  </section>

                  {
                    // <div className='verification'>
                    //   <span>验证码登录</span>
                    // </div>
                  }
                  <Button type='primary' htmlType="submit" >登录</Button>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </div>

    )
  }
}

export default Form.create({ name: 'dynamic_rule' })(LoginPage);
