<template>
  <el-card :body-style="{ padding: '0px' }" class="card">
    <div class="image">
      <img :src="images[room.id % 4]" width="150" />
      <h4>{{ room.title }}</h4>
    </div>
    <div class="info">
      <div style="text-align: left; margin-left: 40px">
        <p>
          crate time：{{ room.create_time.slice(0, 10) }}
          {{ room.create_time.slice(11, 19) }}
        </p>
        <p>
          valid time：{{ room.valid_time.slice(0, 10) }}
          {{ room.valid_time.slice(11, 19) }}
        </p>
        <p>room type：{{ room.room_type }}</p>
        <p>room category：{{ room.room_category }}</p>
        <p>people limit:{{ room.people_limit }}</p>
        <p>
          introduction：
          <el-button type="text" @click="moreIntro">more</el-button>
        </p>
      </div>
    </div>
  </el-card>
</template>

<script>
// import UserService from '@/services/UserService.js'
import RoomService from '@/services/RoomService.js'

export default {
  props: {
    room: Object,
  },
  data() {
    return {
      images: [
        'https://i.imgur.com/kN4J0UL.jpg',
        '',
        'https://i.imgur.com/17SSeJb.png',
        'https://i.imgur.com/85zF3RK.jpg',
        'https://i.imgur.com/o2uS5WX.png',
        'https://i.imgur.com/wc0HqRT.png',
        'https://i.imgur.com/qdIZSWc.jpg',
        'https://i.imgur.com/GOaM9dB.jpg',
        'https://i.imgur.com/G65qPbl.jpg',
        'https://i.imgur.com/WxiJ6K0.jpg',
      ],

      host: '',
    }
  },

  methods: {
    getMemberList() {
      return RoomService.getRoomMemberList(this.id)
    },

    moreIntro() {
      this.$alert(this.room.introduction, this.room.title, {
        confirmButtonText: 'OK',
      })
      // this.room.introduction
    },
  },
}
</script>

<style scoped>
.image {
  vertical-align: middle;
  float: left;
  width: 20%;
}

.info {
  float: right;
  width: 80%;
}

.el-card h4 {
  margin: 10px;
}

.card {
  height: 250px;
  background-color: rgb(185, 182, 177);
}
</style>
