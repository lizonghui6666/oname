import React, { Component } from 'react'
import { Menu } from 'antd'
import { NavLink, withRouter } from 'react-router-dom'
const style = {
  width: '256px',
}
const defaultKeys = ['1']
class SliderComponent extends Component {
  render () {
    const { dataSlider } = this.props
    return (
      <div className='slider_wrapper' style={style}>
        {
          dataSlider && <div className='slider_box' >
            <Menu style={{ height: '100%' }}
              defaultSelectedKeys={defaultKeys}
              selectedKeys={this.props.location.pathname}
              mode='inline'
              theme='light'
            >
              <Menu.ItemGroup key="g1" title={dataSlider.title}>
                {
                  dataSlider.children.length && dataSlider.children.map((i, index) =>
                    <Menu.Item key={i.path} as={NavLink} to={i.path}>
                      <NavLink to={i.path} />
                      {i.title}
                    </Menu.Item>)
                }
              </Menu.ItemGroup>
            </Menu>
          </div>

        }
      </div>
    )
  }
}

export default withRouter(SliderComponent)
