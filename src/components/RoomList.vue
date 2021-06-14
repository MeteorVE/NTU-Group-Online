<template v-:fixed>
  <div class="userpage">
    <el-container>
      <router-view />

      <el-main id="roomCardContainer" v-if="rooms.length > 0">
        <div
          v-masonry-tile
          class="item"
          v-for="(room, index) in rooms"
          v-bind:key="index"
        >
          <RoomListCard :room="room" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UserService from '@/services/UserService.js'

export default {


  data() {
    return {
      rooms: [],
    }
  },

  async created() {
    UserService.getUserRoom().then((response) => {
      this.rooms = response.data
    })
  },
}
</script>

<style scoped>
/* .item {
  width: 100%;
} */
</style>
