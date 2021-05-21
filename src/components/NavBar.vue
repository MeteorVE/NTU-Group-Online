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
      <el-menu-item route="/" index="/">Homepage</el-menu-item>
      <el-submenu index="4">
        <template #title>Demo 用選項</template>
        <el-menu-item index="2-1">選項 1</el-menu-item>
        <el-submenu index="2-2">
          <template #title>選項 2</template>
          <el-menu-item index="2-4-1">選項1</el-menu-item>
          <el-menu-item index="2-4-2">選項2</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item route="/room/create" index="/room/create"
        >Create</el-menu-item
      >
      <el-menu-item route="/about" index="/about"> About </el-menu-item>
      <el-menu-item v-if="!isAuth" route="/login" index="/login">
        Login
      </el-menu-item>
      <el-menu-item @click="logout"> Logout </el-menu-item>
      <el-menu-item route="/profile" index="/profile"> User </el-menu-item>
    </el-menu>
    <!-- <router-link :to="{ name: 'room-show' }">LinkTitle</router-link> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  watch: {},
  created() {
    //this.routerIndex = this.$router.path
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
.el-submenu__title:hover {
  background-color: #000 !important;
}
.el-menu-item:hover {
  background-color: #000 !important;
}
a {
  color: #ffffff;
  text-decoration: none;
}
/* .nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}
.nav > .brand {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.5em;
  color: #39b982;
  text-decoration: none;
}
.nav .nav-item {
  box-sizing: border-box;
  margin: 0 5px;
  color: rgba(0, 0, 0, 0.5);
  text-decoration: none;
}
.nav .nav-item.router-link-exact-active {
  color: #39b982;
  border-bottom: solid 2px #39b982;
} */
</style>
