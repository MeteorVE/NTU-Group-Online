import axios from 'axios'
import store from '@/store/index.js'
import router from '@/router/index.js'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const apiDjango = axios.create({
  baseURL: process.env.VUE_APP_BACKEND,
  // baseURL: `http://localhost:8000`,
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

apiDjango.interceptors.response.use(
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

export default {
  getUserId() {
    return apiDjango.get('/api/user/get_id/')
  },

  getUser(userId) {
    return apiDjango.get('/api/user/' + userId + '/')
  },

  getUserRoom() {
    return apiDjango.get('/user_room/')
  },

  getUserAdminRoom() {
    console.log("ddddddddddd")
    return apiDjango.get('/user_admin_room/')
  },

  getInvitationList() {
    return apiDjango.get('/invitation/')
  },

  putUserEdit(userId, newLastName, newFirstName) {
    return apiDjango.put('/api/user/' + userId + '/', {
      last_name: newLastName,
      first_name: newFirstName,
    })
  },

  putChangePassword(userId, oldPassword, newPassword1, newPassword2) {
    return apiDjango.put('/api/user/' + userId + '/change_password/', {
      old_password: oldPassword,
      password: newPassword1,
      password2: newPassword2,
    })
  },

  postAcceptInvite(inviteId, userNickname) {
    return apiDjango.post('/accept_invite/' + inviteId + '/', {
      nickname: userNickname,
    })
  },

  deleteRejectInvite(inviteId) {

    return apiDjango.delete('/reject_invite/' + inviteId + '/')
  },
}
