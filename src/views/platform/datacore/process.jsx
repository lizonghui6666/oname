import React, { Component } from 'react';
import '@/assets/css/dataCore.scss'
import { DatePicker, Select, Input, Table, Divider, Pagination } from 'antd';
import { proSelect } from '@/config/select'
import { NavLink } from 'react-router-dom'
import { processEvidences } from '@/api/datacore'
import { processDataFilter } from '@/utils/filter'
const { RangePicker } = DatePicker
const { Option } = Select
const { Search } = Input;
export default class ProcessPage extends Component {

  state = {
    pageNum: 1,
    pageSize: 10,
    tableData: [],
    total: 1,
  }

  // 时间筛选
  handleRangePicker = (datas, dataString) => {
    console.log(datas, dataString)
  }
  // 筛选条件
  handleSelectChange = (value) => {
    console.log(value)
  }
  // 搜索
  handleSearchChange = (search) => {
    console.log(search.target.value)
  }


  // 分页
  handleTable = (pageNum) => {
    console.log(pageNum)
    this.setState({
      pageNum
    }, () => this.request())
  }
  // 初始化数据
  componentDidMount () {
    this.request();
  }
  // 请求
  request = () => {
    let { pageNum, pageSize } = this.state;
    processEvidences({ pageNum, pageSize }).then(res => {
      if (res.statusCode === '000000') {
        this.setState({
          tableData: processDataFilter(res.data.list),
          total: res.data.total,
        })
      }
    })
  }

  render () {
    let { tableData, total, pageNum } = this.state;
    const columns = [
      {
        title: '保全号',
        dataIndex: 'attestationId',
        key: 'attestationId',
        render: text => <span>{text}</span>,
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
              // <NavLink to="/platform" style={{ marginRight: '4px' }}>预览结果</NavLink> 
            }
            <NavLink to={`/attestations/${record.attestationId}`}>查看证书</NavLink>
          </span>
        ),
      },
    ];
    return (
      <div className='data_core_page'>
        <div className='data_title'>
          <h3>过程取证</h3>
          <p>（当前取证剩余时长<span>4.5</span>分钟）</p>
        </div>
        {
          //   <div className='data_pore'>
          //   <RangePicker size='default' onChange={this.handleRangePicker} style={{ marginRight: '10px' }} />
          //   <Select defaultValue="" style={{ width: 140 }} onChange={this.handleSelectChange}>
          //     {
          //       proSelect.length && proSelect.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
          //     }
          //   </Select>
          //   <Search className='data_search' placeholder="输入保全号查询" onBlur={this.handleSearchChange} onSearch={this.handleSearchChange} enterButton />
          // </div>
        }
        <div className='data_table'>
          <Table rowKey={record => record.id} pagination={false} columns={columns} dataSource={tableData} />
          <div className='data_pagination'>
            <Pagination defaultCurrent={pageNum} onChange={this.handleTable} total={total} showTotal={() => `${total}页`} />
          </div>
        </div>
      </div>
    )
  }
}