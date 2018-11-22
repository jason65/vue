/*
 * @Author: llz 
 * @Description: 住院违规明细 
 * @Date: 2018-07-19 11:48:37 
 * @Last Modified by: 
 * @Last Modified time: 
 */

<template>
  <div>
    <kindo-card-search>
      <el-form :model="search" label-width="120px" inline @submit.native.prevent @keyup.enter.native="get">
        <el-form-item label="开立时间">
          <el-date-picker class="half" v-model="search.startDate" :editable="false" :clearable="false" :picker-options="{disabledDate:TimeDisabledST}" value-format="yyyy-MM-dd" placeholder=" "></el-date-picker>
          <span class="half line">-</span>
          <el-date-picker class="half" v-model="search.endDate" :editable="false" :clearable="false" :picker-options="{disabledDate:TimeDisabledEND}" value-format="yyyy-MM-dd" placeholder=" "></el-date-picker>
        </el-form-item>
        <el-form-item label="院区">
          <el-checkbox-group v-model="searchYq" :min="1" :max="2">
            <el-checkbox v-for="city in yqList" :label="city.value" :key="city.value">{{city.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="科室名称/编码">
          <el-input v-model.trim="search.deptCode" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="get">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-form slot="more" :model="search" label-width="120px" inline @submit.native.prevent @keyup.enter.native="get">
        <el-form-item label="科室名称/编码">
          <el-input v-model.trim="search.deptCode" placeholder=""></el-input>
        </el-form-item>
      </el-form> -->
    </kindo-card-search>

    <kindo-card title="住院违规明细数据" collapse>
      <!-- <template slot="control">
        <el-button icon="el-icon-download" @click="download">导出</el-button>
      </template> -->
      <kindo-table ref="table" :url="config.api.get" :queryParam="search">
        <el-table-column width="140" label="科室名称" prop="deptName" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="主要诊断" prop="zyzdmc" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="诊断编码" prop="zyzdbm" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="100" label="违规名称" prop="wgmc" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="120" label="违规描述" prop="wgms" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="90" label="违规次数" prop="wgcs" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="90" label="违规人数" prop="wgrs" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="违规总金额" prop="cost" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="60" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看明细</el-button>
          </template>
        </el-table-column>
      </kindo-table>
    </kindo-card>
    <!-- title有科室名称-违规名称组成 -->
    <el-dialog :title="dialogTitle" v-drag :visible.sync="dialogVisible" width="80%">
      <kindo-card-search>
        <el-form :model="diaSearch" label-width="130px" inline @submit.native.prevent @keyup.enter.native="diaGet">
          <el-form-item label="开立医生姓名/工号" prop="ysdm">
            <el-input v-model.trim="diaSearch.ysdm" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="住院号" prop="jzlsh">
            <el-input v-model.trim="diaSearch.jzlsh" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="diaGet">查询</el-button>
            <el-button icon="el-icon-download" @click="diaDownload">导出</el-button>
          </el-form-item>
        </el-form>
      </kindo-card-search>
      <kindo-card title="违规明细数据汇总" collapse>
        <kindo-table ref="diaTable" :url="config.api.get" :queryParam="diaSearch">
          <el-table-column min-width="120" label="规则名称" prop="wgms" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="120" label="医嘱项目名称" prop="yzxmmc" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="120" label="项目类型" prop="xmlx" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <!-- 西药、中成药、中草药、检查、检验 -->
          <el-table-column width="80" label="患者姓名" prop="hzxm" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" label="住院号" prop="jzlsh" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" label="床位号" prop="ch" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="数量" prop="sj" align="right" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="单价" prop="dj" align="right" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" label="金额" prop="je" align="right" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="开立时间" prop="klrq" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="开立医生" prop="ysxm" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="医生工号" prop="ysdm" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="120" label="主诊断名称" prop="zyzdmc" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" label="参保类型" prop="cblx" align="left" header-align="center" show-overflow-tooltip :formatter="(row,column)=>{return kindo.dictionary.getLabel(source.CBLX_CODE,row.CBLX_CODE)}"></el-table-column>
        </kindo-table>
      </kindo-card>
    </el-dialog>
  </div>
</template>

<script>
import config from './config'

export default {
  components: {},
  data() {
    return {
      config,
      yqList: [],
      searchYq: [],
      search: {
        startDate: new Date().proDate('{%d-7}').formatDate('yyyy-MM-dd'),
        endDate: new Date().formatDate('yyyy-MM-dd'),
        yqbmList: '',
        deptCode: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      diaSearch: {
        deptCode: '',
        ysdm: '',
        jzlsh: '',
        zyzdbm: '',
        wgCode: '',
        startDate: '',
        endDate: '',
        yqbmList: ''
      },
      source: {
        CBLX_CODE: []
      }
    }
  },

  async mounted() {
    // kindo.dictionary.get('HOS_REGION').then(res => {
    //   this.yqList = res
    //   let yqbmList = res.map(item => {
    //     return item.value
    //   })
    //   this.searchYq = yqbmList.slice()
    //   this.$nextTick(() => {
    //     this.$refs.table.reloadData()
    //   })
    // })
    let result = await kindo.dictionary.get('HOS_REGION')
    this.yqList = result
    let yqbmList = result.map(item => {
      return item.value
    })
    this.searchYq = yqbmList.slice()
    this.$nextTick(() => {
      this.$refs.table.reloadData()
    })
  },
  created() {
    this._diaSearch = Object.assign({}, this.diaSearch)
  },
  methods: {
    // 验证查询时间
    TimeDisabledST(v) {
      if (Date.parse(v) > Date.parse(this.search.endDate)) {
        return true
      } else {
        return false
      }
    },
    TimeDisabledEND(v) {
      if (Date.parse(v) - Date.parse(this.search.startDate) <= -86400000) {
        return true
      } else {
        return false
      }
    },
    get() {
      this.$refs.table.reloadData()
    },
    diaGet() {
      this.$refs.diaTable.reloadData()
    },
    diaDownload() {
      kindo.util.downloadFile(config.api.export, this.diaSearch)
    },
    handleClick(row) {
      this.dialogVisible = true
      this.dialogTitle = row.deptName + '的' + row.wgmc + '明细数据'
      let rowParams = { deptCode: row.deptCode, zyzdbm: row.zyzdbm, wgCode: row.wgCode }
      this.diaSearch = Object.assign({}, this._diaSearch, this.search, rowParams)
      this.$nextTick(() => {
        this.$ref.diaTable.reloadData()
      })
    }
  },
  watch: {
    searchYq: function(val) {
      this.search.yqbmList = val.toString()
    }
  }
}
</script>

<style>
</style>
