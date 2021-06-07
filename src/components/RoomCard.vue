<template>
  <el-card :body-style="{ padding: '0px' }">
    <img
      :src="room.image_url"
      class="image"
      @error="imageLoadFailed = true"
      v-if="!imageLoadFailed"
    />
    <el-skeleton v-if="imageLoadFailed">
      <template #template>
        <el-skeleton-item variant="image" style="height: 150px" />
      </template>
    </el-skeleton>
    <h4>{{ room.title }}</h4>
    <div>
      <p>分類 :</p>
      <el-tag type="success">{{ room.room_category }}</el-tag>
      <el-tag type="info">{{ typeDict[room.room_type] }}</el-tag>
    </div>
    <div>
      <p>人數限制 : {{ room.people_limit }}</p>
      <p>簡介 : {{ introduction }}</p>
      <div style="text-align: center">
        <el-button type="text" @click="emitParent">進入房間</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    room: Object,
    typeDict: Object,
  },
  computed: {
    introduction: function () {
      if (this.room.introduction.length > 30) {
        return this.room.introduction.slice(0, 30) + '...'
      }
      return this.room.introduction
    },
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
      // dialogFormRoom: '',
      dialogFormVisible: false,
      imageLoadFailed: false,
    }
  },
  methods: {
    emitParent() {
      this.$emit('update', {
        dialogFormRoom: this.room,
        dialogFormVisible: true,
        clickedRoomId: this.room.id,
      })
    },
  },
  watch: {
    dialogFormRoom: {
      handler(val) {
        this.$emit('update', { dialogFormRoom: val, dialogFormVisible: true })
        this.dialogFormRoom = ''
      },
    },
  },
}
</script>

<style scoped>
/* .rooms-container {
  display: flex;
} */

.image {
  /* max-width: 50%; */
  max-width: 100%;
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
