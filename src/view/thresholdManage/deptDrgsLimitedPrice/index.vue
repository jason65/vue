<template>
  <div>
    <kindo-card-search>
      <el-form :inline="true" :model="searchForm" ref="searchForm" label-position="right" label-width="120px">
        <el-form-item label="主要诊断/编码：">
          <el-input v-model="searchForm.zddm" style="width:160px"></el-input>
        </el-form-item>
        <el-form-item label="参保类型：">
          <el-select v-model="searchForm.yblx" style="width:160px">
            <el-option v-for="item in source.sourceHtdm" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
          <el-button icon="el-icon-plus" @click="add">新增</el-button>
          <el-button icon="el-icon-download" @click="exportt">导出</el-button>
        </el-form-item>
      </el-form>
    </kindo-card-search>

    <kindo-table ref="table" :url="api.getListData" :queryParam="searchForm">
      <el-table-column width="120" label="诊断编码" prop="zddm" align="left" header-align="center" show-overflow-tooltip></el-table-column>
      <el-table-column width="120" label="主要诊断" prop="zdmc" align="left" header-align="center" show-overflow-tooltip></el-table-column>
      <el-table-column width="160" label="主要操作/治疗方式" prop="czmc" align="left" header-align="center" show-overflow-tooltip></el-table-column>
      <el-table-column width="120" label="限价标准" prop="xjbz" align="rigth" header-align="center" show-overflow-tooltip></el-table-column>
      <el-table-column width="120" label="除外内容" prop="cwnr" align="left" header-align="center" show-overflow-tooltip></el-table-column>
      <el-table-column min-width="120" label="备注" prop="demo" align="left" header-align="center" show-overflow-tooltip></el-table-column>
      <el-table-column width="100" label="操作" prop="GENERATE_DATE" align="center" header-align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="upd(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </kindo-table>

    <el-dialog title="单病种限价标准" :visible.sync="dialogVisible">
      <el-form ref="detailForm" :model="detailForm" label-width="160px" :inline="true">
        <el-form-item label="诊断编码:">
          <el-input v-model="detailForm.zddm"></el-input>
        </el-form-item><br>
        <el-form-item label="主要诊断:">
          <el-input v-model="detailForm.zdmc"></el-input>
        </el-form-item><br>
        <el-form-item label="主要操作/治疗方式:">
          <el-input v-model="detailForm.czdm"></el-input>
        </el-form-item><br>
        <el-form-item label="限价标准:">
          <el-input v-model="detailForm.xjbz"></el-input>
        </el-form-item><br>
        <el-form-item label="除外内容:">
          <el-input v-model="detailForm.cwnr"></el-input>
        </el-form-item><br>
        <el-form-item label="备注:">
          <el-input v-model="detailForm.demo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="save" type="primary" icon="el-icon-check">保存</el-button>
        <el-button @click="dialogVisible=false" icon="el-icon-close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script scoped>
import config from './config'

let tempSearchForm = {
  id: '',
  zddm: '',
  zdmc: '',
  czdm: '',
  xjbz: '',
  cwnr: '',
  demo: ''
}
export default {
  data() {
    return {
      api: {
        getListData: config.api.queryPriceLimitList
      },
      searchForm: {
        zddm: '',
        yblx: ''
      },
      source: {
        sourceHtdm: []
      },
      dialogVisible: false,
      detailForm: {
        id: '',
        zddm: '',
        zdmc: '',
        czdm: '',
        xjbz: '',
        cwnr: '',
        demo: ''
      }
    }
  },
  created() {
    kindo.dictionary.getDictionary('CBLX_CODE').then(res => {
      this.source.sourceHtdm = res
    })
  },
  methods: {
    getData() {
      this.$refs.table.reloadData()
    },
    add() {
      this.dialogVisible = true
      Object.assign(this.detailForm, tempSearchForm)
    },
    save() {
      let url = config.api.addPriceLimit
      if (this.detailForm.id) {
        url = config.api.editPriceLimit
      }
      this.$http.post(url, this.detailForm).then(res => {
        if (res.code === 200 || res.code === '200') {
          kindo.util.alert('保存成功')
          this.dialogVisible = false
          this.getData()
        } else {
          kindo.util.alert(res.message, '提示', 'error')
        }
      })
    },
    upd(row) {
      Object.assign(this.detailForm, row)
      this.dialogVisible = true
    },
    del(row) {
      kindo.util.confirm('是否删除？', '提示', 'info', () => {
        this.$http.post(config.api.deletePriceLimit, row).then(res => {
          if (res.code === 200 || res.code === '200') {
            kindo.util.alert('删除成功')
            this.getData()
          } else {
            kindo.util.alert(res.message, '提示', 'error')
          }
        })
      })
    },
    exportt() {
      kindo.util.downloadFile(config.api.exportPriceLimitList, this.searchForm)
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getData()
    })
  }
}
</script>
<style scoped>
</style>


