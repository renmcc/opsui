<template>
  <el-dialog v-el-drag-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" width="50%" :before-close="closeDialog">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="right" label-width="90px" class="transfer-class">
      <el-form-item label="资产编号" prop="assetnum">
        <el-input v-model.trim="formData.assetnum" style="width: 90%" placeholder="资产编号" />
      </el-form-item>
      <el-form-item label="资产名称" prop="assetname">
        <el-input v-model.trim="formData.assetname" style="width: 90%" placeholder="资产名称" />
      </el-form-item>
      <el-form-item label="资产型号" prop="assetmodel">
        <el-input v-model.trim="formData.assetmodel" style="width: 90%" placeholder="资产型号" />
      </el-form-item>
      <el-form-item label="资产状态" prop="status">
        <el-switch v-model="formData.status" active-text="启用" inactive-text="禁用" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="4" style="width: 90%" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="restForm">取消</el-button>
      <el-button type="primary" @click="dialogStatus==='添加资产'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'FormDialog',
  // 自定义指令
  directives: { elDragDialog },
  // 获取父组件数据
  props: {
    dialogStatus: {
      type: String,
      default: ''
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    dialogFormdata: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formData: {},
      rules: {
        assetnum: [{ required: true, message: '必填', trigger: 'blur' }],
        assetname: [{ required: true, message: '必填', trigger: 'blur' }],
        assetmodel: [{ required: true, message: '必填', trigger: 'blur' }],
        status: [{ required: false, message: '不必填', trigger: 'blur' }],
        remark: [{ required: false, message: '不必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    dialogFormdata(val) {
      // 子组件不能修改父组件数据，因此深拷贝
      this.formData = JSON.parse(JSON.stringify(this.dialogFormdata))
    }
  },
  methods: {
    restForm: function() {
      this.$emit('restForm')
    },
    closeDialog: function() {
      this.$emit('closeDialog')
    },
    createData: function() {
      this.$emit('createData')
    },
    updateData: function() {
      this.$emit('updateData')
    },
    cleanForm() {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetFormFields() {
      this.$refs['dataForm'].resetFields()
    },
    formObject() {
      return this.$refs['dataForm']
    }
  }
}
</script>

<style scoped>

</style>
