import React, { Component } from 'react'
import '@/assets/css/admin.scss'
export default class AdminContainerPage extends Component {
  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
