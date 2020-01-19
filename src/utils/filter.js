import { timeFormat } from './formData'

export const processDataFilter = (data) => {

  for (let i = 0; i < data.length; i++) {
    data[i].createAt = timeFormat(data[i].createAt);
    switch (data[i].status) {
      case 'NEW':
        data[i].tStatus = '创建取证'
        break;
      case 'FELLIN':
        data[i].tStatus = '等待排队'
        break;
      case 'FINISHED':
        data[i].tStatus = '取证成功'
        break;
      case 'FAILED':
        data[i].tStatus = '取证失败'
        break;
      case 'CANCEL':
        data[i].tStatus = '取消取证'
        break;
      case 'START':
        data[i].tStatus = '系统初始化开始'
        break;
      case 'RUNNING':
        data[i].tStatus = '系统初始化完成'
        break;
      case 'RECORD':
        data[i].tStatus = '启动录屏开始'
        break;
      case 'RECORDING':
        data[i].tStatus = '启动录屏完成--取证中'
        break;
      case 'UPLOAD':
        data[i].tStatus = '取证结束视频上传中'
        break;

      default:
        break;
    }
  }
  return data;
}


export const webDataFilter = (data) => {

  for (let i = 0; i < data.length; i++) {
    data[i].createAt = timeFormat(data[i].createAt);
    switch (data[i].status) {
      case "New":
        data[i].tStatus = "初始化"
        break;
      case "UNDERWAY":
        data[i].tStatus = "取证中"
        break;
      case "SYNCHRO":
        data[i].tStatus = "同步失败待重试"
        break;
      case "TWO_STAGE":
        data[i].tStatus = "待取证（2阶段取证）"
        break;
      case "SUCCESSED":
        data[i].tStatus = "成功"
        break;
      case "FAILED":
        data[i].tStatus = "失败"
        break;

      default:
        break;
    }
  }
  return data
}


export const templateFilterInfo = (data) => {
  // DRAFT: "草稿"，IN_REVIEW: "审核中"，APPROVED: "同意"，REJECTED: "拒绝", OFFLINE: "下线"
  switch (data) {
    case "DRAFT":
      return "草稿"
    case "IN_REVIEW":
      return "审核中"
    case "APPROVED":
      return "同意"
    case "REJECTED":
      return "拒绝"
    case "OFFLINE":
      return "下线"
    default:
      break;
  }

}