<template>
  <div>
    <el-container>
      <el-aside class="SideBarContainer"
        ><SideBar :sideBarList="userRooms"
      /></el-aside>
      <el-main>
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
                <el-form-item label="操作">
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
                    @click="
                      handleMemberOperation(props.$index, props.row, 'block')
                    "
                    >封鎖</el-button
                  >
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="Member ID" prop="member_id">
          </el-table-column>
          <el-table-column label="暱稱" prop="nickname"></el-table-column>
          <el-table-column label="階級" prop="access_level"></el-table-column>
        </el-table>
        <h3>Block 列表</h3>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table>
      </el-main>
      <el-aside class="room-info">
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
              @click="handleIconClick"
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
              @click="handleIconClick"
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
          <el-button type="primary" @click="() => {}">送出</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import RoomService from '@/services/RoomService.js'
import SideBar from '@/components/SideBar.vue'
export default {
  props: ['id'],
  components: {
    SideBar,
  },
  data() {
    return {
      exist_btn_text: '離開房間',
      user: {},
      memberList: [],
      invitationList: [],
      blockList: [],
      userRooms: ['徵室友', '找山友', '吃鬆餅', '搭車回高雄'],
      host: '',
      dialogFormVisible: false,
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
  created() {
    this.getRoomObj()
      .then((res) => {
        this.room = res
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })

    // this.getUserObj()
    //   .then((res) => {
    //     this.user = res
    //     console.log(res)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })

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

    this.getInvitationList()
      .then((res) => {
        this.invitationList = res.data
        console.log('invitationList', res.data)
      })
      .catch((err) => {
        console.log(err.data)
      })
  },
  methods: {
    init() {
      console.log()
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
          console.log(row.member_id)

          return (
            RoomService.deleteRemoveUser(this.id, row.member_id, value), value
          )
        })
        .then((res, value) => {
          console.log(res.status)

          // this.getRemoveList().then((res) => {
          //   this.blockList = res.data
          //   console.log('blockList:', res.data)
          // })

          this.$message({
            type: 'success',
            message: operationText + '成功，執行原因: ' + value,
          })
        })
        .catch((err) => {
          console.log(err)
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
}
</script>
<style scoped>
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
input {
  border-style: none;
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
