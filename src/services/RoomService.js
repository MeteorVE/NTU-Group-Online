import axios from 'axios'
import store from '@/store/index.js'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const apiClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const apiDjango = axios.create({
  baseURL: `http://localhost:8000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiDjango.interceptors.request.use(
  (request) => {
    let token = store.state.token
    token && (request.headers.Authorization = 'Bearer ' + token)
    return request
  },
  (e) => Promise.reject(e)
)

apiDjango.interceptors.response.use(undefined, function (err) {
  return new Promise(function () {
    if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
    throw err
  })
})

export default {
  getRooms() {
    return apiDjango.get('/room/')
  },
  getUsers(name) {
    return apiClient.get('/users/' + name)
  },
  getRooms_js() {
    return apiClient.get('/rooms/')
  },
  getRoom(id) {
    return apiDjango.get('/rooms/' + id)
  },
  postRoom(room) {
    return apiClient.post('/rooms', room)
  },
}
