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
          <el-input
            v-model="room.roomOwnerNickname"
            placeholder="請填入暱稱"
          ></el-input>
        </el-form-item>
        <el-form-item label="Category">
          <el-select v-model="room.category" placeholder="choose category">
            <el-option
              v-for="dep in categoryList"
              :label="dep"
              :key="dep"
              :value="dep"
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
            <el-radio label="Public"></el-radio>
            <el-radio label="Private"></el-radio>
            <el-radio label="Lession"></el-radio>
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
          <el-button type="primary" @click="createRoom">Create Room</el-button>
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
import { ElMessage } from 'element-plus'

export default {
  components: null,
  data() {
    const categoryList = ['閒聊', '糾吃飯']
    const roomType = ['public', 'private', 'lesson']
    return {
      categoryList,
      roomType,
      room: {
        title: '',
        roomOwnerNickname: '我是房主',
        capacity: 10,
        category: '',
        date1: '',
        date2: '',
        invite: false,
        tag: [],
        type: 'Public',
        description: '',
      },
    }
  },
  created() {},
  methods: {
    createRoom() {
      if (this.$store.state.token) {
        this.$store
          .dispatch('refreshToken', this.event)
          .then((resRefresh) => {
            console.log(resRefresh)
            'status' in resRefresh &&
              console.log(
                '[RoomCreate.vue.createRoom.then] refreshToken then：' +
                  '\nstatus code: ' +
                  resRefresh.status +
                  '\naccess token: ' +
                  JSON.stringify(resRefresh.data.access)
                // 通常到這邊是有正確拿到 token
              )
          })
          .then(() => {
            RoomService.postRoom(this.room)
              .then((response) => {
                console.log(JSON.stringify(response))
                // 說實話我還不知道這會是啥，不過應該會是 200+room.data
              })
              .catch((error) => {
                console.log(
                  '[RoomCreate.vue] error: createRoom(), RoomService.postRoom():',
                  JSON.stringify(error)
                )
                ElMessage.error(error.response)
              })
          })
          .catch((err) => {
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
            }
            this.$router.push({
              name: 'login',
            })
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
