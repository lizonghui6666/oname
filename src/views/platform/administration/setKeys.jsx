import React, { Component } from 'react'
import { Input, Button } from 'antd';
const { TextArea } = Input
class AdministrationPage extends Component {
  state = {
    rsaValue: ''
  }
  onChange = (e) => {
    this.setState({
      rsaValue: e.target.value
    })
  }
  render () {
    let { rsaValue } = this.state
    return (
      <div className='admin_container'>
        <div className='admin_title'>
          <h3>密钥管理</h3>
        </div>
        <div className='admin_keysBox'>
          <h4>请输入RSA公钥</h4>
          <TextArea
            value={rsaValue}
            onChange={this.onChange}
            placeholder=""
            autoSize={{ minRows: 10, maxRows: 20 }}
          />
          <div className='admin_btn'>
            <Button type='primary'>新建密钥</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default AdministrationPage
