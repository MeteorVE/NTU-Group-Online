<template>
  <el-container class="mainContainer">
    <el-aside class="SideBarContainer"
      ><SideBar :sideBarList="userRooms"
    /></el-aside>
    <el-main class="chatRoomContainer">
      <ChatRoom />
    </el-main>
    <el-aside class="roomInfo">
      <el-scrollbar>
        <h5 class="title">{{ room.title }}</h5>
        <el-divider></el-divider>
        <div>
          <h5>房主</h5>
          <p>{{ host ? host : '' }}</p>
        </div>
        <el-divider></el-divider>
        <div>
          <h5>
            房間簡介<i
              class="el-icon-edit el-input__icon"
              @click="dialogFormVisible = true"
            ></i>
          </h5>
          <p>{{ room.introduction }}</p>
        </div>
        <el-divider></el-divider>
        <div>
          <h5>分類</h5>
          <el-button size="mini" round>{{ room.room_category }}</el-button>
        </div>
        <el-divider></el-divider>
        <div>
          <h5>
            成員列表<i
              class="el-icon-edit el-input__icon"
              @click="memberFormVisible = true"
            ></i>
          </h5>
          <div
            class="member"
            v-for="userObj in memberList"
            :key="userObj.member_id"
          >
            <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
            <p class="username">{{ userObj.nickname }}</p>
          </div>
        </div>
        <el-divider></el-divider>
        <div>
          <h5>
            限制人數
            <i class="el-icon-edit el-input__icon" @click="handleIconClick"></i>
          </h5>
          <p>{{ room.room_type == 'lesson' ? '無限制' : room.people_limit }}</p>
        </div>
        <el-divider></el-divider>
        <div>
          <h5>測試 input</h5>
          <el-input placeholder="请输入内容 " clearable>
            <template #suffix>
              <i class="el-icon-edit el-input__icon" @click="handleIconClick">
              </i>
            </template>
          </el-input>
        </div>
      </el-scrollbar>
    </el-aside>
  </el-container>
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
        <el-form-item :label="dialogFormRoom.people_limit"></el-form-item>
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
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >送出</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="memberFormVisible">
    <h3>成員列表</h3>
    <el-table :data="memberList" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="Member ID">
              <span>{{ props.row.member_id }}</span>
            </el-form-item>
            <el-form-item label="暱稱">
              <span>{{ props.row.nickname }}</span>
            </el-form-item>
            <el-form-item label="階級">
              <span>{{ props.row.access_level }}</span>
            </el-form-item>
            <el-form-item label="操作" v-if="isAdmin">
              <el-button
                size="mini"
                type="warning"
                plain
                @click="
                  handleMemberOperation(props.$index, props.row, 'remove')
                "
                >踢出房間</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleMemberOperation(props.$index, props.row, 'block')"
                >封鎖</el-button
              >
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="Member ID" prop="member_id"></el-table-column>
      <el-table-column label="暱稱" prop="nickname"></el-table-column>
      <el-table-column label="階級" prop="access_level"></el-table-column>
    </el-table>
    <h3>Block 列表</h3>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="uid" label="Member ID" width="110">
      </el-table-column>
      <el-table-column prop="nickname" label="暱稱" width="50">
      </el-table-column>
      <el-table-column prop="reason" label="原因"> </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="memberFormVisible = false">取消</el-button>
        <el-button type="primary" @click="memberFormVisible = false"
          >確定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import RoomService from '@/services/RoomService.js'
import SideBar from '@/components/SideBar.vue'
import ChatRoom from '@/components/ChatRoom.vue'

export default {
  props: ['id'],
  components: {
    SideBar,
    ChatRoom,
  },
  data() {
    return {
      exist_btn_text: '離開房間',
      user: {
        access_level: 'user',
      },
      memberList: [],
      invitationList: [],
      blockList: [],
      userRooms: ['徵室友', '找山友', '吃鬆餅', '搭車回高雄'],
      host: '',
      dialogFormVisible: false,
      dialogFormRoom: {},
      memberFormVisible: false,
      isAdmin: true,
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
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    }
  },
  async created() {
    if (this.$store.state.token) {
      this.$store
        .dispatch('refreshToken')
        .then((resRefresh) => {
          console.log(resRefresh)
          this.init_list() // if getList occurred err, will show in func
        })
        .catch((err) => {
          if (
            'code' in err.response.data &&
            err.response.data['code'] == 'token_not_valid'
          ) {
            this.$store.dispatch('resetToken')
            this.$router.push({
              name: 'login',
            })
          }
        })
    } else {
      console.log('plz login !')
      this.$router.push({
        name: 'login',
      })
    }

    // this.getUserObj()
    //   .then((res) => {
    //     this.user = res
    //     console.log(res)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  },
  methods: {
    init_list() {
      this.getRoomObj()
        .then((res) => {
          this.room = res
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })

      this.getInvitationList()
        .then((res) => {
          this.invitationList = res.data
          console.log('invitationList', res.data)
        })
        .catch((err) => {
          console.log(err.data)
        })

      this.getMemberList()
        .then((res) => {
          this.memberList = res.data
          this.host = res.data.filter(
            (user) => user.access_level == 'admin'
          )[0].nickname
          console.log('memberList: ', res.data)
        })
        .catch((err) => {
          console.log(err.data)
        })

      this.getBlockList()
        .then((res) => {
          this.blockList = res.data
          console.log('blockList:', res.data)
        })
        .catch((err) => {
          console.log(err.data)
        })
    },
    getUserObj() {},
    getCategories() {},
    getRoomObj() {
      return new Promise((resolve, reject) => {
        RoomService.getRoom(this.id)
          .then((response) => {
            console.log(this.room)
            resolve(response.data)
            // this.room = response.data  //
          })
          .catch((error) => {
            console.log('There was an error:', JSON.stringify(error.response))
            reject(error.data) //
          })
      })
    },
    getMemberList() {
      return RoomService.getRoomMemberList(this.id)
    },
    getBlockList() {
      return RoomService.getRoomBlockList(this.id)
    },
    getInvitationList() {
      return RoomService.getRoomInvitationList(this.id)
    },
    handleIconClick() {},
    handleMemberOperation(id, row, operation) {
      var operationText = operation == 'block' ? '封鎖' : '踢出房間'
      this.$prompt(
        '執行原因',
        '將 ' + row.nickname + ' 踢出房間' + operationText,
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          inputPattern: /[^(?!\s*$).+]/,
          inputErrorMessage: '原因不能為空 !',
        }
      )
        .then((value) => {
          if (operation == 'block') {
            return RoomService.postBlockUser(this.id, row.member_id, value)
          } else if (operation == 'remove') {
            return RoomService.deleteRemoveUser(this.id, row.member_id, value)
          }
        })
        .then((res) => {
          res.status && console.log(res.status)
          this.$message({
            type: 'success',
            message: operationText + '成功',
          })
        })
        .catch((err) => {
          console.log('[In RoomShow]', err)
          if (err == 'cancel') {
            this.$message({
              type: 'info',
              message: '取消操作',
            })
          }
        })

      // if (operation == 'remove') {
      //   return
      // }
      // if (!this.reason) {
      //   this.$message.error('請填寫原因再執行踢人或是封鎖。')
      // }
      console.log(id, row, operation)
      //return RoomService.postBlockUser(this.id, row.member_id)
    },
  },
  watch: {
    memberList: function (val) {
      // for(var u of memberList){
      //   if(u.member_id == this.user.member_id){
      //     this.isAdmin =
      //   }
      // }
      console.log(val)
    },
  },
}
</script>
<style scoped>
.mainContainer {
  max-height: 88vh;
}
.mainContainer :deep(.chatRoomContainer) {
  padding: 0 1%;
}
.SideBarContainer {
  width: 160px !important;
}
.chatRoomContainer {
  max-height: 100%;
}
.roomInfo {
  text-align: left;
  width: 200px !important;
  overflow: auto;
}
.roomInfo p {
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
input {
  border-style: none;
}
.el-icon-edit {
  cursor: pointer;
}
.el-icon-edit:hover {
  color: #409eff;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #2e71cf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
