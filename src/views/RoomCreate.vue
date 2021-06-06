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
        <el-form-item prop="title" label="房間標題" :rules="notNullrule">
          <el-input
            v-model="room.title"
            placeholder="請填入房間標題"
          ></el-input>
        </el-form-item>
        <el-form-item label="您的暱稱" prop="nickname" :rules="notNullrule">
          <el-input v-model="room.nickname" placeholder="請填入暱稱"></el-input>
        </el-form-item>
        <el-form-item label="房間分類" prop="category" :rules="notNullrule">
          <el-select v-model="room.category" placeholder="choose category">
            <el-option
              v-for="(item, key) in categoryDict"
              :label="item"
              :key="item"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="關房時間">
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
        <!-- <el-form-item label="允許邀請">
          <el-switch v-model="room.invite"></el-switch>
        </el-form-item> 
        <el-form-item label="Tag">
          <el-checkbox-group v-model="room.tag">
            <el-checkbox label="吃" name="type"></el-checkbox>
            <el-checkbox label="衣服" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
        <el-form-item label="房間類型">
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
        <el-form-item prop="description" :rules="notNullrule">
          <template #label>
            <span>簡介</span>
          </template>
          <el-input
            type="textarea"
            placeholder="Enter description of your room:"
            v-model="room.description"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="封面照片">
          <el-input
            v-model="room.image"
            placeholder="可放可不放，建議上傳 imgur 並複製圖片網址(.jpg 或 .png 結尾)"
          ></el-input>
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
      notNullrule: { required: true, message: '不能為空', trigger: 'blur' },
      room: {
        title: '',
        nickname: '我是房主',
        capacity: 10,
        category: '',
        date1: new Date(),
        date2: new Date(new Date().setHours(23, 59, 59)),
        invite: false,
        tag: [],
        type: 'public',
        description: '',
        image: '',
      },
    }
  },
  created() {
    if (!this.$store.state.token) {
      console.log('plz login !')
      this.$router.push({
        name: 'login',
      })
    }
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
  },
  methods: {
    hardcreateRoom() {
      if (this.$store.state.token) {
        this.$store
          .dispatch('refreshToken')
          .then((resRefresh) => {
            console.log('resRefresh token:', resRefresh.data)
            this.loading = true
            return RoomService.postRoom(this.room)
          })
          .then((res) => {
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
            console.log('res in CreateRoom:', res)
            this.$message.success(res.statusText)
            this.loading = false
            this.$router.push({
              name: 'room-show',
              params: { id: res.data.id },
            })
          })
          .catch((err) => {
            console.log('err in CreateRoom:', err.data, Object.keys(err.data))
            for (let [key, val] of Object.entries(err.data)) {
              this.$message.error(key + ': ' + val[0])
            }
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
