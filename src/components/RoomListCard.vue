<template>
  <el-card :body-style="{ padding: '0px' }" class="card">
    <div class="image">
      <img :src="images[room.id % 4]" width="150" />
      <h4>{{ room.title }}</h4>
    </div>
    <div class="info">
      <div style="text-align: left; margin-left: 40px">
        <p>
          <!-- crate time：{{ room.create_time.slice(0, 10) }}
          {{ room.create_time.slice(11, 19) }} -->
          crate time：{{ room.create_time.slice(0, 10) }}
          {{ room.create_time.slice(11, 19) }}
        </p>
        <p>
          <!-- valid time：{{ room.valid_time.slice(0, 10) }}
          {{ room.valid_time.slice(11, 19) }} -->
          valid time：{{ room.valid_time.slice(0, 10) }}
          {{ room.valid_time.slice(11, 19) }}
        </p>
        <p>room type：{{ room.room_type }}</p>
        <p>room category：{{ room.room_category }}</p>
        <p>people limit:{{ room.people_limit }}</p>
        <p>
          introduction：
          <el-button type="text" @click="moreIntro">more</el-button>

          <el-button
            type="success"
            class="roomcardbtn1"
            @click="acceptinvite"
            v-show="invited_rooms_btn"
            >接受邀請</el-button
          >
          <!-- <el-button type="success" class="roomcardbtn2" @click="emitParent">接受邀請並進入</el-button> -->
          <el-button
            type="danger"
            class="roomcardbtn3"
            @click="rejectinvite"
            v-show="invited_rooms_btn"
            >拒絕邀請</el-button
          >
        </p>
      </div>
    </div>
  </el-card>
</template>

<script>
import UserService from '@/services/UserService.js'
import RoomService from '@/services/RoomService.js'

export default {
  props: {
    room: Object,
    invited_rooms_btn: Object,
    user_nickname: Object,
    invit_id: Object,
  },
  data() {
    return {
      images: [
        'https://i.imgur.com/kN4J0UL.jpg',
        '',
        'https://i.imgur.com/17SSeJb.png',
        'https://i.imgur.com/85zF3RK.jpg',
        'https://i.imgur.com/o2uS5WX.png',
        'https://i.imgur.com/wc0HqRT.png',
        'https://i.imgur.com/qdIZSWc.jpg',
        'https://i.imgur.com/GOaM9dB.jpg',
        'https://i.imgur.com/G65qPbl.jpg',
        'https://i.imgur.com/WxiJ6K0.jpg',
      ],

      host: '',
      dialogFormVisible: false,
    }
  },

  methods: {
    emitParent() {
      console.log('111111'),
        this.$emit('update', {
          dialogFormRoom: this.room,
          dialogFormVisible: true,
          clickedRoomId: this.room.id,
        })
    },

    getMemberList() {
      return RoomService.getRoomMemberList(this.id)
    },

    moreIntro() {
      this.$alert(this.room.introduction, this.room.title, {
        confirmButtonText: 'OK',
      })
      // this.room.introduction
    },

    acceptinvite() {
      console.log('uuuuuuuuu', this.user_nickname)
      console.log('uuuuuuuuu', this.invit_id)
      console.log('accept')
      UserService.postAcceptInvite(this.invit_id, this.user_nickname)
    },

    rejectinvite() {
      console.log('reject')
      UserService.deleteRejectInvite(this.invit_id)
      // return UserService.deleteRejectInvite(this.room.id)
    },
  },

  watch: {
    dialogFormRoom: {
      handler(val) {
        this.$emit('update', { dialogFormRoom: val, dialogFormVisible: true })
        this.dialogFormRoom = ''
      },
    },
  },
}
</script>

<style scoped>
.image {
  vertical-align: middle;
  float: left;
  width: 20%;
}

.info {
  float: right;
  width: 80%;
}

.el-card h4 {
  margin: 10px;
}

.card {
  height: 250px;
  background-color: rgb(185, 182, 177);
}

.info .roomcardbtn1 {
  /* text-align: right; */
  margin-left: 300px;
  /* margin-right: 10px; */
}

.info .roomcardbtn2 {
  /* text-align: right; */
  margin-left: 50px;
  /* margin-left: 50px; */
}

.info .roomcardbtn3 {
  /* text-align: right; */
  margin-left: 50px;
  /* margin-right: 50px; */
}
</style>
