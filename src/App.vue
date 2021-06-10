<template>
  <div id="app">
    <NavBar
      v-on:logoutsignal="logouthandle"
      v-on:showNotification="getNotification"
    />
    <router-view :key="$route.fullPath" v-on:wsConnStart="initWs" />
    <el-drawer
      :with-header="false"
      :before-close="handleDrawerClose"
      v-model="drawer"
      direction="ltr"
      size="25%"
    >
      <el-scrollbar>
        <h4 class="notifyTitle" v-if="unreadNotification.length > 0">
          未讀通知
        </h4>
        <el-card
          shadow="hover"
          v-for="(not, index) in unreadNotification"
          :key="index"
          @mouseover="showCloseIcon[index] = true"
          @mouseleave="showCloseIcon[index] = false"
        >
          <div class="notifyBlock">
            <span class="notifyText">{{ not.text }}</span>
            <i
              class="el-icon-close"
              v-show="showCloseIcon[index]"
              @click="deleteNotification(not.id)"
            ></i>
          </div>
          <p class="notifyTime">{{ not.time }}</p>
        </el-card>
        <h4 class="notifyTitle" v-if="readNotification.length > 0">已讀通知</h4>
        <el-card
          shadow="hover"
          v-for="(not, index) in readNotification"
          :key="index"
          @mouseover="showCloseIcon[index] = true"
          @mouseleave="showCloseIcon[index] = false"
        >
          <div class="notifyBlock">
            <span class="notifyText">{{ not.text }}</span>
            <i
              class="el-icon-close"
              v-show="showCloseIcon[index]"
              @click="deleteNotification(not.id)"
            ></i>
          </div>
          <p class="notifyTime">{{ not.time }}</p>
        </el-card>
        <div v-show="notifications.length === 0">
          <el-empty class="noNotifications" description="沒有通知"></el-empty>
        </div>
      </el-scrollbar>
    </el-drawer>
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
import UserService from '@/services/UserService.js'
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
      drawer: false,
      showCloseIcon: new Array(1000).fill(0),
      notificationIds: new Set(),
      notifications: [],
      noNotification: true,
    }
  },
  created() {
    this.textarea = ''
    //------------------websocket-----------------------------
    //這是通知的websocket,具體說明在Room Show有了
    //靠夭啊好像做在Navbar就不用每頁去Handle了欸
    if (this.$store.state.token && this.hasInitWs === false) {
      this.hasInitWs = true
      this.notifyws = WsService.InitNotifyWebsocket(this.$store.state.token) //初始化
      console.log(this.notifyws)
      console.log('notify websocket init success')
      this.notifyws.onmessage = (event) => {
        //console.log(event.data)
        let res = JSON.parse(event.data) //-------收到的data-----------
        //console.log(res)
        switch (res.header) {
          case 'setConn': //設定連線的東西
            if (res.res != 'Success Connect') {
              console.log('Authentication Error or Websocket server Error')
            } else {
              console.log(this.notifyws)
              console.log('notify websocket init success')
            }
            break
          case 'notify': //通知
            //console.log(res)
            console.log(res.notify_string)
            if (res.notify_string === 'notify') {
              console.log('You have notify')
            }
            //res.notify_string:按照開會的說法目前後端好像是說會送一個string過來,然後前端再去get,明天寫
            break
          case 'ping': //ping前端還有沒有活著
            break
        }
      }
    }
    //---------------------websocket------------------------
    if (this.$store.state.token) {
      this.$store.dispatch('getIsVerify').then(() => {
        console.log('is_verify:', this.$store.state.is_verify)
      })
    }
  },
  watch: {
    roomWebsocketConn: function (val) {
      this.textarea = val
    },
  },
  computed: {
    ...mapState(['token', 'roomWebsocketConn']),
    readNotification: function () {
      return this.notificationFilter('read')
    },
    unreadNotification: function () {
      return this.notificationFilter('unread')
    },
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
    markNotification(notId) {
      UserService.readUserNotification(notId)
      for (var i = 0; i < this.notifications.length; i++) {
        if (this.notifications[i].id === notId) {
          this.notifications[i].status = 'read'
        }
      }
    },
    getNotification() {
      UserService.getUserNotification()
        .then((res) => {
          for (let idx in res.data) {
            let message = res.data[idx]
            if (!this.notificationIds.has(message.id)) {
              this.notificationIds.add(message.id)
              let notificationObj = {
                id: message.id,
                text: message.message,
                time: new Date(message.created_time),
                status: message.status,
              }
              this.notifications.push(notificationObj)
            }
          }
        })
        .catch((err) => {
          console.log(err.data)
        })
      this.drawer = true
    },
    handleDrawerClose() {
      for (var not of this.notifications) {
        this.markNotification(not.id)
      }
      this.drawer = false
    },
    deleteNotification(notId) {
      for (var i = 0; i < this.notifications.length; i++) {
        if (this.notifications[i].id === notId) {
          this.notifications.splice(i, 1)
          UserService.deleteUserNotification(notId)
          break
        }
      }
    },
    notificationFilter(status) {
      let messages = []
      let reversedNot = this.notifications
        .filter((not) => not.status === status)
        .sort((a, b) => b.time - a.time)

      for (const not of reversedNot) {
        let timeString = this.getTimeDiff(not.time)
        let message = {
          id: not.id,
          text: not.text,
          time: timeString,
        }
        messages.push(message)
      }
      return messages
    },
    getTimeDiff(createdTime) {
      let msInSecond = 1000
      let msInMinute = 60 * msInSecond
      let msInHour = 60 * msInMinute
      let msInDay = 24 * msInHour
      let msInMonth = 30 * msInDay
      let msInYear = 12 * msInMonth
      let currentTime = new Date()

      let timeDiff = currentTime.getTime() - createdTime.getTime()
      let yearDiff = Math.floor(timeDiff / msInYear)
      let monthDiff = Math.floor(timeDiff / msInMonth)
      let dayDiff = Math.floor(timeDiff / msInDay)
      let hourDiff = Math.floor(timeDiff / msInHour)
      let minuteDiff = Math.floor(timeDiff / msInMinute)
      let secondDiff = Math.floor(timeDiff / msInSecond)
      var timeString = ''

      if (yearDiff) {
        timeString = yearDiff + '年前'
      } else if (monthDiff) {
        timeString = monthDiff + '個月前'
      } else if (dayDiff) {
        timeString = dayDiff + '天前'
      } else if (hourDiff) {
        timeString = hourDiff + '小時前'
      } else if (minuteDiff) {
        timeString = minuteDiff + '分鐘前'
      } else if (secondDiff) {
        timeString = secondDiff + '秒前'
      } else {
        timeString = '現在'
      }

      return timeString
    },
    initWs: function (wsConn) {
      // console.log('[emit] in App.vue', wsConn, this.hasInitWs)
      if (wsConn === true && this.hasInitWs === false) {
        this.hasInitWs = true
        //------------------websocket-----------------------------
        //這是通知的websocket,具體說明在Room Show有了
        //靠夭啊好像做在Navbar就不用每頁去Handle了欸
        // console.log(this.$store.state.token)
        // console.log(this.$store.state.notifyWebsocketConn)
        // console.log("This isn't create")
        if (this.$store.state.token && this.notifyws == null) {
          console.log('initiate')
          this.notifyws = WsService.InitNotifyWebsocket(this.$store.state.token) //初始化
          this.notifyws.onmessage = (event) => {
            //console.log(event.data)
            let res = JSON.parse(event.data) //-------收到的data-----------
            //console.log(res)
            switch (res.header) {
              case 'setConn': //設定連線的東西
                if (res.res != 'Success Connect') {
                  console.log('Authentication Error or Websocket server Error')
                } else {
                  console.log(this.notifyws)
                  console.log('notify websocket init success')
                }
                break
              case 'notify': //通知
                console.log(res.notify_string)
                if (res.notify_string === 'notify') {
                  console.log('You have notify')
                  // todos: getNotificationList
                  // ... index++
                }
                // notification 顯示在小鈴鐺裡面的
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
    logouthandle: function () {
      //logout and clean websocket
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
  /* text-align: center; */
  color: #2c3e50;
  max-height: 100%;
}
body {
  margin: 0 !important;
}
.el-drawer__body {
  overflow: auto;
}
.notifyBlock {
  display: flex;
  justify-content: space-between;
}
.notifyBlock .el-icon-close:hover {
  color: #409eff;
  cursor: pointer;
}
.notifyTitle {
  margin-left: 20px;
}
.notifyTime {
  font-size: 12px;
  margin-top: 6px;
  margin-bottom: 0;
  color: #409eff;
}
.notifyText {
  font-size: 14px;
}
.notifyReason {
  margin-bottom: 0;
}
.noNotifications {
  align-items: center;
}
</style>
