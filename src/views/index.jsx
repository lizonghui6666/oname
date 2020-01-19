import React, { Component } from 'react'
import Layout from '@/components/layout'
class homePage extends Component {
  render () {
    return (
      <Layout background='rgb(17, 27, 52)' height="45px">
        {this.props.children}
      </Layout>
    )
  }
}

export default homePage
