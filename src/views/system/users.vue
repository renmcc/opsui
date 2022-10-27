<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-input
          v-model="listQuery.search"
          placeholder="账号"
          style="width: 250px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >搜索
        </el-button>
      </div>
      <div class="add-container">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >添加
        </el-button>
        <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出
      </el-button> -->
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          label="ID"
          prop="id"
          sortable="custom"
          align="center"
          width="70"
        />
        <el-table-column
          label="账号"
          prop="account"
          min-width="90px"
          align="center"
        />
        <el-table-column
          label="用户名"
          prop="user_name"
          min-width="80px"
          align="center"
        />
        <el-table-column
          label="邮箱"
          prop="email"
          min-width="120px"
          align="center"
        />
        <el-table-column
          label="手机号"
          prop="phone"
          min-width="70px"
          align="center"
        />
        <el-table-column
          label="角色"
          prop="roles"
          align="center"
          min-width="95"
          :formatter="rolesFormatter"
        />
        <el-table-column
          label="创建时间"
          prop="create_time"
          sortable="custom"
          align="center"
          min-width="120"
          class-name="small-padding fixed-width"
        />
        <el-table-column
          label="描述"
          prop="remarks"
          align="center"
          min-width="150px"
          class-name="small-padding fixed-width"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作"
          align="center"
          width="200"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(row, $index)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="警告" :visible.sync="confirmDelete" width="30%">
        <span>确定要删除 <b>{{ deleteRowData.account }}</b> 吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="resetDjalog">取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="confirmDjalog"
          >确 定</el-button>
        </span>
      </el-dialog>
      <pagination
        v-show="total > 20"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <el-dialog
        :title="dialogStatus"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="modalStatus"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="90px"
          style="width: 500px; margin-left: 50px"
        >
          <el-form-item label="账号" prop="account">
            <el-input
              v-model.trim="temp.account"
              placeholder="登录账号"
              :disabled="is_edit"
            />
          </el-form-item>
          <el-form-item label="用户名" prop="user_name">
            <el-input v-model.trim="temp.user_name" placeholder="用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model.trim="temp.password"
              placeholder="密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="temp.email" placeholder="邮箱" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.trim="temp.phone" placeholder="手机号" />
          </el-form-item>
          <el-form-item label="超级管理员" prop="is_active">
            <el-switch
              v-model="temp.is_super"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
          <el-form-item label="用户组">
            <el-select
              v-model="temp.roles"
              class="filter-item"
              placeholder="用户组"
              multiple
            >
              <el-option
                v-for="item in groupsInfo"
                :key="item.id"
                :label="item.role_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model="temp.remarks"
              type="textarea"
              :rows="4"
              style="width: 90%"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="restData()">取消</el-button>
          <el-button
            type="primary"
            @click="dialogStatus === '创建用户' ? createData() : updateData()"
          >确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getUsers,
  postUserInfo,
  updateUserInfo,
  deleteUserInfo
} from '@/api/user'
import { getGroupsInfo } from '@/api/roles'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Users',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      is_edit: false,
      modalStatus: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: '',
        search: '',
        order: 'id'
      },
      groupsInfo: [],
      temp: {
        account: '',
        user_name: '',
        password: '',
        email: '',
        is_super: false,
        phone: '',
        roles: [],
        remarks: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      rules: {
        account: [
          { required: true, message: '登录账号不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20个字符',
            trigger: 'blur'
          }
        ],
        user_name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, trigger: 'blur' },
          {
            min: 11,
            max: 11,
            message: '长度为11个字符',
            trigger: 'blur'
          },
          {
            pattern: /^1[3|4|5|6|7|8][0-9]{9}$/,
            message: '输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      downloadLoading: false,
      confirmDelete: false,
      deleteRowData: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(obj) {
      this.listLoading = true
      getUsers(this.listQuery).then(response => {
        this.list = response.detail
        this.total = response.total
        this.listLoading = false
      })
    },
    rolesFormatter(row, column) {
      const roleList = []
      row.roles.forEach(el => {
        roleList.push(el.role_name)
      })
      const roleNames = roleList ? roleList.join(', ') : ''
      return roleNames
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(column) {
      if (column.order === 'descending') {
        this.listQuery.order = '-' + column.prop
      } else {
        this.listQuery.order = column.prop
      }
      this.getList()
    },
    getGroups() {
      getGroupsInfo().then(response => {
        this.groupsInfo = response.detail
      })
    },
    restTemp() {
      this.temp = {
        account: '',
        user_name: '',
        password: '',
        email: '',
        is_super: false,
        phone: '',
        roles: [],
        remarks: ''
      }
    },
    handleCreate() {
      this.dialogStatus = '创建用户'
      this.is_edit = false
      this.restTemp()
      this.getGroups()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      // this.temp = row
      this.temp = Object.assign({}, row)
      const roleIds = []
      this.temp.roles.forEach(el => {
        roleIds.push(el.id)
      })
      this.temp.roles = roleIds
      if (row.is_super === 1) {
        this.temp.is_super = true
      } else {
        this.temp.is_super = false
      }
      this.listLoading = false
      this.dialogStatus = '编辑账号'
      this.is_edit = true
      this.getGroups()
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          postUserInfo(this.temp).then(response => {
            this.dialogFormVisible = false
            this.restTemp()
            this.getList()
            this.$message({
              title: 'Success',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    restData() {
      this.dialogFormVisible = false
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUserInfo(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$message({
              title: 'Success',
              message: `更新成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.confirmDelete = true
      this.deleteRowData = row
    },
    resetDjalog() {
      this.confirmDelete = false
      this.$message({
        title: 'Success',
        message: '已取消',
        type: 'success',
        duration: 2000
      })
    },
    confirmDjalog() {
      const data = { account: this.deleteRowData.account }
      deleteUserInfo(data).then(() => {
        this.confirmDelete = false
        this.getList()
        this.$message({
          title: 'Success',
          message: `删除成功`,
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          'id',
          '账号',
          '用户名',
          '邮箱',
          '手机号',
          '职位',
          '创建时间'
        ]
        const filterVal = [
          'id',
          'username',
          'name',
          'email',
          'mobile',
          'position',
          'date_joined'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'date_joined') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.datetime {
  position: relative;
  bottom: 4px;
}
</style>
