<template>
  <!-- id, title, introduction, create_time, valid_time, room_type, room_category,
  people_limit -->

  <div>
    <el-container class="create-form">
      <el-form ref="form" :model="room" label-width="80px" @submit.prevent>
        <el-alert
          title="您尚未登入，登入後才能建立房間。"
          type="warning"
          show-icon
          v-if="!isAuth"
        >
          <el-link href="/login" type="primary">點我登入</el-link>
        </el-alert>
        <h1>Create an Room</h1>
        <el-form-item label="Title">
          <el-input
            v-model="room.title"
            placeholder="請填入房間標題"
          ></el-input>
        </el-form-item>
        <el-form-item label="NickName">
          <el-input v-model="room.nickname" placeholder="請填入暱稱"></el-input>
        </el-form-item>
        <el-form-item label="Category">
          <el-select v-model="room.category" placeholder="choose category">
            <el-option
              v-for="(item, key) in categoryDict"
              :label="item"
              :key="item"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="End Time">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="Choose Date"
              v-model="room.date1"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker
              placeholder="Choose Time"
              v-model="room.date2"
              style="width: 100%"
            ></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="允許邀請">
          <el-switch v-model="room.invite"></el-switch>
        </el-form-item>
        <el-form-item label="Tag">
          <el-checkbox-group v-model="room.tag">
            <el-checkbox label="吃" name="type"></el-checkbox>
            <el-checkbox label="衣服" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Type">
          <el-radio-group v-model="room.type">
            <el-radio
              v-for="(item, key) in roomTypeDict"
              :label="key"
              :key="key"
            >
              {{ item }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最大人數" @submit.prevent>
          <el-slider v-model="room.capacity" show-input :max="100" :step="5">
          </el-slider>
        </el-form-item>
        <el-form-item label="Description">
          <el-input
            type="textarea"
            placeholder="Enter description of your room:"
            v-model="room.description"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createRoom" :loading="loading"
            >Create Room</el-button
          >
          <!-- @submit.prevent="createEvent" -->
          <el-button>Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-container>
  </div>
</template>

<script>
import RoomService from '@/services/RoomService.js'
import { mapGetters } from 'vuex'
// import { ElMessage } from 'element-plus'

export default {
  components: null,
  data() {
    const categoryDict = { course: '課程討論', find_group: '尋求組隊' }
    const roomTypeDict = {
      public: '公開',
      private: '私人',
      lesson: '課程',
    }
    return {
      categoryDict,
      roomTypeDict,
      loading: false,
      room: {
        title: '',
        nickname: '我是房主',
        capacity: 10,
        category: '',
        date1: '',
        date2: '',
        invite: false,
        tag: [],
        type: 'public',
        description: '',
      },
    }
  },
  created() {},
  methods: {
    hardcreateRoom() {
      if (this.$store.state.token) {
        this.$store
          .dispatch('refreshToken')
          .then((resRefresh) => {
            'status' in resRefresh &&
              console.log(
                '[RoomCreate.vue.createRoom.then] refreshToken then：' +
                  '\nstatus code: ' +
                  resRefresh.status +
                  '\naccess token: ' +
                  JSON.stringify(resRefresh.data.access)
                // 通常到這邊是有正確拿到 token
              )
            this.loading = true
            return RoomService.postRoom(this.room)
          })
          .then((res) => {
            console.log('WTF')

            if (res.status == 201) {
              console.log(res.statusText)
            }
            this.$message.success(res.statusText)
            this.loading = false
          })
          .catch((err) => {
            console.log('[Warning ! 401 401 401 !]')

            this.loading = false
            console.log(
              '[RoomCreate.vue.created.catch], token exist but:',
              '\nstatus code: ',
              err.response.status,
              '\nerror message: ',
              JSON.stringify(err.response.data)
            )
            if (
              'code' in err.response.data &&
              err.response.data['code'] == 'token_not_valid'
            ) {
              console.log('[RoomCreate.vue.createRoom.catch] delete token')
              this.$store.dispatch('resetToken')
              this.$router.push({
                name: 'login',
              })
            }
            this.$message.error(JSON.stringify(err.response.data))
          })
      } else {
        console.log('plz login !')
        // window.location.href = '/login'
        this.$router.push({
          name: 'login',
        })
      }

      // this.$store
      //   .dispatch('createEvent', this.event)
      //   .then(() => {
      //     this.$router.push({
      //       name: 'event-show',
      //       params: { id: this.event.id },
      //     })
      //     this.event = this.createFreshEventObject()
      //   })
      //   .catch(() => {
      //     console.log('There was a problem creating your event')
      //   })
    },
    createRoom() {
      if (this.$store.state.token) {
        return this.$store
          .dispatch('refreshToken')
          .then((res) => {
            if (res.status != 200) {
              return Promise.reject('refresh token err')
            }
            this.loading = true
            return RoomService.postRoom(this.room)
          })
          .then((res) => {
            console.log('res in light CreateRoom:', res)
            this.$message.success(res.statusText)
            this.loading = false
          })
          .catch((err) => {
            console.log('err in light CreateRoom:', err)
            this.loading = false
          })
      } else {
        console.log('plz login !')
        this.$router.push({
          name: 'login',
        })
      }
    },
  },
  computed: {
    ...mapGetters(['isAuth']),
  },
}
</script>
<style scoped>
.create-form {
  justify-content: center;
}
</style>
