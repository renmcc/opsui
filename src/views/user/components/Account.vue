<template>
  <el-form ref="userInfoForm" :model="userInfoForm" :rules="rules">
    <el-form-item label="用户名" :label-width="labelWidth" label-position="left" prop="user_name">
      <el-input v-model.trim="userInfoForm.user_name" placeholder="用户名" />
    </el-form-item>
    <el-form-item label="邮箱" :label-width="labelWidth" label-position="left" prop="email">
      <el-input v-model.trim="userInfoForm.email" placeholder="邮箱" />
    </el-form-item>
    <el-form-item label="手机号" :label-width="labelWidth" label-position="left" prop="phone">
      <el-input v-model.trim="userInfoForm.phone" placeholder="手机号" />
    </el-form-item>
    <el-form-item :label-width="labelWidth" label-position="left">
      <el-button @click="resetForm('userInfoForm')">重置</el-button>
      <el-button :loading="loading" type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Account',
  data() {
    return {
      userInfoForm: {},
      labelWidth: '100px',
      loading: false,
      rules: {
        user_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度为11个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user_name',
      'phone',
      'email'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.userInfoForm = {
        user_name: this.user_name,
        email: this.email,
        phone: this.phone
      }
    },
    submit() {
      this.$refs.userInfoForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/updateInfo', this.userInfoForm)
            .then(() => {
              this.loading = false
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.loading = false
              this.$message({
                message: '更新失败',
                type: 'error',
                duration: 5 * 1000
              })
            })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields()
      this.getUser()
    }
  }
}
</script>
