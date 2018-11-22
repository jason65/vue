<template>
  <div>
    <el-select v-model.trim="tempValue" placeholder="请选择" clearable filterable :disabled="disabled">
      <el-option v-for="item in source.orgaType" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
import { user } from '@/type.js'
export default {
  name: 'kindo-orgaType',
  props: ['value'],
  data() {
    return {
      source: {
        orgaType: []
      },
      userInfo: kindo.cache.get(user.USER_INFO, 'local'),
      disabled: false
    }
  },
  async created() {
    if (this.userInfo.orgaType !== 'HOS') {
      // 机构类型
      let resOrgaType = await kindo.dictionary.getDictionary('OT_04')
      this.source.orgaType = resOrgaType || []
    } else {
      this.disabled = true
    }
  },
  computed: {
    tempValue: {
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

