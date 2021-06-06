<template>
  <div class="home">
    <!-- <RoomCard v-for="room in rooms" :key="room.id" :room="room" /> -->
    <el-container>
      <el-aside width="160px"
        ><SideBar
          v-on:applyFilter="updateFilter($event)"
          :sideBarList="
            category.map((c) => ({
              text: c,
              url: '',
              urlMode: false,
            }))
          "
      /></el-aside>
      <el-main id="roomCardContainer">
        <div
          v-masonry
          transition-duration="0.2s"
          item-selector=".item"
          column-width=".item"
          class="rooms-container"
          v-if="filteredRooms.length > 0"
        >
          <div
            v-masonry-tile
            class="item"
            v-for="(room, index) in filteredRooms"
            v-bind:key="index"
          >
            <RoomCard
              :room="room"
              :typeDict="roomTypeDict"
              @update="updateClickedRoom"
            />
          </div>
        </div>
        <div v-else><el-empty description="找不到相關結果"></el-empty></div>
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
      <el-form :model="dialogFormRoom" label-position="left">
        <el-form-item label="房間名稱" :label-width="formLabelWidth">
          <el-form-item :label="dialogFormRoom.title"></el-form-item>
        </el-form-item>
        <el-form-item label="房間 Type" :label-width="formLabelWidth">
          <el-tag type="info">{{ dialogFormRoom.room_type }}</el-tag>
          <!-- <el-form-item :label="dialogFormRoom.room_type"></el-form-item> -->
        </el-form-item>
        <el-form-item label="房間 Category" :label-width="formLabelWidth">
          <el-tag type="success" style="text-align: left">{{
            dialogFormRoom.room_category
          }}</el-tag>
          <!-- <el-form-item :label="dialogFormRoom.room_category"></el-form-item> -->
        </el-form-item>
        <el-form-item label="簡介" :label-width="formLabelWidth" class="desc">
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
      userRooms: [],
      dialogFormVisible: false,
      dialogFormRoom: '',
      formLabelWidth: '120px',
      nickname: '',
      roomTypeDict: [],
      category: [
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
    filteredRooms: function () {
      if (this.$store.state.filter) {
        // console.log(this.$store.state.filter)
        return this.rooms.filter(
          (room) =>
            room.room_category.includes(this.$store.state.filter) ||
            room.introduction.includes(this.$store.state.filter) ||
            room.title.includes(this.$store.state.filter)
        )
      }
      return this.rooms
    },
  },
  created() {
    if (this.$store.state.token && !this.$store.state.is_verify) {
      this.$store.dispatch('getIsVerify').then(() => {
        if (this.$store.state.is_verify == false) {
          this.$router.push({
            name: 'profile',
          })
          this.$message.error('未過 mail 認證 !')
        }
      })
    }

    if (this.$store.state.token) {
      this.$store
        .dispatch('refreshToken')
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

          RoomService.getUserRooms()
            .then((res) => {
              this.userRooms = res.data
            })
            .catch((err) => {
              console.log(err)
            })
          this.$emit('wsConnStart', true)
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
    updateFilter(category) {
      this.filter = category
    },
    updateClickedRoom(dic) {
      let uRoomsId = this.userRooms.map((r) => r.id)
      if (uRoomsId.includes(dic['clickedRoomId'])) {
        this.$router.push({
          name: 'room-show',
          params: { id: dic['clickedRoomId'] },
        })
      } else {
        this.dialogFormVisible = dic['dialogFormVisible']
        this.dialogFormRoom = dic['dialogFormRoom']
      }
    },
  },
}
</script>
<style scoped>
.item {
  width: 25%;
}
.el-form-item > label {
  line-height: 2px;
}

.desc {
  line-height: 2px;
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
