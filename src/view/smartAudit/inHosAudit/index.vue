/*
 * @Author: llz 
 * @Description: 住院医嘱审核 
 * @Date: 2018-07-19 11:48:37 
 * @Last Modified by: 
 * @Last Modified time: 
 */

<template>
  <div>
    <kindo-card-search>
      <el-form :model="search" label-width="120px" inline @submit.native.prevent @keyup.enter.native="get">
        <el-form-item label="开立时间">
          <el-date-picker class="half" :editable="false" :clearable="false" v-model="search.START_DATE" :picker-options="{disabledDate:TimeDisabledST}" value-format="yyyy-MM-dd" placeholder=" "></el-date-picker>
          <span class="half line">-</span>
          <el-date-picker class="half" :editable="false" :clearable="false" v-model="search.END_DATE" :picker-options="{disabledDate:TimeDisabledEND}" value-format="yyyy-MM-dd" placeholder=" "></el-date-picker>
        </el-form-item>
        <el-form-item label="院区">
          <el-checkbox-group v-model="searchYq" :min="1" :max="2">
            <el-checkbox v-for="city in yqList" :label="city.value" :key="city.value">{{city.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="get">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form slot="more" :model="search" label-width="120px" inline @submit.native.prevent @keyup.enter.native="get">
        <el-form-item label="科室名称/编码">
          <el-input v-model.trim="search.ks" placeholder=""></el-input>
        </el-form-item>
      </el-form>
    </kindo-card-search>

    <kindo-card title="住院医嘱数据汇总" collapse>
      <!-- <template slot="control">
        <el-button icon="el-icon-download" @click="download">导出</el-button>
      </template> -->
      <kindo-table ref="table" :url="config.api.get" :queryParam="search">
        <el-table-column width="140" label="科室名称" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="100" label="违规名称" prop="BAH" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="120" label="违规描述" prop="ZYCS" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="主要诊断" prop="XB" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="诊断编码" prop="RYTJ" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="90" label="违规次数" prop="RYSJ" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="90" label="违规人数" prop="CYSJ" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="90" label="违规金额" prop="CYKB" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" label="在院状态" prop="LYFS" align="left" header-align="center" show-overflow-tooltip></el-table-column>
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
        <el-form :model="diaSearch" label-width="120px" inline @submit.native.prevent @keyup.enter.native="diaGet">
          <el-form-item label="开立医生/工号">
            <el-input v-model.trim="diaSearch.zyh" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="住院号">
            <el-input v-model.trim="diaSearch.zyh" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="diaGet">查询</el-button>
            <el-button icon="el-icon-download" @click="diaDownload">导出</el-button>
          </el-form-item>
        </el-form>
      </kindo-card-search>
      <kindo-card title="违规明细数据汇总" collapse>
        <kindo-table ref="diaTable" :url="config.api.get" :queryParam="diaSearch">
          <el-table-column width="100" label="病人姓名" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="100" label="住院号" prop="BAH" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="80" label="床号" prop="ZYCS" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" label="医保类型" prop="XB" align="left" header-align="center" show-overflow-tooltip :formatter="(row,column)=>{return kindo.dictionary.getLabel(source.CBLX_CODE,row.CBLX_CODE)}"></el-table-column>
          <el-table-column min-width="100" label="项目名称" prop="RYTJ" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="数量" prop="RYSJ" align="right" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="单价" prop="CYSJ" align="right" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" label="金额" prop="CYKB" align="right" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="开立日期" prop="LYFS" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="开立医生" prop="LYFS" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="医生工号" prop="LYFS" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="100" label="主诊断名称" prop="LYFS" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        </kindo-table>
      </kindo-card>
    </el-dialog>
  </div>
</template>

<script>
import config from "./config";

export default {
  components: {},
  data() {
    return {
      config,

      yqList: [{ label: "二院", value: "1" }, { label: "华美", value: "2" }],
      searchYq: ["1", "2"],
      search: {
        START_DATE: new Date().proDate("{%d-1}").formatDate("yyyy-MM-dd"),
        END_DATE: new Date().formatDate("yyyy-MM-dd"),
        yq: "1,2",
        mxb: "",
        ks: "",
        mzId: ""
      },
      dialogVisible: false,
      dialogTitle: "",
      diaSearch: {
        zyh: ""
      },
      source: {
        CBLX_CODE: []
      }
    };
  },

  mounted() {
    this.$nextTick(function() {
      // this.get();
    });
  },
  async created() {},
  methods: {
    // 验证查询时间
    TimeDisabledST(v) {
      if (Date.parse(v) > Date.parse(this.search.END_DATE)) {
        return true;
      } else {
        return false;
      }
    },
    TimeDisabledEND(v) {
      if (Date.parse(v) - Date.parse(this.search.START_DATE) <= -86400000) {
        return true;
      } else {
        return false;
      }
    },
    get() {
      console.log(this.search);
      this.dialogVisible = true;
      // this.$refs.table.reloadData();
    },
    diaGet() {
      console.log(this.search);
      // this.$refs.table.reloadData();
    },
    diaDownload() {
      console.log(this.search);
      // kindo.util.downloadFile(config.api.export, this.search);
    },
    handleClick(row) {
      console.log(row);
    }
  },
  watch: {
    searchYq: function(val) {
      this.search.yq = val.toString();
    }
  }
};
</script>

<style>
</style>
