import axios from 'axios'
import createStore from '@/store/index.js'

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
    Authorization: 'Bearer ' + createStore.state.token,
  },
})

export default {
  getUsers(name) {
    return apiClient.get('/users/' + name)
  },
  getRooms() {
    return apiClient.get('/rooms/')
  },
  getRooms_for_django() {
    return apiDjango.get('/room/')
  },
  getRoom(id) {
    return apiClient.get('/rooms/' + id)
  },
  postRoom(room) {
    return apiClient.post('/rooms', room)
  },
}
