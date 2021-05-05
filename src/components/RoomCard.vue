<template>
  <router-link :to="{ name: 'room-show', params: { id: room.id } }">
    <div class="room-card -shadow">
      <span class="owner">created by @{{ room.organizer }}</span>
      <h4 class="title">{{ room.title }}</h4>
      <span>{{ room.capacity }}</span>
      <p>{{ room.description }}</p>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    room: Object,
  },
}
</script>

<style scoped>
.room-card {
  padding: 20px;
  margin-bottom: 24px;
  transition: all 0.2s linear;
  cursor: pointer;
}
.room-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.room-card > .title {
  margin: 0;
}
.room-link {
  color: black;
  text-decoration: none;
  font-weight: 100;
}
</style>
