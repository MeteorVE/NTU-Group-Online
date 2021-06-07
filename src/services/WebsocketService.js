import store from '@/store/index.js'
import jwt_decode from 'jwt-decode'
require('dotenv').config()

// const WsPrefix = 'ws://127.0.0.1:8090'
const WsPrefix = process.env.WS_SERVER
const NotifyWsServiceAddr = WsPrefix + '/wsServer/connection/user/'
const RoomWsPrefix = WsPrefix + '/ws/room/'

export class NotifyWsInfo {
  constructor(websocket, userID, token) {
    this.websocket = websocket
    this.userID = userID
    this.token = token
  }
}

export class RoomWsInfo {
  constructor(websocket, userID, roomID, token) {
    this.websocket = websocket
    this.userID = userID
    this.roomID = roomID
    this.token = token
  }
}

export default {
  InitNotifyWebsocket(token) {
    let tokenPayload = jwt_decode(token)
    store.state.user_id = tokenPayload.user_id
    let userID = tokenPayload.user_id
    var ws = new WebSocket(NotifyWsServiceAddr + userID)
    ws.onopen = function () {
      //console.log('Successful Connect')
      let sendInfo = { user_id: userID, token: token }
      ws.send(JSON.stringify(sendInfo))
      var notifyInfo = new NotifyWsInfo(ws, store.state.user_id, token)
      store.state.notifyWebsocketConn = notifyInfo
    }
    ws.onclose = () => {
      console.log('Notification websocket close')
    }
    return ws
  },
  InitRoomWebsocket(token, roomID) {
    let tokenPayload = jwt_decode(token)
    let userID = tokenPayload.user_id
    var ws = new WebSocket(RoomWsPrefix + roomID)
    ws.onopen = function () {
      let sendInfo = { user_id: userID, token: token }
      ws.send(JSON.stringify(sendInfo))
      var RoomInfo = new RoomWsInfo(ws, userID, roomID, token)
      store.state.roomWebsocketConn[roomID] = RoomInfo
    }
    ws.onclose = () => {
      console.log('Room ID: ' + roomID + ' websocket close')
    }
    return ws
  },
}

/*
class roomWsInfo {
    constructor(websocket, userID)
}
*/
