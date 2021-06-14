<template>
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
          <RoomListCard :room="room" @update="updateRooms" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import RoomListCard from '@/components/RoomListCard.vue'
import UserService from '@/services/UserService.js'
// import { ElMessage } from 'element-plus'

export default {
  // components: {
  //   RoomListCard,
  // },

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
  methods: {
    updateRooms(dic) {
      console.log('update 觸發')

      console.log(dic)

      this.rooms = dic['rooms']
    },
  },
}
</script>

<style scoped>
/* .item {
  width: 100%;
} */
</style>
