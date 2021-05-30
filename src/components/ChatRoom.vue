<template>
  <div class="messagesWrapper">
    <div
      v-for="(message, index) in messages"
      :key="index"
      class="bubbleWrapper"
    >
      <template v-if="message.user === 'myself'">
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
  <el-input
    placeholder="輸入訊息"
    v-model="message"
    @keydown="addMessage"
    class="message-input"
  ></el-input>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      messages: [
        {
          id: 1,
          user: 'other',
          text: '請問大家知道入境荷蘭前需要做PCR核酸檢測的事情嗎～～',
          time: '08:41',
        },
        {
          id: 2,
          user: 'myself',
          text: '我之前都不知道，剛剛看到「台灣人在荷蘭」FB有人在問',
          time: '08:55',
        },
        {
          id: 3,
          user: 'other',
          text:
            '可以選擇要72小時前pcr+24小時快篩，或是24小時pcr，一個5000元，一個7000元。',
          time: '10:13',
        },
        {
          id: 4,
          user: 'other',
          text: '可是好像台灣的快篩沒辦法提供英文的，所以建議做24小時pcr',
          time: '10:13',
        },
        {
          id: 5,
          user: 'myself',
          text: '那我們要先預約嗎，確定幾號要飛的時候',
          time: '11:07',
        },
        {
          id: 6,
          user: 'other',
          text: '在桃園有一間是可以五個小時檢測結果就出來',
          time: '11:11',
        },
        {
          id: 7,
          user: 'myself',
          text:
            '我找到衛服部的文件，可是有受理24hr只有這幾家？桃園的是在哪裏呀～',
          time: '11:23',
        },
      ],
    }
  },
  methods: {
    addMessage(e) {
      if (e.key === 'Enter' && this.message) {
        var today = new Date()
        var currentTime = today.getHours() + ':' + today.getMinutes()
        var newMessage = {
          user: 'myself',
          text: this.message,
          time: currentTime,
        }
        this.messages.push(newMessage)
        this.message = ''
      }
    },
    // setMessageRef(el) {
    //   console.log(el.id)
    // }
  },
}
</script>

<style>
.messagesWrapper {
  max-height: 90%;
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
  min-width: 60px;
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
