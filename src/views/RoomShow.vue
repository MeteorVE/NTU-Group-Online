<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <div class="buttons">
            <el-button type="danger">退出房間</el-button>
          </div>
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
        </div>
      </el-col>
      <el-col :span="10"
        ><div class="grid-content bg-purple">
          chatting area，也許要用 component 做
        </div></el-col
      >
      <el-col :span="4"
        ><div class="grid-content bg-purple">成員們</div></el-col
      >
    </el-row>
    <el-dialog title="編輯房間" v-model="dialogFormVisible">
      <el-form :model="dialogFormRoom">
        <el-form-item label="房間名稱" :label-width="formLabelWidth">
          <el-form-item :label="dialogFormRoom.title"></el-form-item>
        </el-form-item>
        <el-form-item label="房間 Type" :label-width="formLabelWidth">
          <el-form-item :label="dialogFormRoom.room_type"></el-form-item>
        </el-form-item>
        <el-form-item label="房間 Category" :label-width="formLabelWidth">
          <el-form-item :label="dialogFormRoom.room_category"></el-form-item>
        </el-form-item>
        <el-form-item label="簡介" :label-width="formLabelWidth">
          <el-form-item :label="dialogFormRoom.introduction"></el-form-item>
        </el-form-item>
        <el-form-item label="最大人數" :label-width="formLabelWidth">
          <el-form-item
            :label="dialogFormRoom.people_limit.toString()"
          ></el-form-item>
        </el-form-item>
        <el-form-item label="您的暱稱" :label-width="formLabelWidth">
          <el-input
            v-model="nickname"
            autocomplete="off"
            clearable
            placeholder="請輸入暱稱"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="joinRoom">送出</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import RoomService from '@/services/RoomService.js'

export default {
  props: ['id'],
  data() {
    return {
      exist_btn_text: '離開房間',
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
    new Promise(() => {
      this.getUserObj()
        .then((res) => {
          this.room = res
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  },
  methods: {
    init() {
      console.log()
    },
    getRoomObj() {},
    getUserObj() {
      return new Promise((resolve, reject) => {
        RoomService.getRoom(this.id)
          .then((response) => {
            resolve(response.data)
            // this.room = response.data  // console.log(this.room)
          })
          .catch((error) => {
            reject(error.data) //  console.log('There was an error:', JSON.stringify(error.response))
          })
      })
    },
    getMemberList() {},
    getBlockList() {},
    getInvitationList() {},
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
