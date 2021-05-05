<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <RoomCard v-for="room in rooms" :key="room.id" :room="room" />
  </div>
</template>

<script>
// @ is an alias to /src
import RoomCard from '@/components/RoomCard.vue'
import RoomService from '@/services/RoomService.js'

export default {
  //name: 'RoomList',
  components: {
    RoomCard,
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
        console.log(
          '[debug] There is an error occurred in Home.vue:',
          error.response
        )
      })
  },
}
</script>
