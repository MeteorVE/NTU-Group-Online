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
  created() {
    RoomService.getRooms()
      .then((response) => {
        this.rooms = response.data
      })
      .catch((error) => {
        console.log('[Home.vue] error: created():', error.response)
      })
  },
}
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
