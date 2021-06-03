<template>
  <div class="home">
    <!-- <RoomCard v-for="room in rooms" :key="room.id" :room="room" /> -->
    <el-container>
      <el-aside width="160px"><SideBar :sideBarList="sideBarList" /></el-aside>
      <el-main id="roomCardContainer" v-if="rooms.length > 0">
        <div
          v-masonry="roomCardContainer"
          transition-duration="0.2s"
          item-selector=".item"
          column-width=".item"
          class="rooms-container"
        >
          <div
            v-masonry-tile
            class="item"
            v-for="(room, index) in rooms"
            v-bind:key="index"
          >
            <RoomCard :room="room" :typeDict="roomTypeDict" />
          </div>
        </div>
      </el-main>
    </el-container>

    <!-- <el-card v-for="room in rooms" :key="room.id" class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ room.title }}</span>
          <el-button class="button" type="text"
            ><router-link :to="{ name: 'room-show', params: { id: room.id } }"
              >進入
            </router-link></el-button
          >
          <el-button
            type="text"
            @click=";(dialogFormRoom = room) + (dialogFormVisible = true)"
            >點我填表單</el-button
          >
        </div>
      </template>
      <div class="text item">created by @{{ room.organizer }}</div>
      <div class="text item">{{ room.people_limit }}</div>
      <div class="text item">{{ room.introduction }}</div>
    </el-card> -->
    <el-dialog title="加入房間" v-model="dialogFormVisible">
      <el-form :model="dialogFormRoom">
        <el-form-item label="房間名稱" :label-width="formLabelWidth">
          <el-form-item :label="dialogFormRoom.title"></el-form-item>
        </el-form-item>
        <el-form-item label="房間 Type" :label-width="formLabelWidth">
          <el-form-item :label="dialogFormRoom.room_type"></el-form-item>
        </el-form-item>
        <el-form-item label="房間 Category" :label-width="formLabelWidth">
          <el-form-item :label="dialogFormRoom.room_category"></el-form-item>
        </el-form-item>
        <el-form-item label="簡介" :label-width="formLabelWidth">
          <el-form-item :label="dialogFormRoom.introduction"></el-form-item>
        </el-form-item>
        <el-form-item label="最大人數" :label-width="formLabelWidth">
          <el-form-item
            :label="dialogFormRoom.people_limit.toString()"
          ></el-form-item>
        </el-form-item>
        <el-form-item label="您的暱稱" :label-width="formLabelWidth">
          <el-input
            v-model="nickname"
            autocomplete="off"
            clearable
            placeholder="請輸入暱稱"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="joinRoom">送出</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import RoomCard from '@/components/RoomCard.vue'
import SideBar from '@/components/SideBar.vue'
import RoomService from '@/services/RoomService.js'
// import { ElMessage } from 'element-plus'
import { mapGetters } from 'vuex'

export default {
  //name: 'RoomList',
  components: {
    RoomCard,
    SideBar,
  },
  data() {
    return {
      rooms: [],
      dialogFormVisible: false,
      dialogFormRoom: '',
      formLabelWidth: '120px',
      nickname: '',
      roomTypeDict: [],
      sideBarList: [
        '吃飯',
        '團購',
        '遊戲',
        '聊天',
        '共乘',
        '交易',
        '分組',
        '出遊',
      ],
    }
  },
  computed: {
    ...mapGetters(['isAuth']),
  },
  created() {
    if (this.$store.state.token) {
      this.$store
        .dispatch('refreshToken')
        .then((resRefresh) => {
          console.log('resRefresh:', resRefresh)
          return resRefresh
        })
        .then((response) => {
          console.log('token:', response.data, '\nstart to get some list:')

          RoomService.getRooms()
            .then((res) => {
              this.rooms = res.data
            })
            .catch((err) => {
              console.log('getRooms err :', err)
            })

          RoomService.getRoomCategory()
            .then((res) => {
              this.sideBarList = Object.values(res.data)
            })
            .catch((err) => {
              console.log('getRoomCategory err :', err)
            })

          RoomService.getRoomType()
            .then((res) => {
              this.roomTypeDict = res.data
            })
            .catch((err) => {
              console.log('getRoomType err :', err)
            })
        })
        .catch((err) => {
          console.log(
            '[Home.vue.created.catch], token exist but:',
            '\nstatus code: ',
            err.response.status,
            '\nerror message: ',
            JSON.stringify(err.response.data)
          )
          if (
            'code' in err.response.data &&
            err.response.data['code'] == 'token_not_valid'
          ) {
            console.log('[Home.vue.created.catch] delete token')
            this.$store.dispatch('resetToken')
          }
          this.$router.push({
            name: 'login',
          })
        })
    } else {
      console.log('plz login !')
      this.$message.error('請登入 !')
      this.$router.push({
        name: 'login',
      })
    }
  },
  methods: {
    joinRoom() {
      console.log('exec join room')

      if (this.$store.state.token) {
        this.$store
          .dispatch('refreshToken', this.event)
          .then((resRefresh) => {
            console.log(resRefresh)
            'status' in resRefresh &&
              console.log(
                '[Home.vue.created.then] refreshToken then：' +
                  '\nstatus code: ' +
                  resRefresh.status +
                  '\naccess token: ' +
                  JSON.stringify(resRefresh.data.access)
              )
            return RoomService.postJoinRoom(
              this.dialogFormRoom.id,
              this.nickname
            )
          })
          .then((res) => {
            console.log('join success:', res.data)
            this.$router.push({
              name: 'room-show',
              params: { id: this.dialogFormRoom.id },
            })
          })
          .catch((err) => {
            var errMsg = err.response.data['error']
            if (errMsg == 'You are already in the room.') {
              this.$router.push({
                name: 'room-show',
                params: { id: this.dialogFormRoom.id },
              })
            }
            console.log(err.response.data['error'])
          })
      }
    },
  },
}
/*
enter homepage test case:
1. no token in state and localStorage
  - go to login
2. no token in state but in localStorage
  - state get localStorage info, and refresh, go to refresh testcase
3. both token in state and localStorage
  - refresh, go to refresh testcase

refresh test case:
1. Refresh Token is invalid or expired
  - error, should go to login page
    - it will log at .catch()
  - {"detail":"Token is invalid or expired","code":"token_not_valid"}
2. though token in localStorage but refresh_token miss
  - backend: {"refresh":["This field may not be blank."]}
3. success

*/
</script>
<style scoped>
.item {
  width: 25%;
}
/* .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 300px;
}

a {
  color: #05acdf;
  text-decoration: none;
} */
</style>
