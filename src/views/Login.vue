<template>
  <div class="login">
    <el-card class="login-card">
      <h2>Login</h2>
      <el-form
        class="login-form"
        :model="model"
        :rules="rules"
        ref="form"
        @submit.prevent="login"
      >
        <el-form-item prop="email">
          <el-input
            v-model="model.email"
            placeholder="Email"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="model.password"
            placeholder="Password"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            class="login-button"
            type="primary"
            native-type="submit"
            block
            >Login</el-button
          >
        </el-form-item>
        <a class="forgot-password" href="">Forgot password ?</a>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import TokenService from '@/services/TokenService.js'

export default {
  data() {
    return {
      model: {
        email: '',
        password: '',
      },
      loading: false,
      rules: {
        email: [
          {
            required: true,
            message: 'Email is required',
            trigger: 'blur',
          },
          {
            min: 4,
            message: 'Email length should be at least 4 characters',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' },
          {
            min: 4,
            message: 'Password length should be at least 5 characters',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.forDev()
  },
  methods: {
    forDev() {
      this.model.email = 'test1@test.com'
      this.model.password = 'test1'
    },
    Login() {
      this.$store
        .dispatch('login', this.model)
        .then(() => {
          this.$message.success('Login successfull')
          //console.log(this.$store.getters.getToken)
          this.$router.go(-1)
        })
        .catch((res) => {
          console.log('Login Failed:', res)
          this.$message.error('Email or password is invalid')
        })
    },
    simulateLogin() {
      return new Promise((resolve) => {
        setTimeout(resolve, 800)
      })
    },
    async login() {
      let valid = await this.$refs.form.validate()
      if (!valid) {
        return
      }
      this.loading = true
      await this.Login()
      this.loading = false
    },
  },
}
</script>

<style scoped>
/* https://codesandbox.io/s/l9v2vyypm?file=/src/components/Login.vue */
/* https://www.gushiciku.cn/pl/g60t/zh-tw */
.login {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 88vh;
  /* background-image: url('https://www.ntu.edu.tw/12scence/01b1.jpg'); */
  /* background-size: cover; */
}
.login:before {
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
.login-card {
  background: rgba(255, 255, 255, 0.39);
  border: none;
  color: #ffffff;
}
.login-form .el-input input {
  background: rgba(255, 255, 255, 0.2);
}
.login-form {
  width: 290px;
}
.forgot-password {
  margin-top: 10px;
}
.login-button {
  width: 100%;
  margin-top: 40px;
}
.login .el-input__prefix {
  background: rgb(238, 237, 234);
  left: 0;
  height: calc(100% - 2px);
  left: 1px;
  top: 1px;
  border-radius: 3px;
}
</style>
