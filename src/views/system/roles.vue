<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-input
          v-model="listQuery.search"
          placeholder="用户组名称"
          style="width: 250px;"
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
      >导出</el-button> -->
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%;"
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
          label="角色"
          prop="role_name"
          min-width="90px"
          align="center"
        />
        <el-table-column
          label="创建者"
          prop="create_by_user"
          align="center"
          min-width="150"
          class-name="small-padding fixed-width"
        />
        <el-table-column
          label="创建时间"
          prop="create_time"
          sortable="custom"
          align="center"
          min-width="150"
          class-name="small-padding fixed-width"
        />
        <el-table-column
          label="修改者"
          prop="chage_by_user"
          align="center"
          min-width="150"
          class-name="small-padding fixed-width"
        />
        <el-table-column
          label="修改时间"
          prop="last_change_time"
          sortable="custom"
          align="center"
          min-width="150"
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
        <span>确定要删除用户组<b>{{ deleteRowData.name }}</b>吗？</span>
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
        v-show="total > 10"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <el-dialog
        :title="dialogStatus"
        :visible.sync="dialogFormVisible"
        width="70%"
        :close-on-click-modal="modalStatus"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="70px"
          class="transfer-class"
        >
          <el-form-item label="用户组" prop="role_name">
            <el-input
              v-model.trim="temp.role_name"
              :disabled="is_edit"
              style="width: 600px"
              placeholder="用户组"
            />
          </el-form-item>
          <el-form-item label="权限">
            <el-transfer
              v-model="temp.permission_id_list"
              filterable
              :filter-method="permissionFilterMethod"
              filter-placeholder="输入权限"
              :titles="['可用 权限', '选中的 权限 ']"
              :props="{
                key: 'id',
                label: 'label'
              }"
              :data="groupsPermissions"
            />
          </el-form-item>
          <el-form-item label="菜单权限">
            待完成...
            <!-- <el-tree
            ref="menu"
            :data="menuList"
            show-checkbox
            :expand-on-click-node="false"
            node-key="id"
            highlight-current
            :props="defaultMenu"
            :default-checked-keys="defaultRoleMenu"
          /> -->
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="temp.remarks"
              type="textarea"
              :rows="4"
              style="width: 70%"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="restData">取消</el-button>
          <el-button
            type="primary"
            @click="dialogStatus === '创建用户组' ? createData() : updateData()"
          >确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getRoles, createGroup, updateGroup, deleteGroup } from '@/api/roles'
import { getPermissionsInfo } from '@/api/permissions'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Roles',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      is_edit: false,
      modalStatus: false,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: '',
        search: '',
        order: 'id'
      },
      groupsPermissions: [],
      temp: {
        role_name: '',
        menu_id_list: [],
        permission_id_list: [],
        remarks: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      rules: {
        role_name: [
          { required: true, message: '用户组不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
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
      getRoles(this.listQuery).then(response => {
        this.list = response.detail
        this.total = response.total
        this.listLoading = false
      })
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
    permissionsInfo() {
      getPermissionsInfo().then(response => {
        this.groupsPermissions = response.detail
      })
    },
    restTemp() {
      this.temp = {
        role_name: '',
        menu_id_list: [],
        permission_id_list: [],
        remarks: null
      }
    },
    restData() {
      this.dialogFormVisible = false
    },
    handleCreate() {
      this.dialogStatus = '创建用户组'
      this.is_edit = false
      this.restTemp()
      this.permissionsInfo()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row)
      this.temp.role_name = row.role_name
      this.temp.remarks = row.remarks
      // 获取原始权限
      this.temp.permission_id_list = []
      row.permissions.forEach(el => {
        this.temp.permission_id_list.push(el.id)
      })
      this.listLoading = false
      this.dialogStatus = '编辑用户组'
      this.is_edit = true
      this.permissionsInfo()
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createGroup(this.temp).then(response => {
            this.restTemp()
            this.restData()
            this.getList()
            this.$message({
              title: 'Success',
              message: `创建成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateGroup(tempData).then(() => {
            this.restData()
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
      const role_id = this.deleteRowData.id
      deleteGroup(role_id).then(() => {
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
        const tHeader = ['id', '用户组', '创建时间', '更新时间']
        const filterVal = ['id', 'name', 'add_time', 'update_time']
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
          if (j === 'add_time') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    permissionFilterMethod(query, item) {
      return item.name.indexOf(query) > -1
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
