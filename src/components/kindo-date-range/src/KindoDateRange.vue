<template>
  <div class="dateRange" style="display:talbe-row">
    <div style="display:table-cell;width:103px">
      <el-date-picker v-model="bgTime" placeholder="开始日期" type="date" :clearable="false" :editable="false" prefix-icon="clearPrefix" :picker-options="{disabledDate:disabledDateMethod}"></el-date-picker>
    </div>
    <div style="display:table-cell;width:14px;text-align: center;">-</div>
    <div style="display:table-cell;width:103px">
      <el-date-picker v-model="endTime" placeholder="结束日期" type="date" :clearable="false" :editable="false" prefix-icon="clearPrefix" :picker-options="{disabledDate:disabledDateMethod1}"></el-date-picker>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'kindo-date-range',
  props: ['value'],
  methods: {
    disabledDateMethod: function (newDate) {
      if (this.endTime) {
        return newDate > this.endTime
      } else {
        return false
      }
    },
    disabledDateMethod1: function (newDate) {
      if (this.bgTime) {
        return newDate < this.bgTime
      } else {
        return false
      }
    }
  },
  computed: {
    bgTime: {
      get: function () {
        return this.value[0]
      },
      set: function (newValue) {
        Vue.set(this.value, 0, newValue)
      }
    },
    endTime: {
      get: function () {
        return this.value[1]
      },
      set: function (newValue) {
        Vue.set(this.value, 1, newValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dateRange {
  /deep/ .el-date-editor.el-input {
    width: 100%;
  }

  /deep/ .el-input--prefix .el-input__inner {
    padding-left: 10px;
  }

  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 10px;
  }
}
</style>

