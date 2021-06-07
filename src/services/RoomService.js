import axios from 'axios'
import store from '@/store/index.js'
import router from '@/router/index.js'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

const apiDjango = axios.create({
  baseURL: `http://localhost:8000`,
  // baseURL: `https://ntu-online-group-api.herokuapp.com/`,
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
    console.log('[Room]:', room.date2.toString())

    const keyMapping = {
      description: 'introduction',
      type: 'room_type',
      capacity: 'people_limit',
      category: 'room_category',
    }
    const renamedRoom = this.renameKeys(room, keyMapping)
    renamedRoom['valid_time'] =
      room.date1.getFullYear() +
      '-' +
      (room.date1.getMonth() + 1) +
      '-' +
      room.date1.getDate() +
      ' ' +
      room.date2.toString().slice(16, 24)

    console.log('[renamedRoom]:', renamedRoom)
    return apiDjango.post('/room/', renamedRoom)
  },

  getRoom(roomId) {
    return apiDjango.get('/room/' + roomId + '/')
  },
  putRoom(roomId, dict) {
    return apiDjango.put('/room/' + roomId + '/', dict)
  },
  getRoomMemberList(roomId) {
    return apiDjango.get('/room/' + roomId + '/member_list/')
  },
  getRoomBlockList(roomId) {
    return apiDjango.get('/room/' + roomId + '/block_list/')
  },

  postJoinRoom(roomId, nickname) {
    return apiDjango.post('/room/' + roomId + '/join_room/', {
      nickname: nickname,
    })
  },
  deleteLeaveRoom(roomId) {
    return apiDjango.delete('room/' + roomId + '/leave_room/')
  },
  deleteRoom(roomId) {
    return apiDjango.delete('room/' + roomId + '/')
  },

  getRoomCategory() {
    return apiDjango.get('/room/category_list/')
  },
  getRoomType() {
    return apiDjango.get('/room/type_list/')
  },

  // Block and Unblock
  postBlockUser(roomId, userId, reason) {
    return apiDjango.post('/room/' + roomId + '/block/' + userId + '/', {
      reason: reason,
    })
  },
  deleteUnblockUser(roomId, userId) {
    return apiDjango.delete('/room/' + roomId + '/unblock/' + userId + '/')
  },

  // Remove User
  deleteRemoveUser(roomId, userId, reason) {
    return apiDjango.delete('/room/' + roomId + '/remove/' + userId + '/', {
      reason: reason,
    })
  },

  // Transefer Admin
  putTransferAdmin(roomId, newAdminId) {
    return apiDjango.put(
      '/room/' + roomId + '/transfer_admin/' + newAdminId + '/'
    )
  },
  putSetLevel(roomId, dict) {
    return apiDjango.put('/room/' + roomId + '/set_access_level/', dict)
  },

  // Invitation
  getRoomInvitationList(roomId) {
    return apiDjango.get('/room/' + roomId + '/invitation/')
  },
  // room/6/invite/19/
  postRoomInvite(roomId, userId) {
    return apiDjango.post('/room/' + roomId + '/invite/' + userId + '/')
  },
  getRoomRecord(roomId) {
    return apiDjango.get('/room_record/' + roomId + '/')
  },

  getUserId() {
    return apiDjango.get('/api/user/get_id/')
  },
  getUserDetail(userId) {
    return apiDjango.get('/api/user/' + userId + '/')
  },
  getUserRooms() {
    return apiDjango.get('/user_room/')
  },
  getMailVerify(userToken, token) {
    return apiDjango.get(
      '/api/user/verify_email/' + userToken + '/' + token + '/'
    )
  },
  postResetPassword(userToken, token, _password) {
    return apiDjango.post(
      '/api/user/password_reset/' + userToken + '/' + token + '/',
      { password: _password }
    )
  },
  postRegister(dict) {
    return apiDjango.post('/api/user/register/', dict)
  },
}
