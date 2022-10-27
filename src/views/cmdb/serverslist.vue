<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.datetimeValue"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="datetime"
        @change="handleFilter"
      />
      <el-input v-model="listQuery.search" placeholder="搜索" style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <div class="add-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <!-- arguments为固定写法，获取子组件事件参数，为数组   -->
    <unfixed-thead
      ref="unfixed"
      :table-data="list"
      :loading="listLoading"
      :titles="titles"
      @tableSort="sortChange(arguments)"
      @handleUpdate="handleUpdate(arguments)"
      @handleDelete="handleDelete(arguments)"
    />
    <pagination
      v-show="total>10"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog
      title="警告"
      :visible.sync="confirmDelete"
      width="30%"
    >
      <span>确定要删除 <b>{{ deleteRowData.assetnum }}</b> 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetDjalog">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirmDjalog">确 定</el-button>
      </span>
    </el-dialog>
    <form-dialog
      ref="dialogForm"
      :dialog-status="dialogStatus"
      :dialog-form-visible="dialogFormVisible"
      :dialog-formdata="formData"
      @restForm="restForm"
      @closeDialog="closeDialog"
      @createData="createData"
      @updateData="updateData"
    />
  </div>
</template>

<script>
import UnfixedThead from './components/UnfixedThead'
import FormDialog from './components/FormDiaLog'
import { getServersList, createServers, updateServer, deleteServer } from '@/api/serversList'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'ServersList',
  components: { Pagination, UnfixedThead, FormDialog },
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        role: [],
        name: '',
        search: '',
        datetimeValue: [],
        order: '',
        prop: ''
      },
      dialogFormVisible: false,
      dialogStatus: '添加资产',
      downloadLoading: false,
      confirmDelete: false,
      deleteRowData: {},
      rowData: {},
      titles: [],
      formData: {},
      downFileds: []
    }
  },
  watch: {
    list(val) {
      this.titles = []
      this.downFileds = []
      this.formData = {}
      for (const i in this.list[0]) {
        // 导出所有字段
        this.downFileds.push(i)
        // 动态更新可选字段
        if (i !== 'id' &&
          i !== 'assetnum' &&
          i !== 'assetname' &&
          i !== 'assetmodel' &&
          i !== 'status' &&
          i !== 'remark' &&
          i !== 'add_time' &&
          i !== 'update_time') {
          this.titles.push(i)
        }
        // 动态更新表单初始化数据
        if (i !== 'id' && i !== 'add_time' && i !== 'update_time') {
          if (i === 'status') {
            this.formData[i] = true
          } else if (i === 'public_ip' || i === 'private_ip') {
            this.formData[i] = null
          } else {
            this.formData[i] = ''
          }
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(obj) {
      this.listLoading = true
      getServersList(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(column) {
      // 接收子组件传递过来的参数，取第一个参数
      this.listQuery.prop = column[0].prop
      if (column[0].order === 'descending') {
        this.listQuery.order = '-'
      } else {
        this.listQuery.order = ''
      }
      this.getList()
    },
    closeDialog() {
      this.dialogFormVisible = false
    },
    restForm() {
      this.dialogFormVisible = false
      // 清空子组件表单数据
      this.$refs.dialogForm.resetFormFields()
    },
    handleCreate() {
      this.dialogStatus = '添加资产'
      this.dialogFormVisible = true
      // 清除子组件表单使用痕迹
      this.$refs.dialogForm.cleanForm()
    },
    handleUpdate(row) {
      // 深拷贝源行数据
      this.formData = Object.assign({}, row[0])
      this.listLoading = false
      this.dialogStatus = '编辑服务器'
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs.dialogForm.formObject().validate((valid) => {
        if (valid) {
          // 获取子组件表单数据，发送接口
          createServers(this.$refs.dialogForm.formData, 'post').then(response => {
            // 重新获取数据
            this.getList()
            // 关闭弹窗
            this.closeDialog()
            this.$message({
              title: 'Success',
              message: `添加成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs.dialogForm.formObject().validate((valid) => {
        if (valid) {
          // 获取子组件表单数据，发送接口
          updateServer(this.$refs.dialogForm.formData.id, this.$refs.dialogForm.formData, 'patch').then(() => {
            // 重新获取数据
            this.getList()
            // 关闭弹窗
            this.closeDialog()
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
    handleDelete(args) {
      this.confirmDelete = true
      this.deleteRowData = args[0]
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
      deleteServer(this.deleteRowData.id).then(() => {
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
      // 获取子组件数据
      const data = this.$refs.unfixed.multipleSelection
      if (data.length === 0) {
        this.$message({
          title: 'warning',
          message: `勾选后再导出`,
          type: 'warning',
          duration: 2000
        })
      } else {
        this.download(data)
      }
    },
    download(selectData) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '资产编号', '资产名称', '资产型号', '主机名', '公网ip', '内网ip', '操作系统', 'CPU', '内存', '硬盘', '状态', '描述', '添加时间', '更新时间']
        const filterVal = this.downFileds
        const data = this.formatJson(filterVal, selectData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '资产列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, data) {
      return data.map(v => filterVal.map(j => {
        if (j === 'add_time') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
