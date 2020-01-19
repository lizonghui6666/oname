import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'antd';

const headerList = [{
  title: '数据中心',
  path: '/platform/data'
}, {
  title: '管理中心',
  path: '/platform/admin'
}]


export default class HeaderComponent extends Component {
  render () {
    let { background, height } = this.props;
    let userName = localStorage.getItem('username')
    return (
      <div className='layout_header' style={{ background: background, height: height }} >
        <div className='header_home'>
          <span className='home_icon'>·</span>
          <span className='home_title'>开放平台</span>
          <nav>
            {
              headerList.length && headerList.map((item, index) => <NavLink key={index} to={item.path}>{item.title}</NavLink>)
            }
          </nav>
          <div className='home_info'>
            <div className='user_icon'>
              <Icon type="user" />
            </div>
            <span className='user_info'>
              {userName}
            </span>
          </div>
        </div>
      </div>
    )
  }
}
