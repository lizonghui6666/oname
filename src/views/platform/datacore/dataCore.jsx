import React, { Component } from 'react';
import '@/assets/css/dataCore.scss'
import { DatePicker, Select, Input, Table, Divider, Tag } from 'antd';
import { dataCore } from '@/config/select'

const { RangePicker } = DatePicker
const { Option } = Select
const { Search } = Input;
class DataCorePage extends Component {

  handleRangePicker = (datas, dataString) => {
    console.log(datas, dataString)
  }

  handleSelectChange = (value) => {
    console.log(value)
  }

  handleSearchChange = (search) => {
    console.log(search.target.value)
  }

  render () {
    const columns = [
      {
        title: '保全号',
        dataIndex: 'bqCode',
        key: 'bqCode',
        render: text => <a>{text}</a>,
      },
      {
        title: '存证类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '文件名称',
        key: 'fileName',
        dataIndex: 'fileName',
        render: fileName => (
          <span>
            {
              fileName.length > 16 ? fileName.slice(0, 8) + "..." + fileName.slice(fileName.length - 9, fileName.length) : fileName
            }
          </span>
        ),
      },
      {
        title: '文件大小',
        key: 'fileSize',
        dataIndex: 'fileSize',
        render: (text, record) => (
          <span>
            <a>Invite {record.name}</a>
            <Divider type="vertical" />
            <a>Delete</a>
          </span>
        ),
      },
      {
        title: '存证时间',
        key: 'time',
        dataIndex: 'time',
        render: (text, record) => (
          <span>
            <a>Invite {record.name}</a>
            <Divider type="vertical" />
            <a>Delete</a>
          </span>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a>查看证书</a>
          </span>
        ),
      },
    ];

    const data = [
      {
        key: '1',
        type: 'John Brown',
        time: 32,
        fileName: 'NewYo',
        fileSize: ['nice', 'developer'],
      }
    ];


    return (
      <div className='data_core_page'>
        <div className='data_title'>
          <h3>存证确权</h3>
          <p>（当前存证剩余容量<span>4.5</span>G，剩余次数<span>500</span>次）</p>
        </div>
        {
          // <div className='data_pore'>
          //   <RangePicker size='default' onChange={this.handleRangePicker} style={{ marginRight: '10px' }} />
          //   <Select defaultValue="" style={{ width: 140 }} onChange={this.handleSelectChange}>
          //     {
          //       dataCore.length && dataCore.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
          //     }
          //   </Select>
          //   <Search className='data_search' placeholder="输入保全号或文件名查询" onBlur={this.handleSearchChange} onSearch={this.handleSearchChange} enterButton />
          // </div>
        }
        <div className='data_table'>
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    )
  }
}


export default DataCorePage
