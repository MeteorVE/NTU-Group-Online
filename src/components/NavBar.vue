<template>
  <div id="nav" class="nav">
    <el-menu
      :default-active="$route.path"
      class="el-menu-nav"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <div class="menu-item-group left-group">
        <el-menu-item route="/" index="/">Homepage</el-menu-item>
        <el-menu-item class="plus" route="/room/create" index="4">
          <i class="el-icon-plus"></i>
        </el-menu-item>
        <el-menu-item class="bell" index="5">
          <i class="el-icon-bell"></i>
        </el-menu-item>

        <el-menu-item route="/room/create" index="/room/create"
          >Create</el-menu-item
        >
        <el-menu-item route="/about" index="/about"> About </el-menu-item>
        <el-menu-item v-if="!isAuth" route="/login" index="/login">
          Login
        </el-menu-item>
        <el-menu-item @click="logout"> Logout </el-menu-item>
        <el-menu-item route="/profile" index="/profile"> User </el-menu-item>
      </div>
      <div class="menu-item-group right-group">
        <el-menu-item class="searchbar" index="6">
          <el-input placeholder="搜尋" v-model="searchInput"></el-input>
        </el-menu-item>
        <el-menu-item class="search" index="7">
          <i class="el-icon-search"></i>
        </el-menu-item>
      </div>
    </el-menu>
    <!-- <router-link :to="{ name: 'room-show' }">LinkTitle</router-link> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import WsService from '@/services/WebsocketService.js'
import store from '@/store/index.js'
export default {
  data() {
    return {
      notifyws: null,
      searchInput: '',
    }
  },
  watch: {},
  created() {
    //this.routerIndex = this.$router.path
    //------------------websocket-----------------------------
    //這是通知的websocket,具體說明在Room Show有了
    //靠夭啊好像做在Navbar就不用每頁去Handle了欸
    if (store.state.notifyWebsocketConn == null) {
      this.notifyws = WsService.InitNotifyWebsocket(store.state.token) //初始化
      this.notifyws.onmessage = (event) => {
        //console.log(event.data)
        let res = JSON.parse(event.data) //-------收到的data-----------
        switch (event.data.header) {
          case 'setConn': //設定連線的東西
            if (res.res != 'Success Connect') {
              console.log('Authentication Error or Websocket server Error')
            }
            break
          case 'notify': //通知
            //res.notify_string:按照開會的說法目前後端好像是說會送一個string過來,然後前端再去get,明天寫
            break
          case 'ping': //ping前端還有沒有活著
            break
        }
      }
    }
    //---------------------websocket------------------------
  },
  computed: {
    ...mapGetters(['isAuth']),
  },
  methods: {
    logout() {
      this.$store
        .dispatch('logout', {})
        .then(() => {
          this.$router.push({
            name: 'home',
          })
        })
        .catch(() => {
          console.log('There was a problem when logout')
        })
    },
  },
}
</script>

<style scoped>
/*
.el-submenu__title:hover {
  background-color: #000 !important;
}
.el-menu-item:hover {
  background-color: #000 !important;
}
a {
  color: #ffffff;
  text-decoration: none;
}*/
.el-menu-nav {
  z-index: 1;
  display: flex;
}
.menu-item-group {
  display: flex;
}
.left-group {
  flex-grow: 1;
  justify-content: flex-start;  
}
.right-group {
  flex-grow: 1;
  justify-content: flex-end;
}
</style>
