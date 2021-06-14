<template>
  <div class="register">
    <el-card class="register-card">
      <h2>註冊</h2>
      <el-form
        class="register-form"
        :model="model"
        :rules="rules"
        ref="form"
        @submit.prevent="register"
      >
        <el-form-item
          label="E-mail (* 僅可用 ntu.edu.tw 註冊，填學號)"
          prop="email"
        >
          <el-col :span="12">
            <el-input
              v-model="model.email"
              placeholder="Email"
              prefix-icon="el-icon-user"
            >
            </el-input>
          </el-col>
          <el-col :span="7">
            <span>@ntu.edu.tw</span>
          </el-col>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="model.password"
            placeholder="請輸入密碼"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item label="請再輸入一次密碼" prop="password2">
          <el-input
            v-model="model.password2"
            placeholder="再輸入一次密碼"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-col :span="8">
            <el-form-item prop="last_name">
              <el-input
                prefix-icon="el-icon-user"
                v-model="model.last_name"
                placeholder="姓"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="first_name">
              <el-input v-model="model.first_name" placeholder="名"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="系籍" prop="department" required>
          <el-input
            v-model="model.department"
            placeholder="系籍"
            prefix-icon="el-icon-folder"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="暱稱" prop="nickname" required>
          <el-input
            v-model="model.nickname"
            placeholder="Nickname"
            prefix-icon="el-icon-chat-round"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            class="register-button"
            type="primary"
            native-type="submit"
            block
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import RoomService from '@/services/RoomService.js'

export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.model.password) {
        callback(new Error('兩次輸入密碼不一致 !'))
      } else {
        callback()
      }
    }
    return {
      model: {
        email: '',
        password: '',
        password2: '',
        last_name: '',
        first_name: '',
        department: '',
        nickname: '',
      },
      loading: false,
      rules: {
        email: [
          {
            required: true,
            message: '必須填寫(寫學號就好)',
            trigger: 'blur',
          },
          {
            min: 4,
            message: 'Email length should be at least 4 characters',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '必須填寫', trigger: 'blur' },
          {
            min: 4,
            message: '請設定至少四個字以上',
            trigger: 'blur',
          },
        ],
        password2: [
          { required: true, message: '必須填寫', trigger: 'blur' },
          {
            min: 4,
            message: '請設定至少四個字以上',
            trigger: 'blur',
          },
          { validator: validatePass2, trigger: 'blur' },
        ],
        last_name: [
          { required: true, message: '姓 必須填寫', trigger: 'blur' },
        ],
        first_name: [
          { required: true, message: '名 必須填寫', trigger: 'blur' },
        ],
        department: [
          { required: true, message: '系籍必須填寫', trigger: 'blur' },
        ],
        nickname: [
          { required: true, message: '暱稱必須填寫', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    //this.forDev()
  },
  methods: {
    forDev() {
      this.model.email = 'r09921119'
      this.model.password = 'test'
      this.model.password2 = 'test'
      this.model.last_name = '許'
      this.model.first_name = '凱荃'
      this.model.department = '電機系'
      this.model.nickname = 'MeteorV'
    },
    submitRegister() {
      console.log('submitRegister')
      let t = Object.assign({}, this.model)
      t.email = t.email + '@ntu.edu.tw'
      return RoomService.postRegister(t)
    },
    simulateLogin() {
      return new Promise((resolve) => {
        setTimeout(resolve, 800)
      })
    },
    async register() {
      let valid = await this.$refs.form.validate()
      if (!valid) {
        return
      }
      this.loading = true
      await this.submitRegister()
        .then((res) => {
          this.$message.success('註冊成功 ! 記得去信箱收信 !')
          console.log(res)
          this.$router.push({
            name: 'login',
          })
        })
        .catch((err) => {
          for (let [key, val] of Object.entries(err.data)) {
            this.$message.error(key + ': ' + val[0])
            console.log(key + ': ' + val[0])
          }
        })
      this.loading = false
    },
  },
}
</script>

<style scoped>
/* https://codesandbox.io/s/l9v2vyypm?file=/src/components/Login.vue */
/* https://www.gushiciku.cn/pl/g60t/zh-tw */
.register {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-image: url('https://www.ntu.edu.tw/12scence/01b1.jpg'); */
  /* background-size: cover; */
}
.register:before {
  background-image: url('https://www.ntu.edu.tw/12scence/01b1.jpg');
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
.register-card {
  background: rgba(255, 255, 255, 0.7);
  border: none;
  text-align: center;
  /* color: #ffffff; */
}
.register-form .el-input input {
  background: rgba(255, 255, 255, 0.2);
}
.register-form {
  width: 80%;
  display: inline-block;
}
.forgot-password {
  margin-top: 10px;
}
.register-button {
  width: 100%;
  margin-top: 40px;
}
.register .el-input__prefix {
  background: rgb(238, 237, 234);
  left: 0;
  height: calc(100% - 2px);
  left: 1px;
  top: 1px;
  border-radius: 3px;
}
</style>
