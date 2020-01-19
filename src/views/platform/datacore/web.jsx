import React, { Component } from 'react';
import '@/assets/css/dataCore.scss'
import { DatePicker, Select, Input, Table, Divider, Tag, Pagination } from 'antd';
import { webSelect } from '@/config/select'
import { NavLink } from 'react-router-dom'
import { webAttestations } from '@/api/datacore'
import { webDataFilter } from '@/utils/filter'

const { RangePicker } = DatePicker
const { Option } = Select
const { Search } = Input;
export default class WebPage extends Component {

  state = {
    pageNum: 1,
    pageSize: 10,
    total: 1,
    tableData: []
  }

  /**
   * 时间筛选
   */
  handleRangePicker = (datas, dataString) => {
    console.log(datas, dataString)
  }

  /**
   * 筛选 select
   */
  handleSelectChange = (value) => {
    console.log(value)
  }
  /**
   * 搜索
   */
  handleSearchChange = (search) => {
    console.log(search.target.value)
  }
  /**
   * 初始化数据
   */
  componentDidMount () {
    this.request();
  }

  handlePageNum = (pageNum) => {
    this.setState({
      pageNum
    })
    this.request();
  }

  request = () => {
    let { pageNum, pageSize } = this.state;
    webAttestations({ pageNum, pageSize }).then(res => {
      if (res.statusCode === '000000') {
        this.setState({
          total: res.data.total,
          tableData: webDataFilter(res.data.list)
        })
      }
    })
  }

  render () {
    let { tableData, pageNum, total } = this.state;
    const columns = [
      {
        title: '保全号',
        dataIndex: 'attestationId',
        key: 'attestationId',
        render: text => <span>{text}</span>,
      },
      {
        title: '取证链接',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: '取证状态',
        key: 'tStatus',
        dataIndex: 'tStatus',
        render: text => <span>{text}</span>,
      },
      {
        title: '存证时间',
        key: 'createAt',
        dataIndex: 'createAt',
        render: text => <span>{text}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            {
              //<NavLink to="/platform" style={{ marginRight: '4px' }}>预览图片</NavLink>
            }
            <NavLink to={`/attestations/${record.attestationId}`}>查看证书</NavLink>
          </span>
        ),
      },
    ];


    return (
      <div className='data_core_page'>
        <div className='data_title'>
          <h3>网页取证</h3>
          <p>（当前取证剩余次数<span>4.5</span>次）</p>
        </div>
        {
          //   <div className='data_pore'>
          //   <RangePicker size='default' onChange={this.handleRangePicker} style={{ marginRight: '10px' }} />
          //   <Select defaultValue="" style={{ width: 140 }} onChange={this.handleSelectChange}>
          //     {
          //       webSelect.length && webSelect.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
          //     }
          //   </Select>
          //   <Search className='data_search' placeholder="输入保全号或链接查询" onBlur={this.handleSearchChange} onSearch={this.handleSearchChange} enterButton />
          // </div>
        }
        <div className='data_table'>
          <Table rowKey={record => record.id} pagination={false} columns={columns} dataSource={tableData} />
          <div className='data_pagination'>
            <Pagination defaultCurrent={pageNum} onChange={this.handlePageNum} total={total} showTotal={() => `${total}页`} />
          </div>
        </div>
      </div>
    )
  }
}