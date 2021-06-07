<template>
  <el-menu :default-active="$route.path" class="SideBar" router v-if="urlMode">
    <el-menu-item
      v-for="(item, index) in sideBarList"
      :key="index"
      :index="item.url"
      :route="item.url"
    >
      <i class="el-icon-menu"></i>
      <span>{{ item.text }}</span>
    </el-menu-item>
  </el-menu>
  <el-menu v-else class="SideBar">
    <el-scrollbar>
      <el-menu-item
        v-for="(item, index) in sideBarList"
        :key="index"
        :index="index.toString()"
        v-on:click="applyFilter(item)"
      >
        <i class="el-icon-menu"></i>
        <span>{{ item.text }}</span>
      </el-menu-item>
    </el-scrollbar>
  </el-menu>
  <!-- <el-menu :default-active="$route.path" class="SideBar" router>
    <el-menu-item
      v-for="(item, index) in sideBarList"
      :key="index"
      :index="item.url"
      :route="item.url"
    >
      <i class="el-icon-menu"></i>
      <span>{{ item.text }}</span>
    </el-menu-item>
  </el-menu> -->
</template>

<script>
export default {
  props: ['sideBarList'],
  // data: (url_mode = ture),
  methods: {
    applyFilter(item) {
      // console.log(category)
      if (this.$store.state.filter !== item.text) {
        this.$store.state.filter = item.text
      } else {
        this.$store.state.filter = ''
      }
    },
  },
}
</script>

<style>
.SideBar {
  height: 100%;
  text-align: left;
}
.SideBar .el-menu-item span {
  font-size: 12px;
  font-weight: bold;
}
</style>
