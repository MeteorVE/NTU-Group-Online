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
      if ('access' in token){
        state.token = token['access']
        localStorage.setItem('token', token['access'])
      }
      if('refresh' in token){
        state.refreshToken = token['refresh']
        localStorage.setItem('refresh_token', token['refresh'])
      }
    },
  },
  actions: {
    login({ commit }, loginInfo) {
      return TokenService.postLogin(loginInfo).then((res) => {
        if (res.status == 200) {
          commit('SET_TOKEN', res.data)
          console.log('[in action login]:', res)
        }
      })
    },
    async logout({ dispatch }) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      await dispatch('resetToken')
      console.log('complete logout')
      return 'success'
    },
    verifyToken() {
      return TokenService.postVerifyToken({ token: this.state.token })
      // .catch((err)=> console.log(err))
    },
    refreshToken({ commit }) {
      return TokenService.postRefreshToken({
        refresh: this.state.refreshToken || 'invalid_refresh_token_setting_for',
      }).then((res) => {
        if (res.status == 200) {
          commit('SET_TOKEN', res.data)
          localStorage.setItem('token', res.data['access'])
          console.log('[Action login]: complete', res)
          return Promise.resolve(res)
        } else {
          console.log('[Action refreshToken]: 理論上不會出現這行', res)
        }
      })
    },
    async resetToken({ commit }) {
      await commit('SET_TOKEN', { 'access': '', 'refresh': '' })
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
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
