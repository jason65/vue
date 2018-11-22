/*
 * @Author: litianye 
 * @Description: 日志查看 
 * @Date: 2018-07-19 11:48:37 
 * @Last Modified by: 
 * @Last Modified time: 
 */

<template>
  <div>
    <kindo-card-search>
      <el-form :model="view.model" label-width="100px" inline @submit.native.prevent @keyup.enter.native="get">
        <el-form-item label="上传时间">
          <el-date-picker class="half" v-model="view.model.startDate" :picker-options="{disabledDate:TimeDisabledST}" value-format="yyyy-MM-dd" placeholder=" "></el-date-picker>
          <span class="half line">-</span>
          <el-date-picker class="half" v-model="view.model.endDate" :picker-options="{disabledDate:TimeDisabledEND}" value-format="yyyy-MM-dd" placeholder=" "></el-date-picker>
        </el-form-item>
        <el-form-item label="操作用户">
          <el-input v-model.trim="view.model.userName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="get">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form slot="more" :model="view.model" label-width="100px" inline @submit.native.prevent @keyup.enter.native="get">
        <el-form-item label="API路径">
          <el-input v-model.trim="view.model.apiUrl" placeholder=""></el-input>
        </el-form-item>
      </el-form>
    </kindo-card-search>

    <kindo-card title="日志明细" collapse>
      <kindo-table ref="table" :url="config.api.get" :queryParam="view.model">
        <el-table-column width="140" label="记录ID" prop="id" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="TOKEN" prop="token" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" label="操作用户" prop="userName" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="100" label="API路径" prop="apiUrl" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column width="110" label="访问IP" prop="remoteAddr" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="菜单(功能模块)" prop="menuModel" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" label="请求访问" prop="httpMethod" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="100" label="请求参数" prop="parameters" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="请求结果状态码" prop="responseCode" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="请求结果消息" prop="responseMessage" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="操作时间" prop="operDate" align="right" show-overflow-tooltip></el-table-column>
      </kindo-table>
    </kindo-card>
  </div>
</template>

<script>
import config from "./config";

export default {
  data() {
    return {
      config,
      view: {
        model: {
          userName: "",
          apiUrl: "",
          startDate: new Date().proDate("{%d-7}").formatDate("yyyy-MM-dd"),
          endDate: new Date().formatDate("yyyy-MM-dd")
        }
      }
    };
  },

  mounted() {
    this.$nextTick(function() {
      this.get();
    });
  },

  methods: {
    // 验证查询时间
    TimeDisabledST(v) {
      if (Date.parse(v) > Date.parse(this.view.model.endDate)) {
        return true;
      } else {
        return false;
      }
    },
    TimeDisabledEND(v) {
      if (Date.parse(v) - Date.parse(this.view.model.startDate) <= -86400000) {
        return true;
      } else {
        return false;
      }
    },
    get() {
      this.$refs.table.reloadData();
    },
    // 点击查看详情
    handleClick() {}
  }
};
</script>

<style>
</style>
