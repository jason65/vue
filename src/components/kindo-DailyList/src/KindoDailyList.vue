
<template>
  <div>
    <slot name="more"></slot>
    <kindo-card>
      <el-form :model="view.model" label-width="120px" inline>
        <el-form-item label="">
          <el-select v-model="view.model.PRICE_TIME" clearable>
            <el-option v-for="v in source.TIME" :key="v.DATE" :lable="v.DATE" :value="v.DATE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别：">
          {{ kindo.dictionary.getLabel(source.XB,params.XB)}}
        </el-form-item>
        <el-form-item label="年龄：">
          {{params.NL}}
        </el-form-item>
        <el-form-item label="总费用：">
          {{params.ZFY}}
        </el-form-item>
        <el-form-item label="除外耗材费用：">
          {{params.CWHCF}}
        </el-form-item>
      </el-form>
      <kindo-table ref="table" :url="url" :queryParam="view.model">
        <el-table-column label="费用名称" prop="CENTER_DETAIL_NAME" align="left" min-width="140px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="规格" prop="SPECIFICATION" min-width="100px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="单位" prop="UNIT" align="right" min-width="100px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="数量" prop="D_NUMBER" align="right" min-width="100px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="计价总金额" prop="PRICE" align="right" min-width="120px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="计费时间" prop="PRICE_TIME" min-width="100px" align="center" :show-overflow-tooltip="true"></el-table-column>
      </kindo-table>
    </kindo-card>
  </div>
</template>

<script>
export default {
  name: 'Kindo-DailyList',
  data() {
    return {
      view: {
        model: {
          PRICE_TIME: '',
          BAH: '',
          HOS_CODE: '',
          ZYCS: ''
        }
      },
      source: {
        TIME: [],
        XB: []
      }
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    url: {
      type: String,
      default: () => {
        return ''
      }
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  async created() {
    this.source.XB = await kindo.dictionary.get('GB_T2261_1')
    this.getDate()
  },
  mounted() {
    this.$nextTick(() => {
      this.view.model.BAH = this.params.BAH
      this.view.model.HOS_CODE = this.params.HOS_CODE
      this.view.model.ZYCS = this.params.ZYCS
      this.getData()
    })
  },
  methods: {
    async getData() {
      if (this.url !== '') {
        await this.$refs.table.reloadData()
      }
    },
    async getDate() {
      await this.$http.get(kindo.config.api.cDrgPms + 'common/baEntryExitDates', { params: { ID: this.params.ID } }).then(res => {
        if (res.data) {
          let Arr = res.data.map(item => {
            return item
          })
          this.source.TIME = Arr
        }
      })
    }
  },
  watch: {
    url: function() {
      this.getData()
    },
    params: function() {
      this.view.model.BAH = this.params.BAH
      this.view.model.HOS_CODE = this.params.HOS_CODE
      this.view.model.ZYCS = this.params.ZYCS
      this.getData()
      this.getDate()
    },
    'view.model.PRICE_TIME': function() {
      this.getData()
    }
  }
}
</script>

<style>

</style>
