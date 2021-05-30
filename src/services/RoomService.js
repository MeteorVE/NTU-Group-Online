import axios from 'axios'
import store from '@/store/index.js'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

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
          this.$router.push('/')
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
  })

export default {
  renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map((key) => {
      const newKey = newKeys[key] || key
      return { [newKey]: obj[key] }
    })
    return Object.assign({}, ...keyValues)
  },
  getRooms() {
    return apiDjango.get('/room/')
  },
  postRoom(room) {
    // title, introduction, create_time, valid_time, room_type, room_category, people_limit
    const keyMapping = {
      description: 'introduction',
      type: 'room_type',
      capacity: 'people_limit',
      category: 'room_category',
    }
    const renamedRoom = this.renameKeys(room, keyMapping)
    console.log(renamedRoom)
    return apiDjango.post('/room/', renamedRoom)
  },

  getRoom(roomId) {
    return apiDjango.get('/room/' + roomId + '/')
  },

  getRoomMemberList(roomId) {
    return apiDjango.get('/room/' + roomId + '/member_list')
  },
  getRoomBlockList(roomId) {
    return apiDjango.get('/room/' + roomId + '/block_list/')
  },
  getRoomInvitationList(roomId) {
    return apiDjango.get('/room/' + roomId + '/invitation/')
  },

  postJoinRoom(roomId, nickname) {
    return apiDjango.post('/room/' + roomId + '/join_room/', {
      nickname: nickname,
    })
  },

  postBlockUser(roomId, userId, reason) {
    return apiDjango.post('/room/' + roomId + '/block/' + userId + '/', {
      reason: reason,
    })
  },
  //Method Not Allowed: /room/2/remove/18/
  deleteRemoveUser(roomId, userId, reason) {
    return apiDjango.delete('/room/' + roomId + '/remove/' + userId + '/', {
      reason: reason,
    })
  },
  // --------------------------------------
  // json-server used
  getUsers_js(name) {
    return apiClient.get('/users/' + name)
  },
  getRooms_js() {
    return apiClient.get('/rooms/')
  },
  postRoom_js(room) {
    return apiClient.post('/rooms', room)
  },
}
