import axios from '@/utils/http'

// 详情接口
export const attestationInfo = params => axios.post('/ws/attestation/info', params)

// 过程取证列表接口
export const processEvidences = params => axios.get('/ws/process/evidences', { params })

// 网页取证列表接口
export const webAttestations = params => axios.get('/ws/web/attestations', { params })