import { createStore } from 'vuex'
import TokenService from '@/services/TokenService.js'
import RoomService from '../services/RoomService'
//import WsService from '@/services/WebsocketService.js'

export default createStore({
  state: {
    filter: '',
    roomWebsocketConn: {},
    notifyWebsocketConn: null,
    user_id: -1,
    is_verify: null,
    first_connect: true,
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refresh_token') || '',
  },
  mutations: {
    // setToken = (state, { token }) => state.token = token
    SET_TOKEN(state, token) {
      if ('access' in token) {
        state.token = token['access']
        localStorage.setItem('token', token['access'])
      }
      if ('refresh' in token) {
        state.refreshToken = token['refresh']
        localStorage.setItem('refresh_token', token['refresh'])
      }
    },
    SET_VERIFY(state, _is_verify) {
      state.is_verify = _is_verify
    },
    SET_UID(state, uid) {
      state.user_id = uid
    },
  },
  actions: {
    login({ commit }, loginInfo) {
      return TokenService.postLogin(loginInfo).then((res) => {
        if (res.status == 200) {
          commit('SET_TOKEN', res.data)
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
          //WsService.InitNotifyWebsocket(res.data.access)
          return Promise.resolve(res)
        } else {
          console.log('[Action refreshToken]: 理論上不會出現這行', res)
        }
      })
    },
    async resetToken({ commit }) {
      await commit('SET_TOKEN', { access: '', refresh: '' })
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
    },
    async getIsVerify({ commit }) {
      let uid = -1
      await RoomService.getUserId()
        .then((res) => {
          uid = res.data.id
          return RoomService.getUserDetail(uid)
        })
        .then((res) => {
          if (res.data.is_verify == true) {
            commit('SET_VERIFY', true)
          } else {
            commit('SET_VERIFY', false)
          }
        })
        .catch((err) => {
          console.log('[store.getIsVerify err]:', err)
        })
    },
    async getUserId({commit}){
      await RoomService.getUserId()
        .then((res) => {
          commit('SET_UID', res.data.id)
        })
        .catch((err) => {
          console.log('[store.getUserId err]:', err)
        })
    }
  },
  getters: {
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
