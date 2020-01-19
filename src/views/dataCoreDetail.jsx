import React, { Component } from 'react'
import { Icon, Popover } from 'antd'

import { attestationInfo } from '@/api/datacore'
import { dataFormData } from '@/utils/formData';
import '@/assets/css/dataCore.scss'
import '@/assets/css/template-theme.scss'
import Header from '@/components/layout/header'
const logo = require('@/assets/images/blue-logo.png')



export default class DataCoreDetailPage extends Component {

  state = {
    ano: "",
    category: "",
    chainHash: "",
    fileHash: "",
    html: '',
    veraxUrl: ""
  }

  componentDidMount () {
    let params = { ano: this.props.match.params.id }
    attestationInfo(dataFormData(params)).then(res => {
      if (res.statusCode === '000000') {
        this.setState({
          html: res.data.html,
          ano: res.data.ano,
          category: res.data.category,
          chainHash: res.data.chainHash,
          fileHash: res.data.fileHash,
          veraxUrl: res.data.veraxUrl
        })
      }
    })
  }

  render () {
    let { category, chainHash, fileHash, veraxUrl, html } = this.state;
    const sec = <p style={{ color: 'rgb(51, 51, 51)', width: '280px', fontSize: '12px' }}>HASH存证文件HASH是通过SHA256算法计算后得出的文件HASH值，与原始存证文件唯一对应。该HASH值将被实时写入保全链，确保文件的不可篡改</p>;
    const sec2 = <p style={{ color: 'rgb(51, 51, 51)', width: '250px', fontSize: '12px' }}>区块链哈希值是包含本次存证HASH上链信息的的区块交易hash值，通过此hash可以在保全链浏览器查询到文件hash上链信息。</p>
    return (
      <div className='data_core_Detail'>
        <Header background='rgb(17, 27, 52)' height="45px" />
        <main className='data_content'>
          <div className='block_chain'>
            <div className='block_chain_title'>
              <img src={logo} style={{ width: '105px', height: '35px' }} alt='' />
              <h1>区块链验证</h1>
            </div>
            <div className='chain'>
              <span>存证文件HASH256</span>
              <p>{fileHash}</p>
              <Popover content={sec} title="存证文件HASH">
                <span className='chain_sec'>?</span>
              </Popover>
            </div>
            <div className='chain'>
              <span>国密SM3的HASH</span>
              <p>{chainHash}</p>
            </div>

            <div className='block_chain_item'>
              <span className='chain_name'>
                VERAXCHAIN
              </span>
              <div className='chain_info'>
                <p className='description'>
                  保全链是保全网基于Fabric架构定制开发，联合司法鉴定机构、公证处、知识产权局、司法厅等权威机构共同搭建的可信司法联盟链。
                </p>
                <span className='hash'>
                  区块链哈希值：
                  <a href={veraxUrl}>{chainHash}</a>
                  <Popover content={sec2} title="区块链哈希值">
                    <span className='chain_sec'>?</span>
                  </Popover>
                </span>
              </div>
              <i className='iconfont font-dui' style={{ position: "absolute", right: '10px', fontSize: '34px', color: '#00bfa5' }}></i>
            </div>
          </div>
          {
            // <div className='block_chain_code '>
            //   <p className='evidence_chain_code'>
            //     证据提取码：<span>123123</span>
            //     <span className='evidence_chain_des'>(提取码仅为本人可见，非本人登陆查看证书不显示)</span>
            //     <Tooltip placement="top" title={sec2} >
            //       <span className='chain_sec'>?</span>
            //     </Tooltip>
            //   </p>
            // </div>
          }
          {
            <div className="attestation-result" dangerouslySetInnerHTML={{ __html: html }} />
          }
        </main>
      </div>
    )
  }
}
