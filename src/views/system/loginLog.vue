<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-input
          v-model="listQuery.search"
          placeholder="账号"
          style="width: 250px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-date-picker
          v-model="listQuery.datetimeValue"
          type="datetimerange"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="datetime"
          @change="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
      </div>
      <div class="add-container">
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >导出</el-button>
      </div>
      <el-table
        id="table"
        v-loading="listLoading"
        :data="list"
        :row-class-name="tableRowClassName"
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="35" />
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
          min-width="50px"
          align="center"
          class-name="small-padding fixed-width"
        />
        <el-table-column
          label="用户名"
          prop="user_name"
          min-width="50px"
          align="center"
          class-name="small-padding fixed-width"
        />
        <el-table-column
          label="登录ip"
          prop="login_ip"
          min-width="60px"
          align="center"
          class-name="small-padding fixed-width"
        />
        <el-table-column
          label="token"
          prop="access_token"
          min-width="120px"
          align="center"
          class-name="small-padding fixed-width"
          show-overflow-tooltip
        />
        <el-table-column
          label="浏览器"
          prop="browser"
          align="center"
          min-width="200"
          class-name="small-padding fixed-width"
          show-overflow-tooltip
        />
        <el-table-column
          label="状态"
          prop="is_success"
          min-width="35px"
          align="center"
          :formatter="formatter"
        />
        <el-table-column
          label="登录时间"
          prop="create_time"
          sortable="custom"
          align="center"
          min-width="90"
          class-name="small-padding fixed-width"
        />
      </el-table>
      <pagination
        v-show="total > 10"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import { getLoginLog } from '@/api/loginLog'
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
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: '',
        search: '',
        order: '-id',
        datetimeValue: ''
      },
      downloadLoading: false,
      multipleSelection: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(obj) {
      this.listLoading = true
      getLoginLog(this.listQuery).then(response => {
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
        const tHeader = [
          'id',
          '账号',
          '用户名',
          '登录ip',
          '状态',
          'token',
          '浏览器',
          '登录时间'
        ]
        const filterVal = [
          'id',
          'account',
          'user_name',
          'login_ip',
          'is_success',
          'access_token',
          'browser',
          'create_time'
        ]
        const data = this.formatJson(filterVal, this.multipleSelection)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '登录日志'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, data) {
      return data.map(v =>
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
    },
    formatter(row, column) {
      return row.is_success ? '登录成功' : '登录失败'
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.is_success === true) {
        return 'success-row'
      } else {
        return 'warning-row'
      }
    }
  }
}
</script>

<style lang="scss">
.datetime {
  position: relative;
  bottom: 4px;
}

#table .warning-row {
  background: oldlace;
}

#table .success-row {
  background: #f0f9eb;
}
</style>
