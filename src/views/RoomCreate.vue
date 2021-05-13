<template>
  <div>
    <h1>Create an Room</h1>
    <form @submit.prevent="createEvent">
      <label>Select a department</label>
      <select v-model="room.category">
        <option v-for="dep in department" :key="dep">{{ dep }}</option>
      </select>
      <select v-model="room.type">
        <option v-for="rt in roomType" :key="rt">{{ rt }}</option>
      </select>

      <h3>Name & describe your room</h3>
      <div class="field">
        <label>Title</label>
        <input
          v-model="room.title"
          type="text"
          placeholder="Add an room title"
        />
      </div>

      <div class="field">
        <label>Description</label>
        <input
          v-model="room.description"
          type="text"
          placeholder="Add a description"
        />
      </div>

      <input type="submit" class="button -fill-gradient" value="Submit" />
    </form>
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
      room: this.createFreshRoomObject(),
    }
  },
  methods: {
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
