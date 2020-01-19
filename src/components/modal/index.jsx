import React, { Component } from 'react';
import { Modal } from 'antd';
import propTypes from 'prop-types';

class ModalComponent extends Component {

  static propTypes = {
    title: propTypes.string,
    visible: propTypes.bool.isRequired,
    footerFlag: propTypes.bool,
    width: propTypes.string || propTypes.number,
    handleCancel: propTypes.func
  }

  render () {
    let { title, visible, footerFlag, width, handleCancel, children } = this.props;
    return (
      <Modal
        title={title}
        okText="确定"
        cancelText="取消"
        visible={visible}
        onCancel={handleCancel}
        centered
        destroyOnClose={true}
        width={typeof width === 'number' ? width + "px" : width}
        footer={footerFlag}
      >
        {children}
      </Modal>
    )
  }
}

export default ModalComponent
