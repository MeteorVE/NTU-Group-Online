<template>
  <div class="resetPWD">
    <el-card class="reset-card">
      <h2>重設密碼</h2>
      <el-form
        class="reset-form"
        :model="model"
        :rules="rules"
        ref="form"
        @submit.prevent="submit"
      >
        <el-form-item prop="password" label="新密碼">
          <el-input
            v-model="model.password"
            placeholder="Input password"
            type="password"
            prefix-icon="fas fa-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repeatPassword" label="再輸入一次">
          <el-input
            v-model="model.password2"
            placeholder="Input password again"
            type="password"
            prefix-icon="fas fa-repeat"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            class="login-button"
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
export default {
  props: ['mailToken'],
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.model.password) {
        callback(new Error('兩次輸入密碼不一致 !'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      model: {
        password: '',
        repeatPassword: '',
      },

      rules: {
        password: [
          {
            required: true,
            message: 'Password is required',
            trigger: 'blur',
          },
          {
            min: 4,
            message: 'Password length should be at least 4 characters',
            trigger: 'blur',
          },
        ],
        repeatPassword: [
          { required: true, message: 'Password is required', trigger: 'blur' },
          {
            min: 4,
            message: 'Password length should be at least 4 characters',
            trigger: 'blur',
          },
          { validator: validatePass2, trigger: 'blur', required: true },
        ],
      },
    }
  },
  created() {
    this.forDev()
  },
  methods: {
    forDev() {
      this.model.password = 'test'
      this.model.repeatPassword = 'test'
    },
    submitReset() {
      console.log('submitReset')
    },
    simulateLogin() {
      return new Promise((resolve) => {
        setTimeout(resolve, 800)
      })
    },
    async submit() {
      let valid = await this.$refs.form.validate()
      if (!valid) {
        return
      }
      this.loading = true
      await this.submitReset()
      this.loading = false
    },
  },
}
</script>
<style scoped>
/* https://codesandbox.io/s/l9v2vyypm?file=/src/components/Login.vue */
/* https://www.gushiciku.cn/pl/g60t/zh-tw */
.resetPWD {
  /* flex: 1; */
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-image: url('https://www.ntu.edu.tw/12scence/01b1.jpg'); */
  /* background-size: cover; */
}
.resetPWD:before {
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
</style>
