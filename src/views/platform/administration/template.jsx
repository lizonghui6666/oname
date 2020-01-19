import React, { Component } from 'react';
import { Modal, Button, Icon, message, Input } from 'antd';
import { templateDefault, templateCreate, templateDelete, templateInfo, templateStatus, templatePutName } from '@/api/template'
import { dataFormData, timeFormat } from '@/utils/formData'
import { NavLink } from 'react-router-dom'
import { templateFilterInfo } from '@/utils/filter'
const ButtonGroup = Button.Group;
// const { confirm } = Modal;

function PutNameModal (props) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span style={{ width: "120px" }}>重置模板名称：</span>
        <div style={{ width: "200px" }}>
          <Input onChange={props.changeInput} type="text" />
        </div>
      </div>
      <div className='template_btnBox'>
        <Button type="primary" onClick={props.templatePutName}>确定</Button>
      </div>
    </div>
  )
}

function DeleteModal (props) {
  return (
    <div>
      <div>
        <p style={{ textAlign: "center" }}>是否删除：{props.templateName}模板？</p>
      </div>
      <div className='template_btnBox'>
        <Button type="primary" onClick={props.templateDelete}>确定</Button>
      </div>
    </div>
  )
}


export default class TemplatePage extends Component {

  state = {
    visible: false,
    showModal: false,
    templateId: '',
    templateInfoList: [],
    templateDefaultList: [],
    inputValue: '',
    title: '',
    templateName: ''
  };

  // 创建模板
  handleOk = e => {
    let { templateId } = this.state;
    this.setState({
      visible: false,
    });
    templateCreate(dataFormData({ templateId })).then(res => {
      if (res.statusCode === "000000") {
        this.props.history.push('/platform/admin/adminTemplate');
        message.success("新增模板" + res.errorMessage)
      }
    })
  };
  // 获取默认模板列表
  componentDidMount () {
    templateDefault().then(res => {
      if (res.statusCode === "000000") {
        this.setState({
          templateDefaultList: res.data
        })
      }
    })

    templateInfo(dataFormData({ pageNum: 1, pageSize: 10 })).then(res => {
      if (res.statusCode === '000000') {
        this.setState({
          templateInfoList: res.data.list
        })
      }
    })
  }
  // 添加模板
  addTemplate = (id) => {
    this.setState({
      templateId: id
    })
  }
  // 删除模板
  templateDelete = (templateId, templateName) => {
    this.setState({
      title: "删除模板",
      showModal: true,
      templateId,
      templateName
    })
  }
  // 修改删除模板
  templatePutName = () => {
    let { templateId, inputValue, title } = this.state;
    this.setState({
      showModal: false
    })
    if (title === '重命名') {
      // 重命名
      templatePutName(templateId, dataFormData({ name: inputValue })).then(res => {
        if (res.statusCode === "000000") {
          this.props.history.push('/platform/admin/adminTemplate');
          message.success("重命名" + res.errorMessage)
        }
      })
    } else {
      // 删除
      templateDelete(templateId).then(res => {
        if (res.statusCode === "000000") {
          this.props.history.push('/platform/admin/adminTemplate');
          message.success(res.errorMessage)
        }
      })
    }

  }
  // 提交模板 
  templateStatus = (templateId) => {
    templateStatus(templateId).then(res => {
      if (res.statusCode === "000000") {
        this.props.history.push('/platform/admin/adminTemplate');
        message.success("提交" + res.errorMessage)
      } else {
        message.info(res.errorMessage)
      }
    })
  }
  // 获取input 输入内容
  changeInput = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }


  render () {
    let { templateDefaultList, templateId, templateInfoList, title, templateName } = this.state;
    return (
      <div>
        <div className='admin_title'>
          <h3>模板管理</h3>
        </div>

        <div className='template_box'>
          <ButtonGroup style={{ width: "100%" }}>
            <div className='add_template item_template' onClick={() => this.setState({
              visible: true
            })}>
              <div>
                <span style={{ marginRight: '9px' }}>+</span>
                <span>新增模板</span>
              </div>
            </div>
            {
              templateInfoList.length ? templateInfoList.map(item =>
                <Button className="item_template" key={item.id}>
                  <div className="item_template_title">
                    <span>{templateFilterInfo(item.status)}</span>
                    <NavLink target="_blank" to={`/controlTemplate/${item.id}`}>查看</NavLink>
                  </div>
                  <div className='item_template_content'>
                    <p>模板ID：{item.id}</p>
                    <p>{item.name}</p>
                  </div>
                  <div>
                    {
                      item.status === 'APPROVED' || item.status === 'IN_REVIEW' ? <span>{timeFormat(item.createTime)}</span> :
                        <div>
                          {
                            item.status === 'OFFLINE'
                              ? <div>
                                <span onClick={() => this.templateDelete(item.id)}>删除</span>
                                <span onClick={() => this.templateStatus(item.id)}>提交</span>
                              </div> :
                              <div className="item_template_event">
                                <span onClick={() => this.templateDelete(item.id, item.name)}>删除</span>
                                <span onClick={() => this.templateStatus(item.id)}>提交</span>
                                <span onClick={() => this.setState({ templateId: item.id, title: '重命名', showModal: true })}>重命名</span>
                              </div>
                          }
                        </div>
                    }
                  </div>
                </Button>
              ) : " "
            }
          </ButtonGroup>
        </div>

        <Modal
          title={title}
          okText="确定"
          cancelText="取消"
          visible={this.state.showModal}
          width={500}
          onCancel={() => this.setState({
            showModal: false
          })}
          centered
          footer={null}
        >
          {title === "重命名" ? <PutNameModal changeInput={this.changeInput} templatePutName={this.templatePutName} /> : <DeleteModal templateName={templateName} templateDelete={this.templatePutName} />}
        </Modal>
        {
          //默认模板弹框 
        }
        <Modal
          title="选择模板"
          okText="确定"
          cancelText="取消"
          visible={this.state.visible}
          onCancel={() => this.setState({
            visible: false,
            templateId: ''
          })}
          centered
          width="820px"
          footer={null}
        >
          {
            // <div className='setKeys'>通过API接口调用模板前,请先设置密钥。<a href='www.baidu.com'>前往设置</a></div>
          }
          <div className='default_template_box'>
            {
              templateDefaultList.length ? templateDefaultList.map(item =>
                <div className='default_template' key={item.id} style={{ borderColor: item.id === templateId ? 'rgb(61, 129, 242)' : '' }} onClick={() => this.addTemplate(item.id)}>
                  <h4>{item.title}</h4>
                  <div className='template_icon'></div>
                  <p>{item.comment}</p>
                  {item.id === templateId ? <Icon type="check-circle" className='template_success' theme="twoTone" twoToneColor="#52c41a" /> : ""}
                </div>
              ) : " "
            }
          </div>
          <div className='template_btnBox'>
            <Button type="primary" onClick={this.handleOk}>确定</Button>
          </div>
        </Modal>
      </div >
    )
  }
}
