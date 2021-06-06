<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>
      If Element Plus is successfully added to this project, you'll see an
      <code v-text="'<el-button>'"></code>

      below
    </p>
    <el-button type="primary">el-button</el-button>
    <el-popconfirm
      title="該使用者會被踢出房間(暫時的，可以再加進來)，確認執行此動作?"
      @confirm="handleEdit(props.$index, props.row)"
    >
      <template #reference>
        <el-button size="mini">踢出房間</el-button>
      </template>
    </el-popconfirm>
    <el-popconfirm
      title="該使用者會被踢出房間(暫時的，可以再加進來)，確認執行此動作?"
      @confirm="handleEdit(props.$index, props.row)"
    >
      <template #reference>
        <el-button size="mini">踢出房間</el-button>
      </template>
    </el-popconfirm>
    <el-form-item label="操作原因">
      <el-input placeholder="若要操作，請輸入原因" v-model="reason" clearable>
      </el-input>
    </el-form-item>
    <!-- <el-time-select
      v-model="value"
      start="08:30"
      step="00:15"
      end="18:30"
      placeholder="選擇時間"
    >
    </el-time-select> -->
  </div>
</template>

<script>
import RoomService from '@/services/RoomService.js'

export default {
  created() {
    this.getRoomObj()
      .then((res) => {
        this.room = res
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  methods: {
    getRoomObj() {
      return new Promise((resolve, reject) => {
        RoomService.getRoom(1)
          .then((response) => {
            console.log(this.room)
            resolve(response.data)
            // this.room = response.data  //
          })
          .catch((error) => {
            console.log('There was an error:', JSON.stringify(error.response))
            reject(error.data) //
          })
      })
    },
  },
  notUsed() {
    if (this.$store.state.user_id == -1) {
      this.$store.dispatch('getUserId')
    }
    let res = null
    if (res.data.map((ro) => ro.id).includes(this.$store.state.user_id)) {
      return this.init_list()
    }
  },
}
</script>
