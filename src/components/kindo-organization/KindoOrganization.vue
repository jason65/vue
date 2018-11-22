<template>
  <!-- 该组件最多支持2层结构的联动 -->
  <section>
    <el-select v-if="this.userInfo.orgaType === 'HOS'" v-model="orgas" disabled></el-select>
    <el-cascader  v-if="this.userInfo.orgaType !== 'HOS'" v-model="orga" expand-trigger="hover" :options="source.orga" filterable change-on-select>
    </el-cascader>
  </section>
</template>
<script>
import { user } from '@/type.js'
export default {
  name: 'kindo-organization',
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      orgas: '',
      clearable: true,
      source: {
        orga: []
      },
      userInfo: kindo.cache.get(user.USER_INFO, 'local')
    }
  },
  computed: {
    orga: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        if (newValue.length == 2) {
          if (newValue[1] == '') {
            this.$emit('update:city', newValue[0])
            this.$emit('update:cnty', null)
          } else {
            this.$emit('update:city', null)
            this.$emit('update:cnty', newValue[1])
          }
        } else if (newValue.length == 1) {
          this.$emit('update:city', newValue[0] == '' ? null : newValue[0])
          this.$emit('update:cnty', null)
        } else {
          this.$emit('update:city', null)
          this.$emit('update:cnty', null)
        }
      }
    }
  },
  mounted() {
    if (this.userInfo.orgaType !== 'HOS') {
      this.$http.get(kindo.config.api.cDrgQC + 'nologin/dict/queryArea').then(res => {
        let orgData = res.data || []
        let orgDataTemp = []
        orgData.forEach(city => {
          if (city.children.length == 0) {
            delete city.children
          } else {
            let cntyDataTemp = []
            city.children.forEach(cnty => {
              if (cnty.children.length == 0) {
                delete cnty.children
              }
              cntyDataTemp.push(cnty)
            })
            city.children = cntyDataTemp
          }
          orgDataTemp.push(city)
        })
        this.source.orga = orgDataTemp
      })
    }
    
  }
}
</script>
<style scoped>
.disabled{
  pointer-events: none;
}
.disabled .el-input--mini .el-input__inner{
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
