import React, { Component } from 'react'
import '@/assets/css/dataCore.scss'
export default class DataContainerPage extends Component {
  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
