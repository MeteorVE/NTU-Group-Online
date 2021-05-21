<template>
  <div class="home">
    <!-- <RoomCard v-for="room in rooms" :key="room.id" :room="room" /> -->
    <el-card v-for="room in rooms" :key="room.id" class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ room.title }}</span>
          <el-button class="button" type="text"
            ><router-link :to="{ name: 'room-show', params: { id: room.id } }"
              >進入
            </router-link></el-button
          >
        </div>
      </template>
      <div class="text item">created by @{{ room.organizer }}</div>
      <div class="text item">{{ room.people_limit }}</div>
      <div class="text item">{{ room.introduction }}</div>
    </el-card>
  </div>
</template>

<script>
// @ is an alias to /src
// import RoomCard from '@/components/RoomCard.vue'
import RoomService from '@/services/RoomService.js'
import { ElMessage } from 'element-plus'
import { mapGetters } from 'vuex'

export default {
  //name: 'RoomList',
  components: {
    //RoomCard,
  },
  data() {
    return {
      rooms: [],
    }
  },
  computed: {
    ...mapGetters(['isAuth']),
  },
  created() {
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
        })
        .then(() => {
          RoomService.getRooms()
            .then((response) => {
              this.rooms = response.data
            })
            .catch((error) => {
              console.log(
                '[Home.vue] error: created(), RoomService.getRooms():',
                '\n理論上這邊不會再有錯誤了，注意一下\n',
                error.response
              )
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
      ElMessage.error('請登入 !')
      // window.location.href = '/login'
      this.$router.push({
        name: 'login',
      })
    }
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
.card-header {
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
}
</style>
