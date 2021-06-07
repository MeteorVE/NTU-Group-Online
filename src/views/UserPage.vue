<template>
  <!-- id, title, introduction, create_time, valid_time, room_type, room_category,
  people_limit -->

  <div>
    <h2>您的 User ID: {{ id }}</h2>
    <el-container class="create-form">
      <el-form ref="form" :model="room" label-width="80px">
        <h1>Create an Room</h1>
        <el-form-item label="Title">
          <el-input v-model="room.title"></el-input>
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
import { mapGetters } from 'vuex'
import RoomService from '@/services/RoomService.js'

export default {
  components: null,
  data() {
    return {
      //categories: this.$store.state.categories,
      //old_room: this.createFreshRoomObject(),
      room: {
        organizer: '1',
        capacity: 0,
        title: '2',
        region: '3',
        date1: '4',
        date2: '5',
        invite: false,
        tag: [],
        type: '6',
        description: '7',
      },
      id: '',
    }
  },
  created() {
    //this.checkAuth()
    RoomService.getUserId()
      .then((res) => {
        this.id = res.data.id
      })
      .catch((err) => {
        console.log('[err in user]', err)
      })
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

      return {
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
