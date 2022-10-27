<template>
  <div>
    <div class="filter-container">
      <el-checkbox-group v-model="formThead">
        <el-checkbox v-for="i in titles" :key="i" :label="i">
          {{ i }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="tableSort"
      @selection-change="handleSelectionChange"
    >
      >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="70" class-name="small-padding fixed-width" />
      <el-table-column label="资产编号" prop="assetnum" sortable align="center" min-width="100px" class-name="small-padding fixed-width" />
      <el-table-column label="资产名称" prop="assetname" sortable min-width="100px" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="资产型号" prop="assetmodel" sortable align="center" min-width="100px" class-name="small-padding fixed-width" />
      <el-table-column v-for="label in formThead" :key="label" :label="label" min-width="100px" sortable align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          {{ scope.row[label] }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" sortable="custom" align="center" min-width="70px" class-name="small-padding fixed-width" :formatter="formatter" />
      <el-table-column label="描述" prop="remark" sortable="custom" align="center" min-width="150px" class-name="small-padding fixed-width" show-overflow-tooltip />
      <el-table-column label="添加时间" prop="add_time" sortable="custom" align="center" min-width="140px" class-name="small-padding fixed-width" />
      <el-table-column label="更新时间" prop="update_time" sortable="custom" align="center" min-width="140px" class-name="small-padding fixed-width" />
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    titles: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      formThead: [],
      multipleSelection: []
    }
  },
  methods: {
    tableSort: function(column) {
      this.$emit('tableSort', column)
    },
    handleUpdate: function(row) {
      this.$emit('handleUpdate', row)
    },
    handleDelete: function(row, index) {
      this.$emit('handleDelete', row, index)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    formatter(row, column) {
      return row.status ? '启用' : '禁用'
    }
  }
}
</script>

<style lang="scss">
.el-tooltip__popper{
  max-width:50%
}
</style>
