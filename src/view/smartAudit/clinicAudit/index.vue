/*
 * @Author: llz 
 * @Description: 门诊慢性病处方实时监控 
 * @Date: 2018-07-19 11:48:37 
 * @Last Modified by: 
 * @Last Modified time: 
 */

<template>
  <div>
    <kindo-card-search>
      <el-form :model="search" label-width="120px" inline @submit.native.prevent @keyup.enter.native="get">
        <el-form-item label="上传时间">
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
        <el-form-item label="慢性病名">
          <el-input v-model.trim="search.mxb" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="科室名称">
          <el-input v-model.trim="search.ks" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="门诊(身份证)号">
          <el-input v-model.trim="search.mzId" placeholder=""></el-input>
        </el-form-item>
      </el-form>
    </kindo-card-search>

    <kindo-card title="慢性病数据汇总" collapse>
      <!-- <template slot="control">
        <el-button icon="el-icon-download" @click="download">导出</el-button>
      </template> -->
      <kindo-table ref="table" :url="config.api.get" :queryParam="search">
        <el-table-column width="140" label="违规单据号" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="100" label="慢性病名称" prop="HOS_NAME" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="100" label="违规名称" prop="BAH" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="120" label="违规描述" prop="ZYCS" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="门诊号" prop="XB" align="left" header-align="center" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="处方号" prop="RYTJ" align="left" sortable="custom" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="患者姓名" prop="RYSJ" align="left" sortable="custom" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="60" label="年龄" prop="CYSJ" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" label="身份证号" prop="CYKB" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" label="就诊卡号" prop="LYFS" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="80" label="项目名称" prop="BA_TYPE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="60" label="数量" prop="CBLX_CODE" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" label="总金额" prop="ZFY" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" label="开立医生" prop="ZFY" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="80" label="开立科室" prop="ZFY" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" label="开立时间" prop="ZFY" align="center" header-align="center" show-overflow-tooltip></el-table-column>
      </kindo-table>
    </kindo-card>
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
    // 点击导出
    download() {
      kindo.util.downloadFile(config.api.export, this.search);
    },
    get() {
      console.log(this.search);
      // this.$refs.table.reloadData();
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
