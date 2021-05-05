import axios from 'axios'

const apiClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getRooms() {
    return apiClient.get('/rooms')
  },
  getRoom(id) {
    return apiClient.get('/rooms/' + id)
  },
  postRoom(room) {
    return apiClient.post('/rooms', room)
  }
}
