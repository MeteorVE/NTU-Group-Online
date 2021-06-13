<template>
  <el-container class="mainContainer">
    <el-aside class="SideBarContainer"
      ><SideBar
        :sideBarList="
          userRooms.map((r) => ({ text: r.title, url: '/room/' + r.id + '/' }))
        "
        :urlMode="true"
    /></el-aside>
    <el-main class="chatRoomContainer">
      <ChatRoom :roomws="roomws" :messages="messages" />
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
          <h5>房間開放時間</h5>
          <p>
            {{ !room.create_time ? '未指定' : room.create_time.slice(0, 10) }}
            {{ !room.create_time ? '' : room.create_time.slice(11, 19) }}
            ~<br />
            {{ !room.valid_time ? '未指定' : room.valid_time.slice(0, 10) }}
            {{ !room.valid_time ? '' : room.valid_time.slice(11, 19) }}
          </p>
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
          <el-input placeholder="請輸入內容" clearable>
            <template #suffix>
              <i class="el-icon-edit el-input__icon" @click="handleIconClick">
              </i>
            </template>
          </el-input>
        </div>
        <el-divider></el-divider>
        <div>
          <h5>離開房間</h5>
          <el-popconfirm
            confirmButtonText="離開"
            confirmButtonType="danger"
            cancelButtonText="取消"
            icon="el-icon-info"
            iconColor="red"
            title="確定離開 ? 離開後將不會是成員。若您是'房主'會直接刪除房間。"
            @confirm="handleExitRoom"
          >
            <template #reference>
              <el-button type="danger" round>離開房間</el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-scrollbar>
    </el-aside>
  </el-container>
  <el-dialog title="編輯房間" v-model="dialogFormVisible" v-if="isAdmin">
    <el-form :model="dialogFormRoom">
      <el-form-item label="房間名稱">
        <el-input v-model="dialogFormRoom.title"></el-input>
      </el-form-item>
      <el-form-item label="房間 Category">
        <el-select
          v-model="dialogFormRoom.room_category"
          placeholder="選擇房間分類"
        >
          <el-option
            v-for="category in categoryDict"
            :label="category.category"
            :key="category.value"
            :value="category.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="簡介">
        <el-input
          type="textarea"
          placeholder="Enter description of your room:"
          v-model="dialogFormRoom.introduction"
          maxlength="100"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item @submit.prevent>
        <span>最大人數</span>
        <el-slider
          v-model="dialogFormRoom.people_limit"
          show-input
          :max="100"
          :step="5"
          input-size="mini"
        >
        </el-slider>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click=";[(handleEditRoom(), (dialogFormVisible = false))]"
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
            <el-form-item label="學號">
              <span>{{ props.row.username }}</span>
            </el-form-item>
            <el-form-item label="暱稱">
              <span>{{ props.row.nickname }}</span>
            </el-form-item>
            <el-form-item
              label="操作"
              v-if="
                isAdmin &&
                user.member_id != props.row.member_id &&
                props.row.member_id !=
                  memberList.find((m) => m.access_level == 'admin').member_id
              "
            >
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
              <el-popconfirm
                confirmButtonText="確認"
                cancelButtonText="取消"
                icon="el-icon-info"
                iconColor="red"
                title="確定轉移房主身分給他 ? 您將降級為無權限用戶。"
                @confirm="handleTransferAdmin(props.row)"
              >
                <template #reference>
                  <el-button size="mini" type="danger" plain
                    >將房主轉移給他</el-button
                  >
                </template>
              </el-popconfirm>
            </el-form-item>
            <el-form-item
              label="更改階級成:"
              v-if="
                isAdmin &&
                user.member_id != props.row.member_id &&
                props.row.member_id !=
                  memberList.find((m) => m.access_level == 'admin').member_id
              "
            >
              <el-select
                v-model="tmp"
                @change="handleSetLevel($event, props.row.member_id)"
              >
                <el-option
                  v-for="(val, key) in { manager: '房管', user: '普通用戶' }"
                  :key="key"
                  :label="val"
                  :value="key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="學號" prop="username"> </el-table-column>
      <el-table-column label="暱稱" prop="nickname"></el-table-column>
      <el-table-column label="階級" prop="access_level"></el-table-column>
    </el-table>
    <h3>Block 列表</h3>
    <el-table :data="blockList" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="操作者">
              <span>{{
                memberList.filter(
                  (m) => m.member_id == props.row.block_manager_id
                )[0].nickname +
                '(' +
                props.row.manager_username +
                ')'
              }}</span>
            </el-form-item>
            <el-form-item label="操作" v-if="isAdmin">
              <el-popconfirm
                confirmButtonText="確認"
                cancelButtonText="取消"
                icon="el-icon-info"
                iconColor="red"
                title="確定解除封鎖 ?"
                @confirm="handleUnblockOperation(props.row)"
              >
                <template #reference>
                  <el-button size="mini" type="danger">解除封鎖</el-button>
                </template>
              </el-popconfirm>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="user_username" label="學號"> </el-table-column>
      <el-table-column prop="reason" label="原因"></el-table-column>
    </el-table>
    <h3>邀請列表</h3>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="請輸入欲邀請學號">
        <el-input v-model="invitedUserId" placeholder="學號"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleInvitation">邀請</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="invitationList" style="width: 100%">
      <!-- <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="操作" v-if="isAdmin">
              <el-popconfirm
                confirmButtonText="確認"
                cancelButtonText="取消"
                icon="el-icon-info"
                iconColor="red"
                title="確定取消邀請 ?"
                @confirm="handleCancelInvitation(props.row)"
              >
                <template #reference>
                  <el-button size="mini" type="danger">取消邀請</el-button>
                </template>
              </el-popconfirm>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="invited_username"
        label="被邀請者"
      ></el-table-column>
      <el-table-column prop="inviter_username" label="邀請者"></el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="memberFormVisible = false"
          >關閉</el-button
        >
      </span>
    </template>
    <h3>Room Record</h3>
    <div>
      <span
        v-for="rec in roomRecord.slice(
          roomRecord.length - 5,
          roomRecord.length
        )"
        :key="rec"
        >{{ rec.recording }}<br
      /></span>
    </div>
  </el-dialog>
  <el-dialog
    title="提示"
    v-model="removeDialog.visible"
    width="30%"
    :before-close="handleClose"
  >
    <el-result
      icon="warning"
      :title="removeDialog.title"
      :subTitle="removeDialog.subTitle"
    >
      <template #extra>
        <el-button type="primary" size="medium">返回</el-button>
      </template>
    </el-result>
    <template #footer>
      <span class="dialog-footer"> </span>
    </template>
  </el-dialog>
</template>

<script>
import RoomService from '@/services/RoomService.js'
import SideBar from '@/components/SideBar.vue'
import ChatRoom from '@/components/ChatRoom.vue'
import WsService from '@/services/WebsocketService.js'

export default {
  props: ['id'],
  components: {
    SideBar,
    ChatRoom,
  },
  data() {
    return {
      exist_btn_text: '離開房間',
      tmp: '',
      invitedUserId: '',
      user: {
        access_level: 'user',
      },
      memberList: [],
      invitationList: [],
      blockList: [],
      categoryDict: {},
      userRooms: [],
      levelDict: { admin: '房主', manager: '房管', user: '普通用戶' },
      host: '',
      roomRecord: '',
      dialogFormVisible: false,
      isAdmin: false,
      room: {
        id: 0,
        title: 'Loading Not Successful',
        introduction: 'Loading Not Successful',
        create_time: '2000-01-01T20:33:33.033448+08:00',
        valid_time: '2000-01-01T20:33:33.033448+08:00',
        room_type: 'private',
        room_category: 'course',
        people_limit: 1,
      },
      tableData: [
        {
          date: '2010-01-01',
          name: '',
          address: '',
        },
      ],
      dialogFormRoom: {},
      memberFormVisible: false,
      roomws: {},
      messages: [],
      removeDialog: { visible: false, title: '', subTitle: '' },
    }
  },
  async created() {
    if (this.$store.state.token && !this.$store.state.is_verify) {
      this.$store.dispatch('getIsVerify').then(() => {
        console.log('未過 mail 認證 !')
        if (this.$store.state.is_verify == false) {
          this.$router.push({
            name: 'profile',
          })
          this.$message.error('未過 mail 認證 !')
        }
      })
    }

    if (this.$store.state.token) {
      this.$store
        .dispatch('refreshToken')
        .then((resRefresh) => {
          console.log(resRefresh)
          return this.getUserRooms()
        })
        .then((res) => {
          if (res.data.map((ro) => ro.id).includes(Number(this.id))) {
            this.userRooms = res.data
            return this.init_list()
          } else {
            this.$message.error('你怎麼進來的 = =')
            this.removeDialog.title = '您將被導向首頁'
            this.removeDialog.subTitle = '原因: 房間不存在/您無權限訪問'
            this.removeDialog.visible = true
            setTimeout(() => {
              this.$router.push({
                name: 'home',
              })
            }, 2000)
            return Promise.reject('user not in room !')
          }
        })
        .catch((err) => {
          // if refresh token is invalid, it will trigger 401 and redirect to Login auto.
          // so here we don't need to handle it.
          console.log(err)
        })
    } else {
      this.$message.error('請登入 !')
      this.$router.push({
        name: 'login',
      })
    }
    //---------------------websocket-------------------------------

    if (this.roomws[parseInt(this.$route.params.id, 10)] == null) {
      console.log('Room ' + parseInt(this.$route.params.id, 10) + ' Ws init')
      this.roomws[
        parseInt(this.$route.params.id, 10)
      ] = WsService.InitRoomWebsocket(
        this.$store.state.token,
        parseInt(this.$route.params.id, 10)
      ) //初始化
      console.log(this.roomws[parseInt(this.$route.params.id, 10)])

      this.roomws[parseInt(this.$route.params.id, 10)].onmessage = (event) => {
        //console.log(event.data)

        let res = JSON.parse(event.data) //訊息的data
        let showtime = null
        console.log('Now Room: ' + parseInt(this.$route.params.id, 10))
        console.log('[Websocket event.data]:', event.data)
        // console.log(res.roomID) //送到的room ID
        // console.log(res.message) //我們要update廣播的message
        // console.log(res.time) //送出這個訊息的時間

        //-------按照header判斷訊息種類---------
        // message = [ 'memberList', 'invitationList', 'blockList', 'RoomProfile' ...  ]
        switch (res.header) {
          case 'message': //-----正常傳訊息會是這個header-------
            // console.log(res.userID, res.roomID, res.nickname, res.message)
            showtime = new Date(res.time) //5.訊息的時間 用js就能Parse出來了
            var hour = showtime.getHours()
            var minute = showtime.getMinutes()
            hour = String(hour).padStart(2, '0')
            minute = String(minute).padStart(2, '0')
            var currentTime = `${hour}:${minute}`
            var newMessage = {
              user: res.userID,
              nickname: res.nickname,
              text: res.message,
              time: currentTime,
            }
            this.messages.push(newMessage)
            //--------------以上可以自由運用----------------------
            /* 這邊原本是要顯示訊息的code，但我不會Element UI跟Vue的高端寫法，只好交給前端去做
            console.log(this.$store.state.user_id)
            if (res.userId != this.$store.state.user_id) {
              this.messages.push({
                id: res.userID,
                user: res.username,
                time: String(showtime.getHours()) + String(showtime.getMinutes()),
                text: res.message,
              })
            }
            */
            break
          case 'remove':
            if (res.message === 'Removed') {
              console.log('ws case : remove')

              let msgObj = {
                header: 'controlMessage', // Message 的 header,正常message的header就叫message
                msg_type: 'text', // Message 的 type,因為當初本來有考慮要送圖片 但現在沒有,所以type是text
                userID: this.$store.state.user_id, //送這個message的user ID, 一開始就有存在store裡面
                roomID: parseInt(this.$route.params.id, 10), // 目前的roomID,用route參數的ID來判斷
                message: 'Close', //文字訊息
                token: this.$store.state.token, //Request 都必需附上token
              }
              this.roomws[parseInt(this.$route.params.id, 10)].send(
                JSON.stringify(msgObj)
              )
              //------------------------------------------
              //Then Close Room Handle or Trigger
              this.removeDialog.title = '您將被導向首頁'
              this.removeDialog.subTitle = '原因: 您被移出成員列表。'
              this.removeDialog.visible = true
              setTimeout(() => {
                this.$router.push({
                  name: 'home',
                })
              }, 3000)
            }
            break
          case 'update':
            if (res.message.includes('member_list')) {
              this.getMemberList()
                .then((res) => {
                  this.memberList = res.data
                  this.host = res.data.filter(
                    (user) => user.access_level == 'admin'
                  )[0].nickname
                  if (!res.data.filter((m) => m.member_id)) {
                    console.log('you are not in room QQ')
                  }
                })
                .catch((err) => {
                  console.log(err.data)
                })
            }
            if (res.message.includes('block_list')) {
              this.getBlockList()
                .then((res) => {
                  this.blockList = res.data
                  console.log('blockList:', res.data)
                })
                .catch((err) => {
                  console.log(err.data)
                })
            }
            if (res.message.includes('invite_list')) {
              this.getInvitationList()
                .then((res) => {
                  this.invitationList = res.data
                  console.log('invitationList', res.data)
                })
                .catch((err) => {
                  console.log(err.data)
                })
            }
            if (res.message.includes('profile')) {
              this.getRoomObj()
                .then((res) => {
                  this.room = res
                  this.dialogFormRoom = { ...res }
                  console.log(res)
                })
                .catch((err) => {
                  console.log(err)
                })
            }

            if (res.message === 'delete_room') {
              // = if (res.message.includes('delete_room'))
              let msgObj = {
                header: 'controlMessage', // Message 的 header,正常message的header就叫message
                msg_type: 'text', // Message 的 type,因為當初本來有考慮要送圖片 但現在沒有,所以type是text
                userID: this.$store.state.user_id, //送這個message的user ID, 一開始就有存在store裡面
                roomID: parseInt(this.$route.params.id, 10), // 目前的roomID,用route參數的ID來判斷
                message: 'Close', //文字訊息
                token: this.$store.state.token, //Request 都必需附上token
              }
              this.roomws[parseInt(this.$route.params.id, 10)].send(
                JSON.stringify(msgObj)
              )
              //----------------Then Close Room Handle or Trigger --------------------------
              this.removeDialog.title = '您將被導向首頁'
              this.removeDialog.subTitle = '原因: 房主關閉了房間。'
              this.removeDialog.visible = true
              setTimeout(() => {
                this.$router.push({
                  name: 'home',
                })
              }, 3000)
            }
            this.getRoomRecord()
              .then((res) => {
                this.roomRecord = res.data
              })
              .catch((err) => {
                console.log(err.data)
              })
            // end of case "update"
            break
          case 'ping': //也是確認websocket還有沒有活著的部份
            console.log(parseInt(this.$route.params.id, 10))
            console.log(this.$route.fullPath)
            if (
              this.$route.fullPath !=
                '/room/' + parseInt(this.$route.params.id, 10) + '/' ||
              this.$route.fullPath !=
                '/room/' + parseInt(this.$route.params.id, 10)
            ) {
              console.log('Close room websocket by param')
              this.roomws[parseInt(this.$route.params.id, 10)].close()
            }
            break
        }
      }
    }

    //--------------------websocket-------------------------------
  },
  methods: {
    init_list() {
      this.getRoomObj()
        .then((res) => {
          this.room = res
          this.dialogFormRoom = { ...res }
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
          return this.getUserObj()
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
          console.log('invitationList:', res.data)
        })
        .catch((err) => {
          console.log(err.data)
        })

      this.getRoomRecord()
        .then((res) => {
          this.roomRecord = res.data
          console.log('roomRecord:', res.data)
        })
        .catch((err) => {
          console.log(err.data)
        })

      this.getRoomCategory()
        .then((res) => {
          this.categoryDict = res.data
          console.log('categoryDict:', res.data)
        })
        .catch((err) => {
          console.log(err.data)
        })
    },
    getUserObj() {
      RoomService.getUserId()
        .then((res) => {
          let userId = res.data.id
          let userObj = this.memberList.filter((m) => m.member_id == userId)[0]
          if (userObj) {
            this.user = userObj
          }
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    },
    getRoomObj() {
      return new Promise((resolve, reject) => {
        RoomService.getRoom(this.id)
          .then((response) => {
            resolve(response.data)
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
    getRoomRecord() {
      return RoomService.getRoomRecord(this.id)
    },
    getRoomCategory() {
      return RoomService.getRoomCategory()
    },
    getUserRooms() {
      return RoomService.getUserRooms()
    },
    handleEditRoom() {
      RoomService.putRoom(this.id, this.dialogFormRoom)
        .then((res) => {
          console.log('[Success] 成功修改房間，成果:', res.data)
          this.room = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleExitRoom() {
      if (this.user.access_level == 'admin') {
        RoomService.deleteRoom(this.id).catch((err) => {
          this.$message.error(err.data.error)
        })
      } else {
        RoomService.deleteLeaveRoom(this.id).catch((err) => {
          this.$message.error(err.data.error)
        })
      }

      this.$router.push({
        name: 'home',
      })
      return
    },
    handleInvitation() {
      RoomService.postRoomInvite(this.id, this.invitedUserId)
        .then(() => {
          console.log('postRoomInvite Successful')
          return this.getInvitationList()
        })
        .then((res) => {
          this.invitationList = res.data
        })
        .catch((err) => {
          this.$message.error(err.data.error)
        })
    },
    handleCancelInvitation(row) {
      console.log(row.invited_id)
    },
    handleSetLevel(newLevel, userId) {
      RoomService.putSetLevel(this.id, { [userId]: newLevel })
        .then(() => {
          return this.getMemberList()
        })
        .then((res) => {
          this.memberList = res.data
          console.log('[Success]', userId, '的階級改成', newLevel)
          this.$message.success('修改階級成功 !')
        })
        .catch((err) => {
          this.$message.error('handleSetLevel:', err.data.error)
        })
    },
    handleAddModerator(row) {
      let parameter = {}
      parameter[row.member_id] = ''
      console.log(parameter)
    },
    handleTransferAdmin(row) {
      RoomService.putTransferAdmin(this.id, row.member_id)
        .then(() => {
          console.log('已轉移房主')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleUnblockOperation(row) {
      RoomService.deleteUnblockUser(this.id, row.blocked_user_id)
        .then(() => {
          console.log('[Success] 解除封鎖成功，對象:', row.blocked_user_id)
          this.blockList = this.blockList.filter(
            (m) => m.blocked_user_id != row.blocked_user_id
          )
        })
        .catch((err) => {
          console.log(err)
        })
    },
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
        .then((val) => {
          if (operation == 'block') {
            return RoomService.postBlockUser(this.id, row.member_id, val.value)
          } else if (operation == 'remove') {
            return RoomService.deleteRemoveUser(
              this.id,
              row.member_id,
              val.value
            )
          }
        })
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: operationText + '成功',
            })
          }
          this.memberList = this.memberList.filter(
            (member) => member.member_id != row.member_id
          )
          if (operation == 'block') {
            return this.getBlockList()
              .then((res) => {
                this.blockList = res.data
              })
              .catch((err) => {
                console.log(err.data)
              })
          }
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

      console.log(
        '[Success]: 執行',
        operation,
        '操作成功，對象:',
        row.member_id
      )
    },
    addMessage(newMessage) {
      this.messages.push(newMessage)
    },
  },
  watch: {
    memberList: function (_memberList) {
      this.getUserObj()
      console.log('[watch] memberList changed:', _memberList)
    },
    user: function (_user) {
      console.log('[watch] user changed:', _user)
      this.isAdmin =
        _user.access_level == 'admin' || _user.access_level == 'manager'
          ? true
          : false
    },
    'this.$route.params.id': function (id) {
      console.log('Change route params: ' + id)
      if (this.roomws[parseInt(this.$route.params.id, 10)] == null || this.roomws[parseInt(this.$route.params.id, 10)] == undefined) {
        console.log('Room ' + parseInt(this.$route.params.id, 10) + ' Ws init')
        this.roomws[
          parseInt(this.$route.params.id, 10)
        ] = WsService.InitRoomWebsocket(
          this.$store.state.token,
          parseInt(this.$route.params.id, 10)
        ) //初始化
        console.log(this.roomws[parseInt(this.$route.params.id, 10)])

        this.roomws[parseInt(this.$route.params.id, 10)].onmessage = (
          event
        ) => {
          //console.log(event.data)

          let res = JSON.parse(event.data) //訊息的data
          let showtime = null
          console.log('Now Room: ' + parseInt(this.$route.params.id, 10))
          console.log('[Websocket event.data]:', event.data)
          // console.log(res.roomID) //送到的room ID
          // console.log(res.message) //我們要update廣播的message
          // console.log(res.time) //送出這個訊息的時間

          //-------按照header判斷訊息種類---------
          // message = [ 'memberList', 'invitationList', 'blockList', 'RoomProfile' ...  ]
          switch (res.header) {
            case 'message': //-----正常傳訊息會是這個header-------
              // console.log(res.userID, res.roomID, res.nickname, res.message)
              showtime = new Date(res.time) //5.訊息的時間 用js就能Parse出來了
              var hour = showtime.getHours()
              var minute = showtime.getMinutes()
              hour = String(hour).padStart(2, '0')
              minute = String(minute).padStart(2, '0')
              var currentTime = `${hour}:${minute}`
              var newMessage = {
                user: res.userID,
                nickname: res.nickname,
                text: res.message,
                time: currentTime,
              }
              this.messages.push(newMessage)
              //--------------以上可以自由運用----------------------
              /* 這邊原本是要顯示訊息的code，但我不會Element UI跟Vue的高端寫法，只好交給前端去做
            console.log(this.$store.state.user_id)
            if (res.userId != this.$store.state.user_id) {
              this.messages.push({
                id: res.userID,
                user: res.username,
                time: String(showtime.getHours()) + String(showtime.getMinutes()),
                text: res.message,
              })
            }
            */
              break
            case 'remove':
              if (res.message === 'Removed') {
                console.log('ws case : remove')

                let msgObj = {
                  header: 'controlMessage', // Message 的 header,正常message的header就叫message
                  msg_type: 'text', // Message 的 type,因為當初本來有考慮要送圖片 但現在沒有,所以type是text
                  userID: this.$store.state.user_id, //送這個message的user ID, 一開始就有存在store裡面
                  roomID: parseInt(this.$route.params.id, 10), // 目前的roomID,用route參數的ID來判斷
                  message: 'Close', //文字訊息
                  token: this.$store.state.token, //Request 都必需附上token
                }
                this.roomws[parseInt(this.$route.params.id, 10)].send(
                  JSON.stringify(msgObj)
                )
                //------------------------------------------
                //Then Close Room Handle or Trigger
                this.removeDialog.title = '您將被導向首頁'
                this.removeDialog.subTitle = '原因: 您被移出成員列表。'
                this.removeDialog.visible = true
                setTimeout(() => {
                  this.$router.push({
                    name: 'home',
                  })
                }, 3000)
              }
              break
            case 'update':
              if (res.message.includes('member_list')) {
                this.getMemberList()
                  .then((res) => {
                    this.memberList = res.data
                    this.host = res.data.filter(
                      (user) => user.access_level == 'admin'
                    )[0].nickname
                    if (!res.data.filter((m) => m.member_id)) {
                      console.log('you are not in room QQ')
                    }
                  })
                  .catch((err) => {
                    console.log(err.data)
                  })
              }
              if (res.message.includes('block_list')) {
                this.getBlockList()
                  .then((res) => {
                    this.blockList = res.data
                    console.log('blockList:', res.data)
                  })
                  .catch((err) => {
                    console.log(err.data)
                  })
              }
              if (res.message.includes('invite_list')) {
                this.getInvitationList()
                  .then((res) => {
                    this.invitationList = res.data
                    console.log('invitationList', res.data)
                  })
                  .catch((err) => {
                    console.log(err.data)
                  })
              }
              if (res.message.includes('profile')) {
                this.getRoomObj()
                  .then((res) => {
                    this.room = res
                    this.dialogFormRoom = { ...res }
                    console.log(res)
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              }

              if (res.message === 'delete_room') {
                // = if (res.message.includes('delete_room'))
                let msgObj = {
                  header: 'controlMessage', // Message 的 header,正常message的header就叫message
                  msg_type: 'text', // Message 的 type,因為當初本來有考慮要送圖片 但現在沒有,所以type是text
                  userID: this.$store.state.user_id, //送這個message的user ID, 一開始就有存在store裡面
                  roomID: parseInt(this.$route.params.id, 10), // 目前的roomID,用route參數的ID來判斷
                  message: 'Close', //文字訊息
                  token: this.$store.state.token, //Request 都必需附上token
                }
                this.roomws[parseInt(this.$route.params.id, 10)].send(
                  JSON.stringify(msgObj)
                )
                //----------------Then Close Room Handle or Trigger --------------------------
                this.removeDialog.title = '您將被導向首頁'
                this.removeDialog.subTitle = '原因: 房主關閉了房間。'
                this.removeDialog.visible = true
                setTimeout(() => {
                  this.$router.push({
                    name: 'home',
                  })
                }, 3000)
              }
              this.getRoomRecord()
                .then((res) => {
                  this.roomRecord = res.data
                })
                .catch((err) => {
                  console.log(err.data)
                })
              // end of case "update"
              break
            case 'ping': //也是確認websocket還有沒有活著的部份
              console.log(parseInt(this.$route.params.id, 10))
              console.log(this.$route.fullPath)
              if (
                this.$route.fullPath !=
                  '/room/' + parseInt(this.$route.params.id, 10) + '/' ||
                this.$route.fullPath !=
                  '/room/' + parseInt(this.$route.params.id, 10)
              ) {
                console.log('Close room websocket by param')
                this.roomws[parseInt(this.$route.params.id, 10)].close()
              }
              break
          }
        }
      }
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
