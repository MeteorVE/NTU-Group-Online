import { createStore } from 'vuex'
import RoomService from '@/services/RoomService.js'
import TokenService from '@/services/TokenService.js'

export default createStore({
  state: {
    rooms: [],
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refresh_token') || '',
  },
  mutations: {
    ADD_ROOM(state, room) {
      state.rooms.push(room)
    },
    // setToken = (state, { token }) => state.token = token
    SET_TOKEN(state, token) {
      state.token = token['access']
      state.refreshToken = token['refresh']
    },
  },
  actions: {
    login({ commit }, loginInfo) {
      return TokenService.postLogin(loginInfo).then((res) => {
        if (res.status == 200) {
          commit('SET_TOKEN', res.data)
          localStorage.setItem('token', res.data['access'])
          localStorage.setItem('refresh_token', res.data['refresh'])
          console.log('[in action login]:', res)
        }
      })
    },
    logout({ commit }) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      commit('SET_TOKEN', { token: '', refresh: '' })
      console.log('complete logout')
      return 'success'
    },
    verifyToken() {
      return TokenService.postVerifyToken({ token: this.state.token })
      // .catch((err)=> console.log(err))
    },
    refreshToken() {
      return TokenService.postRefreshToken({ refresh: this.state.refreshToken })
    },
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
    getToken: (state) => state.token,
    isAuth: (state) => !!state.token,
  },
  modules: {},
})

/*
isAuth : 
如果是空的(含 '')，那就會是 false
如果有東西，通常就是有 token (不論是否 expired)

要處理可能 expired: 
if token exist:
  refresh it
else:
  login plz

*/ 