<template>
  <el-select v-model="deptCode" placeholder="请选择" expand-trigger="hover" filterable clearable>
    <!-- <el-option label="不限" value=""></el-option> -->
    <el-option v-for="item in department" :label="item.label" :value="item.value" :key="item.value"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'kindo-department',
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
      department: [
        {
          label: '心脏外科',
          value: '420000'
        }
      ]
    }
  },
  mounted() {
    kindo.dictionary.getDictionary('DICT_DYN_KESHI').then(res => {
      this.department = res || []
    })
  },
  computed: {
    deptCode: {
      get: function() {
        return this.value
      },
      set: function(newValue) {
        this.$emit('input', newValue)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input--prefix .el-input__inner {
  padding-left: 5px;
  padding-right: 0;
}
</style>

