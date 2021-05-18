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
        <el-form-item prop="username">
          <el-input
            v-model="model.username"
            placeholder="Username"
            prefix-icon="fas fa-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="model.password"
            placeholder="Password"
            type="password"
            prefix-icon="fas fa-lock"
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
export default {
  data() {
    return {
      validCredentials: {
        username: 'meteor',
        password: 'meteor',
      },
      model: {
        username: '',
        password: '',
      },
      loading: false,
      rules: {
        username: [
          {
            required: true,
            message: 'Username is required',
            trigger: 'blur',
          },
          {
            min: 4,
            message: 'Username length should be at least 5 characters',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' },
          {
            min: 5,
            message: 'Password length should be at least 5 characters',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
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
      await this.simulateLogin()
      this.loading = false
      if (
        this.model.username === this.validCredentials.username &&
        this.model.password === this.validCredentials.password
      ) {
        this.$message.success('Login successfull')
      } else {
        this.$message.error('Username or password is invalid')
      }
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
