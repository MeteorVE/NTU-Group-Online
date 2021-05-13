import { createStore } from 'vuex'
import RoomService from '@/services/RoomService.js'

export default createStore({
  state: {
    rooms: [],
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
