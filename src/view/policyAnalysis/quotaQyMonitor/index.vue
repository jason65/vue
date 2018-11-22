<!--
 *
 *      决策分析-全院额度监控
 -->
<template>
  <div>
    <!--查询条件-->
    <kindo-card-search>
      <el-form :inline="true" :model="search" :rules="searchRules" ref="searchForm" label-position="right" class="demo-form-inline">
        <el-form-item label="时间" prop="startDate">
          <el-date-picker class="half" v-model="search.startDate" :editable="false" :clearable="false" type="month" :picker-options="{disabledDate:TimeDisabledST}" placeholder=" "></el-date-picker>
          <span class="half line">-</span>
          <el-date-picker class="half" v-model="search.endDate" :editable="false" :clearable="false" type="month" :picker-options="{disabledDate:TimeDisabledEND}" placeholder=" "></el-date-picker>
        </el-form-item>
        <el-form-item label="院区">
          <el-checkbox-group v-model="searchYq" :min="1" :max="2">
            <el-checkbox v-for="city in yqList" :label="city.value" :key="city.value">{{city.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="参保类型：" prop="cblx" label-width="90px">
          <el-select v-model="search.cblx" style="width:160px">
            <el-option v-for="item in sourceHtdm" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </kindo-card-search>

    <kindo-card>
      <el-row class="titleExplain">
        <span>图例：</span>
        <el-tag color="#00bdd6" class="tagStyle">正常</el-tag>
        <el-tag color="#f7ba2a" class="tagStyle">超标</el-tag>
      </el-row>
      <el-row :gutter="30">
        <!--当月医保费用(万元)VS当月医保额度(万元)-->
        <el-col :span="6">
          <kindo-colorbox :theme="parseFloat(source.dyybfyItem.contentVal) > parseFloat(source.dyybfyItem.standardVal) ? 'warning' : 'blue'" class="outerCon">
            <div style="text-align: center;">
              <div class="titleTip">医保费用(万元)</div>
              <div class="titleNum1">{{source.dyybfyItem.content}}(实际)</div>
              <div class="titleNum2">{{source.dyybfyItem.standard}}(分配)</div>
            </div>
          </kindo-colorbox>
        </el-col>
        <!--当月医保余额（万元）-->
        <el-col :span="6">
          <kindo-colorbox :theme="0 >parseFloat(source.dyybyeItem.contentVal) ? 'warning' : 'blue'" class="outerCon">
            <div style="text-align: center;">
              <div class="div1">医保余额(万元)</div>
              <div class="titleNum3">{{ source.dyybyeItem.content}}</div>
            </div>
          </kindo-colorbox>
        </el-col>
        <!--当月科室超额数（个）-->
        <el-col :span="6">
          <kindo-colorbox :theme="parseFloat(source.dyksceItem.contentVal) > 0 ? 'warning' : 'blue'" class="outerCon">
            <div style="text-align: center;">
              <div class="div1">科室超额数(个)</div>
              <div class="titleNum3">{{source.dyksceItem.content}}</div>
            </div>
          </kindo-colorbox>
        </el-col>
        <!--次均医保费用（元）-->
        <el-col :span="6">
          <kindo-colorbox :theme="parseFloat(source.cjybffItem.contentVal) > parseFloat(source.cjybffItem.standardVal) ? 'warning' : 'blue'" class="outerCon">
            <div style="text-align: center;">
              <div class="titleTip">次均医保实际费用(元)</div>
              <div class="titleNum1">{{source.cjybffItem.content}}(实际)</div>
              <div class="titleNum2">{{source.cjybffItem.standard}}(标准)</div>
            </div>
          </kindo-colorbox>
        </el-col>
      </el-row>
    </kindo-card>
    <el-row style="background-color:#fff;margin-bottom:8px;">
      <div style="text-align: center;margin-top:8px;">
        <span class="exportTitle">各科室医保费用使用情况</span>
      </div>
      <kindo-chart :options="distributionOptions" ref="linebar"></kindo-chart>
    </el-row>
    <kindo-card title="医保费用使用情况" collapse>
      <template slot="control">
        <el-button icon="el-icon-download" :disabled="exportDis" @click="download">导出</el-button>
      </template>
      <kindo-table ref="table" :url="config.api.getTable" :queryParam="searchParams" :loaded="summaryData" :summary-method="getSummaries" :show-summary="true">
        <el-table-column min-width="140" fixed="left" label="科室名称" prop="deptName" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column width="150" fixed="left" label="累计医保额度" :formatter="kindo.util.formatNum" prop="ljquota" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column width="150" fixed="left" label="累计医保费用" :formatter="kindo.util.formatNum" prop="ljybfy" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" fixed="left" label="累计超额" :formatter="kindo.util.formatNum" prop="ce" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="1月" prop="m1" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="2月" prop="m2" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="3月" prop="m3" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="4月" prop="m4" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="5月" prop="m5" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="6月" prop="m6" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="7月" prop="m7" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="8月" prop="m8" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="9月" prop="m9" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="10月" prop="m10" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="11月" prop="m11" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="12月" prop="m12" align="right" :formatter="kindo.util.formatNum" show-overflow-tooltip></el-table-column>
      </kindo-table>
    </kindo-card>
  </div>
</template>

<script>
import config from './config'
import kindoColorbox from '@/components/kindo-colorbox'
export default {
  components: {
    'kindo-colorbox': kindoColorbox
  },
  data() {
    let validateYear = (rule, value, callback) => {
      let year1 = new Date(value).getFullYear()
      let year2 = new Date(this.search.endDate).getFullYear()
      if (year1 === year2) {
        callback()
      } else {
        callback(new Error('所选年份必须是同一年'))
      }
    }
    return {
      config,
      footerData: [],
      yqList: [{ label: '二院', value: '1' }, { label: '华美', value: '2' }],
      searchYq: ['1', '2'],
      /* 公共部分 */
      search: {
        startDate: new Date().proDate('{%d-30}').formatDate('yyyy-MM'),
        endDate: new Date().formatDate('yyyy-MM'),
        yqbm: '1,2',
        cblx: ''
      },
      tableData: [{}],
      searchRules: {
        startDate: [{ validator: validateYear, trigger: 'blur' }]
      },
      searchParams: {},
      sourceHtdm: [],
      exportDis: false,
      /* 第一部分 */
      source: {
        dyybfyItem: { content: '-', contentVal: 0, standard: '-', standardVal: 0, percent: 0 },
        dyybyeItem: { content: '-', contentVal: 0 },
        dyksceItem: { content: '-', contentVal: 0 },
        cjybffItem: { content: '-', contentVal: 0, standard: '-', standardVal: 0, percent: 0 }
      },
      distributionOptions: {
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          }
        },
        legend: {
          data: ['医保费用', '住院人次', '额度'],
          bottom: 0,
          left: 'center'
        },
        toolbox: {
          show: false
        },
        grid: {
          top: 40,
          left: 150,
          x2: 100,
          y2: 80
        },
        dataZoom: {
          bottom: 25
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            axisline: false,
            axisTick: {
              alignWithLabel: true
            },
            splitLine: {
              show: false
            },
            axisPointer: {
              type: 'shadow'
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '金额(元)',
            min: 0,
            splitNumber: 8,
            splitLine: {
              show: false
            },
            boundaryGap: [0.2, 0.2]
          },
          {
            type: 'value',
            scale: true,
            name: '人次',
            min: 0,
            splitNumber: 8,
            splitLine: {
              show: false
            },
            boundaryGap: [0.2, 0.2]
          }
        ],
        series: [
          {
            name: '医保费用',
            type: 'bar',
            barWidth: '50%',
            barCategoryGap: '50%',
            xAxisIndex: 0,
            yAxisIndex: 0,
            showAllSymbol: true,
            data: []
          },
          {
            name: '住院人次',
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            showAllSymbol: true,
            data: []
          },
          {
            name: '额度',
            type: 'line',
            smooth: true,
            yAxisIndex: 0,
            showAllSymbol: true,
            data: []
          }
        ]
      }
    }
  },
  created() {},

  mounted() {
    kindo.dictionary.getDictionary('CBLX_CODE').then(res => {
      this.sourceHtdm = res
      this.search.cblx = res[0].value
      this.getData()
    })
  },

  methods: {
    // 验证查询时间
    TimeDisabledST(v) {
      if (Date.parse(v) > Date.parse(this.search.endDate)) {
        return true
      } else {
        return false
      }
    },
    TimeDisabledEND(v) {
      if (Date.parse(v) - Date.parse(this.search.startDate) <= -86400000) {
        return true
      } else {
        return false
      }
    },
    getData() {
      this.$refs.searchForm.validate(valid => {
        if (valid) {
          let self = this
          this.exportDis = false
          let searchCondition = Object.assign({}, this.search)
          searchCondition.startDate += '-01'
          searchCondition.endDate += '-01'
          this.searchParams = Object.assign({}, searchCondition)
          let params = { params: searchCondition }
          // 获取指标数据
          self.getZhibiao(params)

          // 获取图标
          self.getChart(params)
          this.$nextTick(() => {
            this.$refs.table.reloadData()
          })
        } else {
          this.exportDis = true
        }
      })
    },
    summaryData(res) {
      // deptName,ljybfy,ljquota,ce,m1-m12
      let f = res.data.footer
      let ljquota = kindo.util.formatNum(f.ljquota)
      let ljybfy = kindo.util.formatNum(f.ljybfy)
      let ce = kindo.util.formatNum(f.ce)
      let m1 = kindo.util.formatNum(f.m1)
      let m2 = kindo.util.formatNum(f.m2)
      let m3 = kindo.util.formatNum(f.m3)
      let m4 = kindo.util.formatNum(f.m4)
      let m5 = kindo.util.formatNum(f.m5)
      let m6 = kindo.util.formatNum(f.m6)
      let m7 = kindo.util.formatNum(f.m7)
      let m8 = kindo.util.formatNum(f.m8)
      let m9 = kindo.util.formatNum(f.m9)
      let m10 = kindo.util.formatNum(f.m10)
      let m11 = kindo.util.formatNum(f.m11)
      let m12 = kindo.util.formatNum(f.m12)
      this.footerData = ['', '合计', ljquota, ljybfy, ce, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12]
    },
    // 获取指标数据
    getZhibiao(params) {
      let self = this
      this.$http.get(config.api.get, params).then(res => {
        let obj = res.data
        if (JSON.stringify(obj) !== '{}') {
          let quotaPercent = 0
          // 防止出现当月医保额度的值出现意外的情况
          if (obj.quota === undefined || obj.quota === null || obj.quota === 0) {
            quotaPercent = '0'
          } else {
            quotaPercent = (obj.fee / obj.quota) * 100 > 100 ? 100 : (obj.fee / obj.quota) * 100
          }
          let avgPercent = (obj.avg_fee / obj.avg_standard) * 100 > 100 ? 100 : (obj.avg_fee / obj.avg_standard) * 100
          self.source.dyybfyItem = {
            contentVal: obj.fee !== undefined ? (obj.fee !== null ? parseFloat(obj.fee) : '-') : '-',
            content: obj.fee !== undefined ? (obj.fee !== null ? kindo.util.formatNum(obj.fee) : '-') : '-',
            standard: obj.quota !== undefined ? (obj.quota !== null ? kindo.util.formatNum(obj.quota) : '-') : '-',
            standardVal: obj.quota !== undefined ? (obj.quota !== null ? parseFloat(obj.quota) : '-') : '-',
            percent: parseInt(quotaPercent.toFixed(0))
          }
          self.source.dyybyeItem = {
            content: obj.balance !== undefined ? (obj.balance !== null ? kindo.util.formatNum(obj.balance) : '-') : '-',
            contentVal: obj.balance !== undefined ? (obj.balance !== null ? parseFloat(obj.balance) : '-') : '-'
          }
          self.source.dyksceItem = {
            content: obj.above !== undefined ? (obj.above !== null ? kindo.util.formatNum(obj.above, 0) : '-') : '-',
            contentVal: obj.above !== undefined ? (obj.above !== null ? parseFloat(obj.above) : '-') : '-'
          }
          self.source.cjybffItem = {
            content: obj.avg_fee !== undefined ? (obj.avg_fee !== null ? kindo.util.formatNum(obj.avg_fee) : '-') : '-',
            contentVal: obj.avg_fee !== undefined ? (obj.avg_fee !== null ? parseFloat(obj.avg_fee) : '-') : '-',
            standard: obj.avg_standard !== undefined ? (obj.avg_standard !== null ? kindo.util.formatNum(obj.avg_standard) : '-') : '-',
            standardVal: obj.avg_standard !== undefined ? (obj.avg_standard !== null ? parseFloat(obj.avg_standard) : '-') : '-',
            percent: parseInt(avgPercent.toFixed(0))
          }
        } else {
          self.source.dyybfyItem = { content: '-', contentVal: 0, standard: '-', standardVal: 0, percent: 0 }
          self.source.dyybyeItem = { content: '-', contentVal: 0 }
          self.source.dyksceItem = { content: '-', contentVal: 0 }
          self.source.cjybffItem = { content: '-', contentVal: 0, standard: '-', standardVal: 0, percent: 0 }
        }
      })
    },

    // 获取慢性病违规类型分布
    getChart(params) {
      this.$http.get(config.api.chart, params).then(res => {
        let data = res.data

        var result = {}
        result.name = []
        result.fee = []
        result.inpatient_time = []
        result.outpatient_time = []
        result.quota = []
        result.dep_id = []
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            result.name.push(data[i].dep_name)
            result.fee.push(data[i].fee.toFixed(2))
            result.quota.push((data[i].quota ? data[i].quota : 0).toFixed(2))
            result.inpatient_time.push(data[i].inpatient_time)
            result.dep_id.push(data[i].dep_id)
          }
        }
        this.distributionOptions.dataZoom = {
          show: !(data && data.length <= 15),
          start: 0,
          end: res.data && res.data.length <= 15 ? 100 : Math.floor((15 / res.data.length) * 100),
          bottom: 25
        }
        this.distributionOptions.xAxis[0].data = result.name
        this.distributionOptions.series[0].data = result.fee
        this.distributionOptions.series[1].data = result.inpatient_time
        this.distributionOptions.series[2].data = result.quota
      })
    },
    download() {
      kindo.util.downloadFile(config.api.exportTable, this.searchParams)
    },
    getSummaries() {
      return this.footerData
    }
  },
  watch: {
    searchYq: function(val) {
      this.search.yqbm = val.toString()
    },
    'search.startDate': function(v) {
      if (typeof v !== 'string') {
        this.search.startDate = v.formatDate('yyyy-MM')
      }
    },
    'search.endDate': function(v) {
      if (typeof v !== 'string') {
        this.search.endDate = v.formatDate('yyyy-MM')
      }
    }
  }
}
</script>
<style scoped>
.titleExplain {
  padding-bottom: 15px;
  text-align: right;
  padding-right: 20px;
}
.tagStyle {
  color: #fff;
  margin-left: 8px;
}
.outerCon {
  height: 155px;
  font-size: 20px;
  font-weight: bold;
}
.titleNum3 {
  font-size: 16px;
  font-weight: normal;
}
.titleNum1 {
  height: 50px;
  margin-top: 20px;
  text-align: right;
  font-size: 16px;
  font-weight: normal;
}
.titleNum2 {
  text-align: right;
  font-size: 16px;
  font-weight: normal;
}
.div1 {
  height: 46px;
  margin-bottom: 20px;
}
</style>

