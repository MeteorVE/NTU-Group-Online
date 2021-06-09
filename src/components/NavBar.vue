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
        <el-menu-item route="/" index="/" @click="clearFilter"
          >Homepage</el-menu-item
        >
        <el-menu-item class="plus" route="/room/create" index="/room/create">
          <i class="el-icon-plus"></i>
        </el-menu-item>
        <el-menu-item class="bell" index="5">
          <i class="el-icon-bell"></i>
        </el-menu-item>

        <el-menu-item class="room" route="/roomlist" index="6">
          <i class="el-icon-s-home"></i>
        </el-menu-item>

        <el-menu-item route="/about" index="/about"> About </el-menu-item>
        <el-menu-item v-if="!isAuth" route="/login" index="/login">
          Login
        </el-menu-item>
        <el-menu-item @click="logout"> Logout </el-menu-item>
        <el-menu-item v-if="!isAuth" route="/register" index="/register">
          Register
        </el-menu-item>
        <el-menu-item route="/profile" index="/profile"> User </el-menu-item>
      </div>
      <div class="menu-item-group right-group">
        <el-menu-item class="searchbar" index="/">
          <el-input
            placeholder="搜尋"
            v-model="searchInput"
            @keydown="search"
          ></el-input>
        </el-menu-item>
        <el-menu-item class="search" index="/" @click="applyFilter">
          <i class="el-icon-search"></i>
        </el-menu-item>
      </div>
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
      this.$emit('logoutsignal', true)
    },
    clearFilter() {
      this.$store.state.filter = ''
    },
    search(e) {
      if (e.key == 'Enter') {
        this.applyFilter()
      }
    },
    applyFilter() {
      if (this.searchInput) {
        this.$store.state.filter = this.searchInput
        this.searchInput = ''
      }
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
.search {
  color: white !important;
}
</style>
