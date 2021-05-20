import axios from 'axios'
import store from '@/store/index.js'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

//const state = store ? store.state : {}
// console.log(store)

const apiClient = axios
  .create({
    baseURL: `http://localhost:8000`,
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

apiClient.interceptors.response.use(undefined, function (err) {
  return new Promise(function () {
    if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
    throw err
  })
})
//console.log(apiClient.defaults.headers.common['Authorization']) 

export default {
  postLogin(loginInfo) {
    console.log({
      username: loginInfo['username'],
      password: loginInfo['password'],
    })
    return apiClient.post('/token/', {
      username: loginInfo['username'],
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
