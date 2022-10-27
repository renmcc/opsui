<template>
  <div class="app-container">
    <el-row :gutter="20" type="flex">
      <el-col :span="6" :xs="24">
        <user-card />
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="account">
              <account />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="changepassword">
              <change-password />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import Account from './components/Account'
import ChangePassword from './components/ChangePassword'

export default {
  name: 'Center',
  components: { UserCard, Account, ChangePassword },
  data() {
    return {
      activeTab: 'account'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>

