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

apiDjango.interceptors.response.use(undefined, function (res) {
  return new Promise(function () {
    if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
    if (res.status === 200) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
    }, function (err){
    // 處理響應失敗
    return Promise.reject(err);
    //throw err
  })
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
  getRoom(id) {
    return apiDjango.get('/room/' + id + '/')
  },
  getRoomMemberList(id) {
    return apiDjango.get('/room/' + id + '/member_list')
  },
  getRoomBlockList(id) {
    return apiDjango.get('/room/' + id + '/block_list/')
  },
  getRoomInvitationList(id) {
    return apiDjango.get('/room/' + id + '/invitation/')
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
  postJoinRoom(id, nickname) {
    return apiDjango.post('/room/' + id + '/join_room/', { nickname: nickname })
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
