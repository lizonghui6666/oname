import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Header from '@/components/layout/header'
import Slider from '@/components/slider'
import sliderList from '@/config/slider'
import '@/assets/css/layout.scss'

class LayoutComponent extends Component {

  render () {
    let { background, height } = this.props
    let pathname = this.props.location.pathname
    let sliderArr = null;
    for (let i = 0; i < sliderList.length; i++) {
      for (let j = 0; j < sliderList[i].children.length; j++) {
        if (sliderList[i].children[j].path === pathname) {
          sliderArr = sliderList[i]
        }
      }
    }
    return (
      <div className='layout_container'>
        <Header background={background} height={height} />
        <main className='layout_main'>
          <Slider dataSlider={sliderArr} />
          <div className='layout_content'>
            {this.props.children}
          </div>
        </main>
      </div>
    )
  }
}

export default withRouter(LayoutComponent)
