<template>
  <div>
    <el-select v-if="this.userInfo.orgaType === 'HOS'" v-model="tempValue" disabled></el-select>
    <el-cascader v-if="this.userInfo.orgaType !== 'HOS'" v-model="tempValue" expand-trigger="hover" :options="source.orgaLevel" filterable clearable change-on-select>
    </el-cascader>
  </div>
</template>

<script>
import { user } from '@/type.js'
export default {
  name: 'kindo-orgaLevel',
  props: ['value'],
  data() {
    return {
      source: {
        orgaLevel: []
      },
      userInfo: kindo.cache.get(user.USER_INFO, 'local')
    }
  },
  async created() {
    if (this.userInfo.orgaType !== 'HOS') {
      let orgaLevel1 = await kindo.dictionary.getDictionary('OT_02')
      let orgaLevel2 = await kindo.dictionary.getDictionary('OT_03')

      let arr = []
      if (orgaLevel1 && orgaLevel2) {
        // arr.push({ label: '请选择', value: '' })
        // orgaLevel2.unshift({ label: '不限', value: '' })
        orgaLevel1.forEach(function(o) {
          arr.push(Object.assign(o, { children: orgaLevel2 }))
        })
      }

      this.source.orgaLevel = arr
    }
  },
  computed: {
    tempValue: {
      get: function() {
        return this.value
      },
      set: function(newValue) {
        if (newValue.length === 2) {
          this.$emit('update:levOne', newValue[0])
          this.$emit('update:levTwo', newValue[1])
        } else if (newValue.length === 1) {
          this.$emit('update:levOne', newValue[0])
          this.$emit('update:levTwo', '')
        } else if (newValue.length < 1) {
          this.$emit('update:levOne', '')
          this.$emit('update:levTwo', '')
        }
      }
    }
  }
}
</script>

