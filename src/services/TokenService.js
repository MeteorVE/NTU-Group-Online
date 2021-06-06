import axios from 'axios'
import store from '@/store/index.js'
import router from '@/router/index.js'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


const apiClient = axios.create({
  baseURL: `http://localhost:8000`,
  // baseURL: `https://ntu-online-group-api.herokuapp.com/`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (request) => {
    let token = store.state.token
    token && (request.headers.Authorization = 'Bearer ' + token)
    return request
  },
  (e) => Promise.reject(e)
)

apiClient.interceptors.response.use(
  (res) => {
    return Promise.resolve(res)
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 401:
          console.log('登入無效')
          store.dispatch('logout')
          router.push('/')
          break
        case 404:
          console.log('找不到該頁面')
          break
        case 500:
          console.log('伺服器出錯')
          break
        case 503:
          console.log('服務失效')
          break
        default:
          console.log(`連接錯誤${err.response.status}`)
      }
    } else {
      console.log('連接到服務器失敗')
    }
    return Promise.reject(err.response)
  }
)
//console.log(apiClient.defaults.headers.common['Authorization']) 

export default {
  postLogin(loginInfo) {
    return apiClient.post('/token/', {
      email: loginInfo['email'],
      password: loginInfo['password'],
    })
  },

  postVerifyToken(token) {
    // verify token is valid or not. /POST {token}
    return apiClient.post('/token/verify/', token)
  },

  postRefreshToken(token) {
    // verify token is valid or not. /POST {token}
    return apiClient.post('/token/refresh/', token)
  },

  getRoom(id) {
    return apiClient.get('/rooms/' + id)
  },
  postRoom(room) {
    return apiClient.post('/rooms', room)
  },
}
