<template>
  <!-- id, title, introduction, create_time, valid_time, room_type, room_category,
  people_limit -->

  <div>
    <el-container class="create-form">
      <el-form ref="form" :model="room" label-width="80px">
        <h1>Create an Room</h1>
        <el-form-item label="Title">
          <el-input v-model="room.title"></el-input>
        </el-form-item>
        <el-form-item label="Department">
          <el-select v-model="room.department" placeholder="choose department">
            <el-option
              v-for="dep in department"
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
        <el-form-item label="最大人數">
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
          <el-button type="primary" @click="createEvent">Create Room</el-button>
          <!-- @submit.prevent="createEvent" -->
          <el-button>Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-container>
  </div>
</template>

<script>
export default {
  components: null,
  data() {
    const department = ['CSIE', 'EE']
    const roomType = ['public', 'private', 'lesson']
    return {
      department,
      roomType,
      //categories: this.$store.state.categories,
      old_room: this.createFreshRoomObject(),
      room: {
        organizer: '',
        capacity: '',
        title: '',
        region: '',
        date1: '',
        date2: '',
        invite: false,
        tag: [],
        type: '',
        description: '',
      },
    }
  },
  created() {
    this.checkAuth()
  },
  methods: {
    checkAuth() {
      this.$store.state.token &&
        this.$store
          .dispatch('verifyToken', this.event)
          .then((resVerify) => {
            console.log('verifyToken Result：' + resVerify)
            return this.init()
          })
          .catch((err) => {
            console.log('[RoomCreate.vue]', err)
            window.location.href = '/login'
          })
    },
    init() {
      console.log('exec init')
    },
    createEvent() {
      this.$store
        .dispatch('createEvent', this.event)
        .then(() => {
          this.$router.push({
            name: 'event-show',
            params: { id: this.event.id },
          })
          this.event = this.createFreshEventObject()
        })
        .catch(() => {
          console.log('There was a problem creating your event')
        })
    },
    createFreshRoomObject() {
      const user = this.$store.state.user
      const id = Math.floor(Math.random() * 10000000)

      return {
        id: id,
        user: user,
        department: '',
        organizer: user, // owner
        title: '',
        description: '',
        capacity: 10,
        type: 'public',
      }
    },
  },
}
</script>
<style scoped>
.create-form {
  justify-content: center;
}
</style>
