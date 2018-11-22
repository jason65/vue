<template>
    <!-- 日期类型 -->
    <el-select v-model="hosCode" placeholder="请选择" filterable clearable :disabled="disabled">
      <!-- <el-option label="不限" value=""></el-option> -->
      <el-option v-for="item in hosptial" :label="item.label" :value="item.value" :key="item.value"></el-option>
    </el-select>
</template>
<script>
// import Vue from 'vue'
import { user } from '@/type.js'
export default {
  name: 'kindo-hosptial',
  props: {
    value: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      hosptial: [],
      userInfo: kindo.cache.get(user.USER_INFO, 'local'),
      disabled: false
    }
  },
  mounted() {
    if (this.userInfo.orgaType !== 'HOS') {
      this.$http.get(kindo.config.api.cDrgQC + 'nologin/dict/queryHospital').then(res => {
        this.hosptial = res.data
      })
    } else {
      this.disabled = true
    }
  },
  computed: {
    hosCode: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        this.$emit('input', newValue)
      }
    }
  }
}
</script>
