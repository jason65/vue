<!--
 *
 *      决策分析-全院额度使用情况
 -->
<template>
  <div>
    <!--查询条件-->
    <kindo-card-search>
      <el-form :inline="true" :model="search" label-position="right" class="demo-form-inline">
        <el-form-item label="年度">
          <el-date-picker v-model="search.year" class="half" :editable="false" :clearable="false" type="year" placeholder=" "></el-date-picker>
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="search.deptCode" style="width:160px">
            <el-option label="全部" value="all"></el-option>
            <el-option v-for="item in deptList" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参保类型：" prop="cblx">
          <el-select v-model="search.cblx" style="width:160px">
            <el-option v-for="item in sourceHtdm" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
          <el-button type="primary" icon="el-icon-download" @click="exportTable">导出</el-button>
        </el-form-item>
      </el-form>
    </kindo-card-search>
    <kindo-card title="医保费用使用情况">
      <el-row>
        <el-col :span="6"><span style="font-size:15px;">上年度实际医保费用:</span><span style="margin-left:8px;font-weight: bold;">{{unqieData.last}}(万元)</span></el-col>
        <el-col :span="18"><span style="font-size:15px;">本年度医保额度:</span><span style="margin-left:8px; font-weight: bold;">{{unqieData.current}}(万元)</span></el-col>
      </el-row>
    </kindo-card>
    <kindo-card title="科室额度分配详情(元)" collapse>
      <!-- <template slot="control">
        <el-button icon="el-icon-download" @click="download">导出</el-button>
      </template> -->
      <kindo-table ref="table" :url="config.api.get" :queryParam="search" :loaded="loadedData" :summary-method="getSummaries" :show-summary="true">
        <el-table-column min-width="130" fixed="left" label="科室名称" prop="deptName" show-overflow-tooltip></el-table-column>
        <el-table-column width="130" fixed="left" label="上年度实际医保费用" prop="prevYbfy" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="130" fixed="left" label="本年度应分配额度" prop="bnyfped" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="106" fixed="left" label="本年度剩余额度" prop="bnsyed" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="1月" prop="m1" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="2月" prop="m2" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="3月" prop="m3" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="4月" prop="m4" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="5月" prop="m5" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="6月" prop="m6" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="7月" prop="m7" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="8月" prop="m8" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="9月" prop="m9" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="10月" prop="m10" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="11月" prop="m11" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="92" label="12月" prop="m12" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
      </kindo-table>
    </kindo-card>
  </div>
</template>

<script>
import config from './config'
import kindoColorbox from '@/components/kindo-colorbox'
export default {
  components: {
    'kindo-colorbox': kindoColorbox
  },
  data() {
    return {
      config,
      searchYq: ['1', '2'],
      /* 公共部分 */
      search: {
        year: new Date().getFullYear().toString(),
        deptCode: 'all',
        cblx: ''
      },
      unqieData: {
        last: '',
        current: ''
      },
      footerData: [],
      sourceHtdm: [],
      deptList: [],
      tableData: []
    }
  },
  created() {
    if (kindo.cache.get('USER_INFO').userDataOrgaList && kindo.cache.get('USER_INFO').userDataOrgaList.length > 0) {
      for (let qq = 0; qq < kindo.cache.get('USER_INFO').userDataOrgaList.length; qq++) {
        if (kindo.cache.get('USER_INFO').userDataOrgaList[qq].id !== '0') {
          let params = Object.assign({}, kindo.cache.get('USER_INFO').userDataOrgaList[qq])
          this.deptList.push({ label: params.orgaName, value: params.orgaCode })
        }
      }
    }
  },

  mounted() {
    kindo.dictionary.getDictionary('CBLX_CODE').then(res => {
      this.sourceHtdm = res
      this.search.cblx = res[0].value
      this.getData()
    })
  },

  methods: {
    getData() {
      this.$refs.table.reloadData()
    },
    loadedData(res) {
      let unqieData = res.data.footer
      this.unqieData.last = kindo.util.formatNum(unqieData.z_prevUseQuota)
      this.unqieData.current = kindo.util.formatNum(unqieData.z_bnfped)
      // 合计的返回数据
      let f = res.data.footer.hj
      let prevYbfy = kindo.util.formatNum(f.prevYbfy)
      let bnfped = kindo.util.formatNum(f.bnfped)
      let bnsyed = kindo.util.formatNum(f.bnsyed)
      let m1 = kindo.util.formatNum(f.m1)
      let m2 = kindo.util.formatNum(f.m2)
      let m3 = kindo.util.formatNum(f.m3)
      let m4 = kindo.util.formatNum(f.m4)
      let m5 = kindo.util.formatNum(f.m5)
      let m6 = kindo.util.formatNum(f.m6)
      let m7 = kindo.util.formatNum(f.m7)
      let m8 = kindo.util.formatNum(f.m8)
      let m9 = kindo.util.formatNum(f.m9)
      let m10 = kindo.util.formatNum(f.m10)
      let m11 = kindo.util.formatNum(f.m11)
      let m12 = kindo.util.formatNum(f.m12)
      this.footerData = ['', '合计', prevYbfy, bnfped, bnsyed, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12]
    },
    getSummaries() {
      return this.footerData
    },
    exportTable() {
      kindo.util.downloadFile(config.api.exportTable, this.search)
    }
  },
  watch: {
    'search.year': function(val) {
      if (typeof val !== 'string') {
        this.search.year = new Date(val).getFullYear().toString()
      }
    }
  }
}
</script>
<style scoped>
.el-date-editor.el-input {
  width: 120px;
}

.tips-container {
  margin-left: 1.7%;
}

.bgblue {
  width: 95%;
  margin: 10px auto;
  border-radius: 10px;
  border: 1px solid #d4d4d4;
  background: #fff;
  text-align: center;
  padding-top: 10px;
}

.title {
  font-size: 14px;
  color: #838383;
}

.content {
  margin: 12px 0 10px 0;
  font-size: 30px;
  color: #0875c8;
}
.exportTitle {
  display: inline-block;
  margin-right: 8px;
}
.exportSpan {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #03bdd6;
  color: #fff;
  cursor: pointer;
}
</style>

