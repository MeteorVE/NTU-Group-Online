<template>
  <el-menu default-active="1" class="SideBar">
    <el-menu-item
      v-for="(item, index) in sideBarList"
      :key="index"
      :index="index.toString()"
    >
      <i class="el-icon-menu"></i>
      <span>{{ item }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: ['sideBarList'],
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
