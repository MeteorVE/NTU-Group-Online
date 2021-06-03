<template>
  <el-menu :default-active="$route.path" class="SideBar" router v-if="url_mode">
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
  <el-menu :default-active="$route.path" class="SideBar" router>
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
</template>

<script>
export default {
  props: ['sideBarList'],
  data: (url_mode = ture),
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
