import axios from 'axios';

axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  let Authorization = localStorage.getItem('Authorization');
  config.headers['Authorization'] = Authorization;
  return config;
}, err => {
  return Promise.reject(err);
})

axios.interceptors.response.use(res => {
  // 登录过期
  if (res.data.statusCode === "500032") {
    localStorage.removeItem('Authorization')
    localStorage.removeItem('username')
    window.location.href = "/"
  }
  return res.data;
}, err => {
  return Promise.reject(err);
})


export default axios;