<template>
  <div style="display:talbe-row">
    <div :style="{display:'table-cell',width:inputWidth}" id="dateRange1">
      <el-date-picker v-model="bgTime" placeholder="开始日期" :type="type" :clearable="clearable" :editable="false" prefix-icon="clearPrefix" :picker-options="{disabledDate:disabledDateMethod}" :value-format="valueFormat"></el-date-picker>
    </div>
    <div style="display:table-cell;width:14px;text-align: center;">-</div>
    <div :style="{display:'table-cell',width:inputWidth}" id="dateRange2">
      <el-date-picker v-model="endTime" placeholder="结束日期" :type="type" :clearable="clearable" :editable="false" prefix-icon="clearPrefix" :picker-options="{disabledDate:disabledDateMethod1}" :value-format="valueFormat"></el-date-picker>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'kindo-date-range',
  props: {
    value: Array,
    type: {
      default: function() {
        return 'date'
      }
    },
    valueFormat: {
      default: function() {
        return 'yyyy-MM-dd'
      }
    },
    inputWidth: {
      default: function() {
        return '103px'
      }
    },
    clearable: {
      default: function() {
        return true
      }
    }
  },
  methods: {
    disabledDateMethod: function(newDate) {
      if (this.endTime) {
        return new Date(kindo.util.formatDate(newDate)).getTime() > new Date(kindo.util.formatDate(this.endTime)).getTime()
      } else {
        return false
      }
    },
    disabledDateMethod1: function(newDate) {
      if (this.bgTime) {
        return new Date(kindo.util.formatDate(newDate)).getTime() < new Date(kindo.util.formatDate(this.bgTime)).getTime()
      } else {
        return false
      }
    }
  },
  computed: {
    bgTime: {
      get: function() {
        return this.value[0]
      },
      set: function(newValue) {
        Vue.set(this.value, 0, newValue)
      }
    },
    endTime: {
      get: function() {
        return this.value[1]
      },
      set: function(newValue) {
        Vue.set(this.value, 1, newValue)
      }
    }
  }
}
</script>

<style>
#dateRange1 .el-date-editor.el-input {
  width: 100%;
}

#dateRange1 .el-input--prefix .el-input__inner {
  padding-left: 5px;
}

#dateRange1 .el-input--suffix .el-input__inner {
  padding-right: 5px;
}

#dateRange2 .el-date-editor.el-input {
  width: 100%;
}

#dateRange2 .el-input--prefix .el-input__inner {
  padding-left: 5px;
}

#dateRange2 .el-input--suffix .el-input__inner {
  padding-right: 5px;
}
</style>
