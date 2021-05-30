<template>
  <el-container>
    <el-aside class="SideBarContainer"
      ><SideBar :sideBarList="userRooms"
    /></el-aside>
    <el-main class="chatRoomWrapper"><ChatRoom /></el-main>
    <el-aside class="room-info">
      <h5 class="title">徵室友</h5>
      <el-divider></el-divider>
      <div>
        <h5>房主</h5>
        <p>XXX</p>
      </div>
      <el-divider></el-divider>
      <div>
        <h5>房間簡介</h5>
        <p>永和區中正路，公寓，每月六千五，房間坪數七坪，家具家電全</p>
      </div>
      <el-divider></el-divider>
      <div>
        <h5>分類</h5>
        <el-button size="mini" round>室友</el-button>
      </div>
      <!-- <el-divider></el-divider>
      <div>
        <h5>成員列表</h5>
        <div class="member" v-for="(o, i) in 10" :key="i">
          <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
          <p class="username">使用者{{ o }}</p>
        </div>
      </div> -->
      <el-divider></el-divider>
      <div>
        <h5>限制人數</h5>
        <p>10</p>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import RoomService from '@/services/RoomService.js'
import SideBar from '@/components/SideBar.vue'
import ChatRoom from '@/components/ChatRoom.vue'

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
      userRooms: ['徵室友', '找山友', '吃鬆餅', '搭車回高雄'],
    }
  },
  components: {
    SideBar,
    ChatRoom,
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
.el-container /deep/ .el-main {
  padding: 0 1%;
}
.chatRoomWrapper {
  max-height: 88vh;
}
.SideBarContainer {
  width: 160px !important;
}
.room-info {
  text-align: left;
  width: 200px !important;
}
.room-info p {
  font-size: 12px;
  margin: 0;
}
.member {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.username {
  padding-left: 10px;
}
</style>
