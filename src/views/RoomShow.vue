<template>
  <div>
    <div class="room-header">
      <h1 class="title">{{ room.title }}</h1>
      <h5>Organized by {{ room.organizer ? room.organizer.name : '' }}</h5>
      <h5>Category: {{ room.category }}</h5>
    </div>

    <address>{{ room.location }}</address>

    <h2>room details</h2>
    <p>{{ room.description }}</p>
  </div>
</template>

<script>
import RoomService from '@/services/RoomService.js'
export default {
  props: ['id'],
  data() {
    return {
      room: {},
    }
  },
  created() {
    RoomService.getRoom(this.id)
      .then((response) => {
        this.room = response.data
      })
      .catch((error) => {
        console.log('There was an error:', error.response)
      })
  },
}
</script>
