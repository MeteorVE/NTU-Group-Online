import { createStore } from 'vuex'
import RoomService from '@/services/RoomService.js'

export default createStore({
  state: {
    rooms: [],
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjIxMDI0NzE0LCJqdGkiOiIwN2E4NjcxNGQ4YTM0MDY0YThiMGUwMTA1MzdlZGVmNCIsInVzZXJfaWQiOjEsIm5hbWUiOiJ0ZXN0In0.YHbRj9Ici036u3k1yPjiEjZWq9IJZrV_sYHaQN7zGzw',
  },
  mutations: {
    ADD_ROOM(state, room) {
      state.rooms.push(room)
    },
  },
  actions: {
    createRoom({ commit }, room) {
      return RoomService.postRoom(room).then(() => {
        commit('ADD_ROOM', room)
      })
    },
  },
  getters: {
    getRoomById: (state) => (id) => {
      return state.rooms.find((room) => room.id === id)
    },
  },
  modules: {},
})
