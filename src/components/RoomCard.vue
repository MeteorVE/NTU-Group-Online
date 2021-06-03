<template>
  <el-card :body-style="{ padding: '0px' }">
    <img :src="images[0]" class="image" />
    <h4>{{ room.title }}</h4>
    <div>
      <p>分類 :</p>
      <el-tag type="success">{{ room.room_category }}</el-tag>
      <el-tag type="info">{{ typeDict[room.room_type] }}</el-tag>
    </div>
    <div>
      <p>人數限制 : {{ room.people_limit }}</p>
      <p>簡介 : {{ room.introduction }}</p>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    room: Object,
    typeDict: Object,
  },
  data() {
    return {
      images: [
        'https://i.imgur.com/qdIZSWc.jpg',
        'https://i.imgur.com/GOaM9dB.jpg',
        'https://i.imgur.com/G65qPbl.jpg',
        'https://i.imgur.com/WxiJ6K0.jpg',
        'https://i.imgur.com/qdIZSWc.jpg',
      ],
    }
  },
}
</script>

<style scoped>
/* .rooms-container {
  display: flex;
} */

.image {
  max-width: 50%;
}
.el-card div p {
  margin: 6px;
  font-size: 14px;
  text-align: left;
  line-height: 120%;
}
.el-card h4 {
  margin: 10px;
}
/* .rooms-container {
  position: relative;
  left: 2%;
} */
</style>
