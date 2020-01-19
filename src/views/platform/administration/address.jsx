import React, { Component } from 'react'

export default class AddressPage extends Component {
  render () {
    return (
      <div className='address_container'>
        <div className='admin_title'>
          <h3>地址管理</h3>
          <p>（最多保存5个地址）</p>
        </div>
        <div className='add_template' onClick={this.showModal}>
          <div>
            <span style={{ marginRight: '9px' }}>+</span>
            <span>新增地址</span>
          </div>
        </div>
        <div className=''></div>
      </div>
    )
  }
}
