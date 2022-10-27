<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-input
          v-model="listQuery.search"
          placeholder="创建者"
          style="width: 250px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-date-picker
          v-model="listQuery.datetimeValue"
          type="datetimerange"
          :picker-options="pickerOptions2"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="创建时间"
          end-placeholder="结束日期"
          class="datetime"
          @keyup.enter.native="handleFilter"
        />
        <el-date-picker
          v-model="listQuery.startTimeValue"
          type="datetimerange"
          :picker-options="pickerOptions2"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束日期"
          class="datetime"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div class="filter-container">
        <el-input
          v-model="listQuery.applicant"
          placeholder="申请人"
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
        <el-button
          icon="el-icon-refresh"
          class="filter-item"
          type="info"
          @click="resetQuery"
        >重置</el-button>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-top: 10px;">
      <div class="add-container">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >添加
        </el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >导出</el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-upload2"
          @click="handleExcelUpdate"
        >导入</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="right"
              label-width="70px"
              class="demo-table-expand"
            >
              <el-form-item label="ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="开始时间">
                <span>{{ props.row.start_time }}</span>
              </el-form-item>
              <el-form-item label="类别">
                <span>{{ props.row.weekly_type }}</span>
              </el-form-item>
              <el-form-item label="申请人">
                <span>{{ props.row.applicant }}</span>
              </el-form-item>
              <el-form-item label="涉及系统">
                <span>{{ props.row.weekly_project }}</span>
              </el-form-item>
              <el-form-item label="操作内容">
                <span style="white-space: pre-wrap">{{
                  props.row.operation_text
                }}</span>
              </el-form-item>
              <el-form-item label="处理结果">
                <span>{{ props.row.result }}</span>
              </el-form-item>
              <el-form-item label="创建者">
                <span>{{ props.row.create_by_user }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.create_time }}</span>
              </el-form-item>
              <el-form-item label="修改者">
                <span>{{ props.row.chage_by_user }}</span>
              </el-form-item>
              <el-form-item label="修改时间">
                <span>{{ props.row.last_change_time }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="35" />
        <el-table-column
          label="ID"
          prop="id"
          sortable="custom"
          align="center"
          width="70"
        />
        <el-table-column
          label="开始时间"
          prop="start_time"
          min-width="100px"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="类别"
          prop="weekly_type"
          min-width="90px"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="申请人"
          prop="applicant"
          min-width="60px"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="涉及系统"
          prop="weekly_project"
          min-width="90px"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作内容"
          prop="operation_text"
          min-width="90px"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="处理结果"
          prop="result"
          min-width="60px"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="创建者"
          prop="create_by_user"
          align="center"
          min-width="90"
          class-name="small-padding fixed-width"
          show-overflow-tooltip
        />
        <el-table-column
          label="创建时间"
          prop="create_time"
          sortable="custom"
          align="center"
          min-width="100"
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
      <el-dialog
        title="上传excel"
        :visible.sync="confirmUpdate"
        :before-close="restExcelUpdate"
        width="50%"
        :close-on-click-modal="modalStatus"
      >
        <el-card class="box-card">
          <upload-excel-component
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          />
        </el-card>
        <div slot="footer" class="dialog-footer">
          <el-button @click="restExcelUpdate">取消</el-button>
          <el-button type="primary" @click="batch_create()">导入 </el-button>
        </div>
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
        width="60%"
        :close-on-click-modal="modalStatus"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="90px"
          class="transfer-class"
        >
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker
              v-model="temp.start_time"
              type="datetime"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              placeholder="选择日期时间"
              class="datetime"
            />
          </el-form-item>
          <el-form-item label="类别" prop="type_id">
            <el-select
              v-model="temp.type_id"
              class="filter-item"
              placeholder="类别"
              style="width: 220px"
            >
              <el-option
                v-for="item in HandleType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="申请人" prop="applicant">
            <el-input
              v-model.trim="temp.applicant"
              placeholder="申请人"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="涉及系统" prop="project_id">
            <el-select
              v-model="temp.project_id"
              class="filter-item"
              placeholder="涉及系统"
              style="width: 220px"
            >
              <el-option
                v-for="item in Project"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="操作内容">
            <el-input
              v-model="temp.operation_text"
              type="textarea"
              style="width: 80%"
              :rows="8"
              placeholder="请输入处理明细"
            />
          </el-form-item>
          <el-form-item label="处理结果" prop="result">
            <el-select
              v-model="temp.result"
              class="filter-item"
              placeholder="处理结果"
              prop="result"
              style="width: 220px"
            >
              <el-option
                v-for="item in Result"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
  getReport,
  createReport,
  updateReport,
  deleteReport,
  createReports
} from '@/api/weekly/report'
import { getHandleTypeInfo } from '@/api/weekly/handlyType'
import { getProjectInfo } from '@/api/weekly/project'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'While',
  components: { Pagination, UploadExcelComponent },
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
        order: '-id',
        datetimeValue: '',
        startTimeValue: '',
        applicant: ''
      },
      groupsPermissions: [],
      temp: {
        start_time: new Date(),
        type_id: '',
        applicant: '',
        project_id: '',
        operation_text: null,
        result: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      HandleType: [],
      Project: [],
      Result: [
        { label: '处理中', value: '处理中' },
        { label: '处理完成', value: '处理完成' }
      ],
      multipleSelection: [],
      rules: {
        start_time: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ],
        type_id: [{ required: true, message: '类别不能为空', trigger: 'blur' }],
        applicant: [
          { required: true, message: '申请人不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        project_id: [
          { required: true, message: '涉及系统不能为空', trigger: 'blur' }
        ],
        result: [
          { required: true, message: '处理结果不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      confirmUpdate: false,
      uploadTableData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              )
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              )
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              )
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      filterVal: [
        'id',
        'start_time',
        'weekly_type',
        'applicant',
        'weekly_project',
        'operation_text',
        'result',
        'create_by_user',
        'create_time',
        'chage_by_user',
        'last_change_time'
      ],
      tHeader: [
        'id',
        '开始时间',
        '类别',
        '申请人',
        '涉及系统',
        '操作内容',
        '处理结果',
        '创建者',
        '创建时间',
        '修改者',
        '修改时间'
      ]
    }
  },
  created() {
    this.getList()
    this.getHandleTypes()
    this.getProjects()
  },
  methods: {
    getList(obj) {
      this.listLoading = true
      getReport(this.listQuery).then(response => {
        this.list = response.detail
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetQuery() {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        name: '',
        search: '',
        order: '-id',
        datetimeValue: '',
        startTimeValue: '',
        applicant: ''
      }
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
      this.operationContent = ''
      this.temp = {
        start_time: new Date(),
        type_id: '',
        applicant: '',
        project_id: '',
        operation_text: null,
        result: ''
      }
    },
    restData() {
      this.dialogFormVisible = false
    },
    getHandleTypes() {
      getHandleTypeInfo().then(response => {
        this.HandleType = response.detail
      })
    },
    getProjects() {
      getProjectInfo().then(response => {
        this.Project = response.detail
      })
    },
    handleCreate() {
      this.dialogStatus = '创建'
      this.restTemp()
      this.getHandleTypes()
      this.getProjects()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row)
      this.getHandleTypes()
      this.getProjects()
      this.restTemp()
      this.temp.id = row.id
      this.temp.start_time = row.start_time
      this.HandleType.forEach(el => {
        if (el.name === row.weekly_type) {
          this.temp.type_id = el.id
        }
      })
      this.temp.applicant = row.applicant
      this.Project.forEach(el => {
        if (el.name === row.weekly_project) {
          this.temp.project_id = el.id
        }
      })
      this.temp.operation_text = row.operation_text
      this.temp.result = row.result
      this.listLoading = false
      this.dialogStatus = '编辑'
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createReport(this.temp).then(response => {
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
          updateReport(tempData).then(() => {
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
      this.$confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteReport(row.id).then(() => {
            this.getList()
            this.$message({
              title: 'Success',
              message: `删除成功`,
              type: 'success',
              duration: 2000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDownload() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          title: 'warning',
          message: `勾选后再导出`,
          type: 'warning',
          duration: 2000
        })
      } else {
        this.download()
      }
    },
    download() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const data = this.formatJson(this.filterVal, this.multipleSelection)
        console.log(data)
        excel.export_json_to_excel({
          header: this.tHeader,
          data,
          filename: '周报'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'start_time') {
            return parseTime(v[j])
          } else if (j === 'create_time') {
            return parseTime(v[j])
          } else if (j === 'last_change_time') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10

      if (isLt10M) {
        return true
      } else {
        this.$notify({
          title: '警告',
          message: '附件不能大于10MB',
          type: 'warning'
        })
      }
    },
    handleExcelUpdate() {
      this.confirmUpdate = true
    },
    restExcelUpdate() {
      this.confirmUpdate = false
      this.uploadTableData = []
    },
    handleSuccess({ results, header }) {
      if (header.sort().toString() === this.tHeader.sort().toString()) {
        this.getHandleTypes()
        this.getProjects()
        const result = []
        results.forEach(el => {
          const ret = {}
          let type_id
          let project_id
          this.HandleType.forEach(el2 => {
            if (el2['name'] === el['类别']) {
              type_id = el2.id
            }
          })
          this.Project.forEach(el2 => {
            if (el2['name'] === el['涉及系统']) {
              project_id = el2.id
            }
          })
          ret['start_time'] = el['开始时间']
          ret['type_id'] = type_id || 0
          ret['applicant'] = el['申请人']
          ret['project_id'] = project_id || 0
          ret['operation_text'] = el['操作内容']
          ret['result'] = el['处理结果']
          result.push(ret)
        })
        this.uploadTableData = result
      } else {
        this.restExcelUpdate()
        this.$message({
          title: 'error',
          message: `错误的excel表格`,
          type: 'error',
          duration: 2000
        })
      }
    },
    batch_create() {
      console.log(this.uploadTableData)
      createReports(this.uploadTableData).then(response => {
        this.restExcelUpdate()
        this.getList()
        this.$message({
          title: 'Success',
          message: `导入成功`,
          type: 'success',
          duration: 2000
        })
      })
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.editor-container {
  margin-bottom: 30px;
}
</style>
