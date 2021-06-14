<template>
  <!-- <RoomList /> -->
  <div class="userpage">
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="關於我">
        <el-container>
          <el-main>
            <div class="profile">
              <div style="text-align: left" class="password_title">
                <h1><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ user.nickname }}</h1>
              </div>

              <el-divider></el-divider>

              <div class="info">
                <div class="infotext">
                  <el-row>
                    <i style="font-size: 50px" class="el-icon-paperclip"></i>
                    <h3
                      style="
                        margin-left: 10px;
                        margin-top: 0px;
                        font-size: 12px;
                        color: gray;
                      "
                    >
                      暱稱
                    </h3>
                    <h2
                      style="
                        margin-left: -20px;
                        margin-top: -5px;
                        font-size: 20px;
                      "
                    >
                      <br />{{ user.nickname }}
                    </h2>
                  </el-row>

                  <el-row>
                    <i style="font-size: 50px" class="el-icon-message"></i>
                    <h3
                      style="
                        margin-left: 10px;
                        margin-top: 0px;
                        font-size: 12px;
                        color: gray;
                      "
                    >
                      信箱
                    </h3>
                    <h2
                      style="
                        margin-left: -20px;
                        margin-top: -5px;
                        font-size: 20px;
                      "
                    >
                      <br />{{ user.email }}
                    </h2>
                  </el-row>

                  <el-row>
                    <i style="font-size: 50px" class="el-icon-user-solid"></i>
                    <h3
                      style="
                        margin-left: 10px;
                        margin-top: 0px;
                        font-size: 12px;
                        color: gray;
                      "
                    >
                      姓名
                    </h3>
                    <h2
                      style="
                        margin-left: -15px;
                        margin-top: -5px;
                        font-size: 20px;
                      "
                    >
                      <br />{{ user.lastName }},<el-button
                        class="btn"
                        @click="clickLastName"
                        >編輯</el-button
                      >
                      {{ user.firstName
                      }}<el-button class="btn" @click="clickFirstName"
                        >編輯</el-button
                      >
                    </h2>

                    <el-alert
                      v-show="checkLastName"
                      type="info"
                      @close="cancelEditLastName"
                    >
                      <input
                        v-if="checkLastName"
                        type="text"
                        v-model="lastName"
                        prefix-icon="fas fa-lock"
                        @keyup.enter="saveLastName"
                        ref="newlastname"
                      />
                      <el-button v-show="checkLastName" @click="saveLastName"
                        >儲存</el-button
                      >
                    </el-alert>

                    <el-alert
                      v-show="checkFirstName"
                      type="info"
                      @close="cancelEditFirstName"
                    >
                      <input
                        v-if="checkFirstName"
                        type="text"
                        v-model="firstName"
                        prefix-icon="fas fa-lock"
                        @keyup.enter="saveFirstName"
                        ref="newfirstname"
                      />
                      <el-button v-show="checkFirstName" @click="saveFirstName"
                        >儲存</el-button
                      >
                    </el-alert>

                    <!-- <input
                      v-show="checkLastName"
                      type="text"
                      v-model="lastName"
                      @keyup.enter="saveLastName"
                      ref="newlastname"/>
                    <el-button v-show="checkLastName" @click="saveLastName">save</el-button>
                    <input
                      v-show="checkFirstName"
                      type="text"
                      v-model="firstName"
                      @keyup.enter="saveFirstName"
                      ref="newfirstname"/>
                    <el-button v-show="checkFirstName" @click="saveFirstName">save</el-button> -->
                  </el-row>

                  <el-row>
                    <i style="font-size: 50px" class="el-icon-postcard"></i>
                    <h3
                      style="
                        margin-left: 10px;
                        margin-top: 0px;
                        font-size: 12px;
                        color: gray;
                      "
                    >
                      科系
                    </h3>
                    <h2
                      style="
                        margin-left: -15px;
                        margin-top: -5px;
                        font-size: 20px;
                      "
                    >
                      <br />{{ user.department }}
                    </h2>
                  </el-row>
                </div>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>

      <el-tab-pane label="更改密碼">
        <div class="resetPWD">
          <el-card class="reset-card">
            <h2>變更密碼</h2>
            <el-form
              class="reset-form"
              :model="passwordModel"
              :rules="rules"
              ref="form"
              @submit.prevent="submit"
            >
              <el-form-item prop="oldPassword" label="請輸入舊密碼">
                <!-- <el-input
                  v-model="passwordModel.oldPassword"
                  placeholder="Input password again"
                  type="password"
                  prefix-icon="fas fa-repeat"
                ></el-input> -->
                <input
                  center
                  v-model="passwordModel.oldPassword"
                  placeholder="請輸入舊密碼"
                  type="password"
                  prefix-icon="fas fa-lock"
                  ref="oldPassword"
                  @keyup.enter="sumitChangePassword"
                />
              </el-form-item>

              <el-form-item prop="newPassword1" label="請輸入新密碼">
                <!-- <el-input
                  v-model="passwordModel.newPassword1"
                  placeholder="Input password"
                  type="password"
                  prefix-icon="fas fa-lock"
                ></el-input> -->
                <input
                  center
                  v-model="passwordModel.newPassword1"
                  placeholder="請輸入新密碼"
                  type="password"
                  prefix-icon="fas fa-lock"
                  ref="newPassword1"
                  @keyup.enter="sumitChangePassword"
                />
              </el-form-item>

              <el-form-item prop="newPassword2" label="再輸入一次">
                <!-- <el-input
                  v-model="passwordModel.newPassword2"
                  placeholder="Input password again"
                  type="password"
                  prefix-icon="fas fa-repeat"
                ></el-input> -->
                <input
                  center
                  v-model="passwordModel.newPassword2"
                  placeholder="再輸入一次"
                  type="password"
                  prefix-icon="fas fa-lock"
                  ref="newPassword2"
                  @keyup.enter="sumitChangePassword"
                />
              </el-form-item>

              <el-form-item>
                <!-- <el-button
                  :loading="loading"
                  class="login-button"
                  type="primary"
                  
                  block
                  >確定送出</el-button
                > -->
                <el-button type="info" round @click="sumitChangePassword"
                  >確認送出</el-button
                >
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="我的房間">
        <el-container>
          <!-- <router-view /> -->
          <el-main id="roomCardContainer" v-if="my_rooms.length > 0">
            <div
              v-masonry-tile
              class="item"
              v-for="(room, index) in my_rooms"
              v-bind:key="index"
            >
              <RoomListCard :room="room" />
            </div>
          </el-main>
          <el-main id="roomCardContainer" v-else>
            <el-alert
              title="您沒加入任何房間"
              type="info"
              description="歡迎主動加入有興趣的房間"
              center
              show-icon
            >
            </el-alert>
          </el-main>
        </el-container>
        <!-- <RoomList /> -->
      </el-tab-pane>

      <el-tab-pane label="房主管理">
        <el-container>
          <router-view />
          <el-main id="roomCardContainer" v-if="admin_rooms.length > 0">
            <div
              v-masonry-tile
              class="item"
              v-for="(room, index) in admin_rooms"
              v-bind:key="index"
            >
              <RoomListCard :room="room" />
            </div>
          </el-main>
          <el-main id="roomCardContainer" v-else>
            <el-alert
              title="您沒創建任何房間"
              type="info"
              description="歡迎主動創建房間"
              center
              show-icon
            >
            </el-alert>
          </el-main>
        </el-container>
      </el-tab-pane>

      <el-tab-pane label="邀請中的房間">
        <el-container>
          <router-view />
          <el-main id="roomCardContainer" v-if="invited_rooms.length > 0">
            <div
              v-masonry-tile
              class="item"
              v-for="(room, index) in invited_rooms"
              v-bind:key="index"
            >
              <RoomListCard
                :room="room"
                :invited_rooms_btn="invited_rooms_btn"
                :user_nickname="user.nickname"
                :invit_id="invitationList[index].id"
              />
            </div>
          </el-main>
          <el-main id="roomCardContainer" v-else>
            <el-alert
              title="您沒任何受邀的通知"
              type="info"
              description="歡迎主動加入有興趣的房間"
              center
              show-icon
            >
            </el-alert>
          </el-main>
        </el-container>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UserService from '@/services/UserService.js'
// import RoomList from '@/components/RoomList.vue'
import RoomListCard from '@/components/RoomListCard.vue'
import RoomService from '@/services/RoomService.js'
import { mapGetters } from 'vuex'
import { ElMessage } from 'element-plus'
export default {
  props: ['userToken', 'mailToken'],
  components: {
    // RoomList,
    RoomListCard,
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.passwordModel.newPassword1) {
        callback(new Error('兩次輸入密碼不一致 !'))
      } else {
        callback()
      }
    }
    return {
      tabPosition: 'left',
      checkLastName: false,
      checkFirstName: false,
      user: {
        id: 0,
        nickname: '',
        email: '',
        department: '',
        lastName: '',
        firstName: '',
      },
      passwordModel: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
      loading: false,
      rules: {
        oldPassword: [
          {
            required: true,
            message: '此為必填欄位',
            trigger: 'blur',
          },
          {
            min: 4,
            message: '密碼需至少4個字',
            trigger: 'blur',
          },
        ],
        newPassword1: [
          {
            required: true,
            message: '此為必填欄位',
            trigger: 'blur',
          },
          {
            min: 4,
            message: '密碼需至少4個字',
            trigger: 'blur',
          },
        ],
        newPassword2: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
          {
            min: 4,
            message: '密碼需至少4個字',
            trigger: 'blur',
          },
          { validator: validatePass2, trigger: 'blur' },
        ],
      },
      invited_rooms: [],
      invited_rooms_btn: true,
      admin_rooms: [],
      admin_rooms_btn: false,
      my_rooms: [],
      id: 0,
      invitationList: [],
      invitationRooms: [],
    }
  },
  created() {
    if (this.$store.state.token && !this.$store.state.is_verify) {
      this.$store.dispatch('getIsVerify').then(() => {
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
        .then(() => {
          return UserService.getUserId()
        })
        .then((res) => {
          this.user.id = res.data.id
          // return this.ser_fun()
          // }).then((res) => {
          return UserService.getUser(this.user.id)
        })
        .then((res) => {
          this.user.email = res.data.email
          this.user.nickname = res.data.nickname
          this.user.department = res.data.department
          this.user.lastName = res.data.last_name
          this.user.firstName = res.data.first_name
          // return UserService.getUserRoom()
          return UserService.getInvitationList()
        })
        .then((response) => {
          this.invitationList = response.data
          return RoomService.getRooms()
        })
        .then((res) => {
          this.invited_rooms = res.data
          for (let rid of this.invitationList.map((i) => i.room_id)) {
            this.invitationRooms.push(
              this.invited_rooms.find((r) => r.id == rid)
            )
          }
          this.invited_rooms = this.invitationRooms
          return UserService.getUserAdminRoom()
        })
        .then((response) => {
          this.admin_rooms = response.data
          return UserService.getUserRoom()
        })
        .then((response) => {
          this.my_rooms = response.data
        })
      // .catch((err) => {
      //   if (
      //     'code' in err.response.data &&
      //     err.response.data['code'] == 'token_not_valid'
      //   ) {
      //     this.$store.dispatch('resetToken')
      //     this.$router.push({
      //       name: 'login',
      //     })
      //   }
      // })
    } else {
      console.log('plz login !')
      ElMessage.error('請登入 !')
      this.$router.push({
        name: 'login',
      })
    }
  },
  methods: {
    clickLastName() {
      this.checkLastName = true
    },
    cancelEditLastName() {
      this.checkLastName = false
    },
    saveLastName() {
      this.checkLastName = false
      this.user.lastName = this.$refs.newlastname.value
      UserService.putUserEdit(
        this.user.id,
        this.$refs.newlastname.value,
        this.user.firstName
      )
    },
    clickFirstName() {
      this.checkFirstName = true
    },
    cancelEditFirstName() {
      this.checkFirstName = false
    },
    saveFirstName() {
      this.checkFirstName = false
      this.user.firstName = this.$refs.newfirstname.value
      UserService.putUserEdit(
        this.user.id,
        this.user.lastName,
        this.$refs.newfirstname.value
      )
    },
    sumitChangePassword() {
      if (
        (this.$refs.oldPassword.value == '') |
        (this.$refs.newPassword1.value == '') |
        (this.$refs.newPassword2.value == '')
      ) {
        this.noInputPassword()
        this.passwordModel.oldPassword = ''
        this.passwordModel.newPassword1 = ''
        this.passwordModel.newPassword2 = ''
      } else if (
        this.$refs.newPassword1.value != this.$refs.newPassword2.value
      ) {
        this.notEqualNewPassword()
        this.passwordModel.oldPassword = ''
        this.passwordModel.newPassword1 = ''
        this.passwordModel.newPassword2 = ''
      } else {
        UserService.putChangePassword(
          this.user.id,
          this.$refs.oldPassword.value,
          this.$refs.newPassword1.value,
          this.$refs.newPassword2.value
        )
        this.$store
        this.finishChangePassword()
        this.passwordModel.oldPassword = ''
        this.passwordModel.newPassword1 = ''
        this.passwordModel.newPassword2 = ''
      }
    },
    notEqualNewPassword() {
      this.$message({
        message: '兩次密碼不一致',
        center: true,
        type: 'warning',
      })
    },
    noInputPassword() {
      this.$message({
        message: '輸入不能為空白',
        center: true,
        type: 'warning',
      })
    },
    finishChangePassword() {
      this.$message({
        message: '修改成功',
        center: true,
        type: 'success',
      })
    },
    ser_fun() {
      this
    },
  },
  computed: {
    ...mapGetters(['isAuth']),
  },
}
</script>

<style>
.profile {
  background-color: rgb(238, 233, 227);
  width: 1000px;
  margin-left: 20px;
}
.profile .imgid {
  top: 160px;
  left: 620px;
}
.profile .imgbut {
  top: 180px;
  left: 620px;
}
.profile .info {
}
.profile .info .infotext {
  text-align: left;
  margin-left: 20px;
}
.el-row {
  margin-bottom: 20px;
}
.password {
  background-color: rgb(238, 233, 227);
  width: 1000px;
}
.password .password_title {
  top: 50px;
}
.password .info {
}
.password .info .infotext {
  text-align: left;
  margin-top: 10px;
}
.resetPWD {
  /* flex: 1; */
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-image: url('https://www.ntu.edu.tw/12scence/01b1.jpg'); */
  /* background-size: cover; */
}
.resetPWD:before {
  /* background-image: url('https://www.ntu.edu.tw/12scence/01b1.jpg'); */
  width: 100%;
  height: 100%;
  background-size: cover;
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  display: block;
  filter: blur(7px);
}
.reset-card {
  background: rgba(255, 255, 255, 0.39);
  border: none;
  color: #ffffff;
}
.reset-form .el-input input {
  background: rgba(255, 255, 255, 0.2);
}
.reset-form {
  width: 290px;
}
.reset-button {
  width: 100%;
  margin-top: 40px;
}
.resetPWD .el-input__prefix {
  background: rgb(238, 237, 234);
  left: 0;
  height: calc(100% - 2px);
  left: 1px;
  top: 1px;
  border-radius: 3px;
}
.item {
  width: 100%;
}
</style>
