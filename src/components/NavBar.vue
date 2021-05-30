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
      <el-menu-item class="searchbar" index="6">
        <el-input placeholder="搜尋" v-model="searchInput"></el-input>
      </el-menu-item>
      <el-menu-item class="search" index="7">
        <i class="el-icon-search"></i>
      </el-menu-item>
    </el-menu>
    <!-- <router-link :to="{ name: 'room-show' }">LinkTitle</router-link> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      searchInput: '',
    }
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
}

.searchbar,
.search {
  position: relative !important;
  left: 30%;
}
</style>
