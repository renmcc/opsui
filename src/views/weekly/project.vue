<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-input
          v-model="listQuery.search"
          placeholder="项目名称"
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
          label="名称"
          prop="name"
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
        <span>确定要删除 <b>{{ deleteRowData.name }}</b> 吗？</span>
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
        width="40%"
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
          <el-form-item label="名称" prop="name">
            <el-input
              v-model.trim="temp.name"
              style="width: 300px"
              placeholder="处理类别"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="temp.remarks"
              type="textarea"
              style="width: 70%"
              :rows="4"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="restData">取消</el-button>
          <el-button
            type="primary"
            @click="dialogStatus === '创建' ? createData() : updateData()"
          >确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '@/api/weekly/project'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'While',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
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
        name: '',
        remarks: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
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
      getProject(this.listQuery).then(response => {
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
    restTemp() {
      this.temp = {
        name: '',
        remarks: null
      }
    },
    restData() {
      this.dialogFormVisible = false
    },
    handleCreate() {
      this.dialogStatus = '创建'
      this.restTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row)
      this.temp.name = row.name
      this.temp.remarks = row.remarks
      this.listLoading = false
      this.dialogStatus = '编辑'
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createProject(this.temp).then(response => {
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
          updateProject(tempData).then(() => {
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
      const while_id = this.deleteRowData.id
      deleteProject(while_id).then(() => {
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
