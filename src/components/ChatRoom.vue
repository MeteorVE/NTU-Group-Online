<template>
  <el-scrollbar class="messageWrapperScrollBar">
    <div class="messagesWrapper">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="bubbleWrapper"
        ref="messageRef"
      >
        <!-- <template v-if="message.user === 'myself'"> -->
        <template v-if="message.user === myID">
          <div class="inlineContainer own">
            <img
              class="inlineIcon"
              src="https://www.pinclipart.com/picdir/middle/205-2059398_blinkk-en-mac-app-store-ninja-icon-transparent.png"
            />
            <div class="ownBubble own">{{ message.text }}</div>
          </div>
          <span class="own">{{ message.time }}</span>
        </template>
        <template v-else>
          <div class="inlineContainer">
            <img
              class="inlineIcon"
              src="https://cdn1.iconfinder.com/data/icons/ninja-things-1/1772/ninja-simple-512.png"
            />
            <div class="otherBubble other">{{ message.text }}</div>
          </div>
          <span class="other">{{ message.time }}</span>
        </template>
      </div>
    </div>
  </el-scrollbar>
  <el-input
    placeholder="輸入訊息"
    v-model="message"
    @keydown="addMessage"
    class="messageInput"
  ></el-input>
</template>

<script>
//import WsService from '@/services/WebsocketService.js'

export default {
  props: ['roomws', 'messages'],
  computed: {
    myID: function () {
      return this.$store.state.user_id
    },
  },
  data() {
    return {
      message: '',
    }
  },
  methods: {
    addMessage(e) {
      if (e.key === 'Enter' && this.message) {
        var today = new Date()
        var hour = today.getHours()
        var minute = today.getMinutes()
        hour = String(hour).padStart(2, '0')
        minute = String(minute).padStart(2, '0')
        var currentTime = `${hour}:${minute}`
        var newMessage = {
          user: this.$store.state.user_id,
          text: this.message,
          time: currentTime,
        }
        this.$emit('addMessasge', newMessage)
        // 這裡是要傳送訊息到Websocket server的code
        let nowRoomID = parseInt(this.$route.params.id, 10)
        console.log(this.$store.state.user_id)
        let msgObj = {
          header: 'message', // Message 的 header,正常message的header就叫message
          msg_type: 'text', // Message 的 type,因為當初本來有考慮要送圖片 但現在沒有,所以type是text
          userID: this.$store.state.user_id, //送這個message的user ID, 一開始就有存在store裡面
          roomID: nowRoomID, // 目前的roomID,用route參數的ID來判斷
          message: this.message, //文字訊息
          token: this.$store.state.token, //Request 都必需附上token
        }
        this.roomws[nowRoomID].send(JSON.stringify(msgObj))
        this.message = ''
      }
    },
  },
  watch: {
    messages: {
      immediate: true,
      deep: true,
      handler() {
        this.$nextTick(function () {
          const el = this.$refs.messageRef
          if (el) {
            el.scrollIntoView(false, { behavior: 'smooth' })
          }
        })
      },
    },
  },
}
</script>

<style>
.messageWrapperScrollBar {
  max-height: 90%;
}
.messagesWrapper {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
}
.bubbleWrapper {
  padding: 10px 10px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-self: flex-end;
  color: #fff;
  font-size: 14px;
}
.inlineContainer {
  display: inline-flex;
}
.inlineContainer.own {
  flex-direction: row-reverse;
}
.inlineIcon {
  width: 20px;
  object-fit: contain;
}
.ownBubble {
  min-width: 20px;
  max-width: 700px;
  padding: 14px 18px;
  margin: 6px 8px;
  background-color: #5b5377;
  border-radius: 16px 16px 0 16px;
  border: 1px solid #443f56;
}
.otherBubble {
  /* min-width: 60px; */
  min-width: 20px;
  max-width: 700px;
  padding: 14px 18px;
  margin: 6px 8px;
  background-color: #6c8ea4;
  border-radius: 16px 16px 16px 0;
  border: 1px solid #54788e;
}
.own {
  align-self: flex-end;
}
.other {
  align-self: flex-start;
}
span.own,
span.other {
  font-size: 12px;
  color: grey;
}
</style>
