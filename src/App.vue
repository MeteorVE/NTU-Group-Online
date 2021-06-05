<template>
  <div id="app">
    <NavBar v-on:logoutsignal="logouthandle" />
    <router-view :key="$route.fullPath" v-on:wsConnStart="initWs" />
    <!-- <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4 }"
      placeholder="Here will show RoomWebsocketConn"
      v-model="textarea"
    >
    </el-input> -->
    <!-- 
    <el-button type="primary" plain @click="copyClipboard()"
      >Copy text</el-button
    >
    <el-button type="primary" plain @click="testReturn()"
      >test API: verify token</el-button
    > -->
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { mapState } from 'vuex'
import WsService from '@/services/WebsocketService.js'
//import store from '@/store/index.js'
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      textarea: '',
      hasInitWs: false,
      notifyws: null,
    }
  },
  created() {
    this.textarea = ''
    //------------------websocket-----------------------------
    //這是通知的websocket,具體說明在Room Show有了
    //靠夭啊好像做在Navbar就不用每頁去Handle了欸
    if (this.$store.state.token && (this.$store.state.notifyWebsocketConn == null) ) {
      this.hasInitWs = true
      this.notifyws = WsService.InitNotifyWebsocket(this.$store.state.token) //初始化
      console.log("this is create")
      this.notifyws.onmessage = (event) => {
        console.log(event.data)
        let res = JSON.parse(event.data) //-------收到的data-----------
        console.log(res)
        switch (res.header) {
          case 'setConn': //設定連線的東西
            if (res.res != 'Success Connect') {
              console.log('Authentication Error or Websocket server Error')
            }
            break
          case 'notify': //通知
            //console.log(res)
            console.log(res.notify_string)
            if (res.notify_string === 'notify') {
              console.log("You have notify")
            }
            //res.notify_string:按照開會的說法目前後端好像是說會送一個string過來,然後前端再去get,明天寫
            break
          case 'ping': //ping前端還有沒有活著
            break
        }
      }
    }
    //---------------------websocket------------------------
  },
  watch: {
    roomWebsocketConn: function (val) {
      this.textarea = val
    },
  },
  computed: {
    ...mapState(['token', 'roomWebsocketConn']),
  },
  methods: {
    copyClipboard() {
      let input = document.body.appendChild(document.createElement('input'))
      input.setAttribute('value', this.textarea)
      input.select()
      input.setSelectionRange(0, 99999) /* For mobile devices */
      document.execCommand('copy')
      console.log(this.textarea)
    },
    testReturn() {
      let ret = this.testAPI()
      //this.consoleText = ret.then((res) => console.log('[testReturn]', res))
      console.log('in testReturn :', ret, this.consoleText)
    },
    testAPI() {
      this.$store
        .dispatch('verifyToken', this.event)
        .then((res) => {
          console.log('[App.vue] testAPI, then:', res, res.data)
          return res
        })
        .catch((err) => {
          console.log(
            '[App.vue] testAPI, catch: There was a problem in test API'
          )
          console.log(err.response.data)
          return err.response.data
        })
    },
    initWs: function (wsConn) {
      console.log("emit")
      console.log(wsConn)
      console.log(this.hasInitWs)
      if (wsConn === true && this.hasInitWs === false) {
        this.hasInitWs = true
        //------------------websocket-----------------------------
        //這是通知的websocket,具體說明在Room Show有了
        //靠夭啊好像做在Navbar就不用每頁去Handle了欸
        console.log(this.$store.state.token)
        console.log(this.$store.state.notifyWebsocketConn)
        console.log("This isn't create")
        if (this.$store.state.token && (this.notifyws == null)) {
          console.log('initiate')
          this.notifyws = WsService.InitNotifyWebsocket(this.$store.state.token) //初始化
          this.notifyws.onmessage = (event) => {
            console.log(event.data)
            let res = JSON.parse(event.data) //-------收到的data-----------
            console.log(res)
            switch (res.header) {
              case 'setConn': //設定連線的東西
                if (res.res != 'Success Connect') {
                  console.log('Authentication Error or Websocket server Error')
                }
                break
              case 'notify': //通知
                console.log(res.notify_string)
                if (res.notify_string === 'notify') {
                  console.log("You have notify")
                }
                //res.notify_string:按照開會的說法目前後端好像是說會送一個string過來,然後前端再去get,明天寫
                break
              case 'ping': //ping前端還有沒有活著
                break
            }
          }
        }
        //---------------------websocket------------------------
      }
    },
    logouthandle: function () { //logout and clean websocket
      this.hasInitWs = false
      console.log('websocket close')
      if (this.notifyws != null) {
       this.notifyws.close()
       this.notifyws = null
      }
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-height: 100%;
}
body {
  margin: 0 !important;
}
</style>
