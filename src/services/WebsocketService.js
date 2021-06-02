import store from '@/store/index.js'

const NotifyWsServiceAddr = "ws://127.0.0.1:8090/wsServer/connection/user/"

export class NotifyWsInfo {
  constructor(websocket, userID, token) {
    this.websocket = websocket
    this.userID = userID
    this.token = token
  }
}

export default {
  InitNotifyWebsocket(userID, token) {
    let ws = new WebSocket(NotifyWsServiceAddr + userID)
    ws.onopen = function () {
      console.log('Successful Connect')
      //var notifyInfo = new NotifyWsInfo(ws, store.userID, token)
      let sendInfo = { user_id: userID, token: token }
      ws.send(JSON.stringify(sendInfo))
      ws.onmessage = (event) => {
        let ret = JSON.parse(event.data)
        if (ret.status != 'Success Connect') {
          console.log(ret.status)
          console.log('Authentication Error or Websocket server Error')
        }
        var notifyInfo = new NotifyWsInfo(ws, userID, token)
        store.state.notifyWebsocketConn = notifyInfo
      }
    }
  }
}

/*
class roomWsInfo {
    constructor(websocket, userID)
}
*/