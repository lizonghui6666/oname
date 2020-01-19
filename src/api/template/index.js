import axios from '@/utils/http'

// 获取默认模板选项
export const templateDefault = params => axios.get('/ws/template/defalut', { params })

// 创建模板
export const templateCreate = params => axios.post('/ws/template/create', params)

// 修改
export const templatePut = params => axios.put(`/ws/template/${params}`)



// 删除模板
export const templateDelete = params => axios.delete(`/ws/template/${params}`)
// 修改模板名称
export const templatePutName = (id, params) => axios.put(`/ws/template/${id}/name`, params)
//跳转模板详情
export const templateDetail = params => axios.get(`/ws/template/${params}`)
// 提交模板
export const templateStatus = params => axios.post(`/ws/template/${params}/status`)
// 获取模板信息
export const templateInfo = params => axios.post('/ws/template/info', params)