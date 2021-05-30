<template>
  <div id="app">
    <NavBar />
    <router-view :key="$route.fullPath" />
    <!-- <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4 }"
      placeholder="Token"
      v-model="textarea"
    >
    </el-input>
    <el-button type="primary" plain @click="copyClipboard()"
      >Copy text</el-button
    >
    <el-button type="primary" plain @click="testReturn()"
      >test API: verify token</el-button
    >
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4 }"
      placeholder="Console text"
      v-model="consoleText"
      :value="consoleText"
    >
    </el-input> -->
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { mapState } from 'vuex'
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      textarea: '',
      consoleText: '',
    }
  },
  created() {
    this.textarea = this.$store.state.token
  },
  watch: {
    token: function (val) {
      this.textarea = val
    },
  },
  computed: {
    ...mapState(['token']),
  },
  methods: {
    copyClipboard() {
      let input = document.body.appendChild(document.createElement('input'))
      input.setAttribute('value', this.textarea)
      input.select()
      input.setSelectionRange(0, 99999) /* For mobile devices */
      document.execCommand('copy')
      console.log(this.textarea)
    },
    testReturn() {
      let ret = this.testAPI()
      //this.consoleText = ret.then((res) => console.log('[testReturn]', res))
      console.log('in testReturn :', ret, this.consoleText)
    },
    testAPI() {
      this.$store
        .dispatch('verifyToken', this.event)
        .then((res) => {
          console.log('[App.vue] testAPI, then:', res, res.data)
          return res
        })
        .catch((err) => {
          console.log(
            '[App.vue] testAPI, catch: There was a problem in test API'
          )
          console.log(err.response.data)
          return err.response.data
        })
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-height: 100%;
}
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
body {
  margin: 0 !important;
}
</style>
