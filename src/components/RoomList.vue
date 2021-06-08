<template v-:fixed>
  <div class="userpage">
    <el-container>
      <router-view />

      <el-main id="roomCardContainer" v-if="rooms.length > 0">
        <div
          v-masonry="roomCardContainer"
          item-selector=".item"
          column-width=".item"
        >
          <div
            v-masonry-tile
            class="item"
            v-for="(room, index) in rooms"
            v-bind:key="index"
          >
            <RoomListCard :room="room" />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import RoomListCard from '@/components/RoomListCard.vue'
import UserService from '@/services/UserService.js'
import { ElMessage } from 'element-plus'

export default {
  components: {
    RoomListCard,
  },

  data() {
    return {
      rooms: [],
    }
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
          UserService.getUserRoom()
            .then((response) => {
              this.rooms = response.data
              console.log("aaaaaaaaa", response.data)
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
</script>

<style scoped>

.item {
  width: 100%;
}


</style>