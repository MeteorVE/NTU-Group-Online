<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10"
        ><div class="grid-content bg-purple">
          <div class="room-header">
            <h1 class="title">{{ room.title }}</h1>
            <h5>開房者: {{ room.organizer ? room.organizer.name : '' }}</h5>
            <h5>分類: {{ room.room_category }}</h5>
            <h5>
              限制人數:
              {{ room.room_type == 'lesson' ? '無限制' : room.people_limit }}
            </h5>
          </div>

          <h2>房間簡介</h2>
          <p>{{ room.introduction }}</p>
        </div></el-col
      >
      <el-col :span="10"
        ><div class="grid-content bg-purple">
          chatting area，也許要用 component 做
        </div></el-col
      >
      <el-col :span="4"
        ><div class="grid-content bg-purple">成員們</div></el-col
      >
    </el-row>
  </div>
</template>

<script>
import RoomService from '@/services/RoomService.js'

export default {
  props: ['id'],
  data() {
    return {
      room: {
        id: 0,
        title: 'Room',
        introduction: 'Default',
        create_time: '2021-05-13T20:33:33.033448+08:00',
        valid_time: null,
        room_type: 'private',
        room_category: 'course',
        people_limit: 1,
      },
    }
  },
  created() {
    RoomService.getRoom(this.id)
      .then((response) => {
        this.room = response.data
        console.log(this.room)
      })
      .catch((error) => {
        console.log('There was an error:', JSON.stringify(error.response))
      })
  },
}
</script>
<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 500px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
