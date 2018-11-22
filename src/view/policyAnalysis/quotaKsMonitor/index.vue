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
        <el-form-item label="参保类型：" prop="cblx" label-width="90px">
          <el-select v-model="search.cblx" style="width:160px">
            <el-option v-for="item in source.sourceHtdm" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室：" prop="deptCode">
          <el-select v-model="search.deptCode" filterable style="width:160px">
            <el-option v-for="item in source.deptList" :label="item.label" :value="item.value" :key="item.value"></el-option>
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
              <div class="div1">累计医保超额(万元)</div>
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
      <el-col :span="12">
        <div style="text-align: center;margin-top:8px;">
          <span class="exportTitle">科室医保额度使用情况</span>
        </div>
        <kindo-chart :options="deptOptions" ref="linebar"></kindo-chart>
      </el-col>
      <el-col :span="12">
        <div style="text-align: center;margin-top:8px;">
          <span class="exportTitle">各医生医保费用使用情况</span>
        </div>
        <kindo-chart :options="doctorOptions" ref="linebar"></kindo-chart>
      </el-col>
    </el-row>
    <kindo-card title="患者住院费用情况" collapse>
      <template slot="control">
        <el-button icon="el-icon-download" @click="download" :disabled="exportDis">导出</el-button>
      </template>
      <kindo-table ref="table" :url="config.api.patientTable" :queryParam="searchCondition">
        <el-table-column width="140" label="患者编号" prop="patient_id" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="70" label="患者姓名" prop="name" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="结算日期" prop="account_date" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="参保类型" prop="insurance_type" align="left" header-align="center" :formatter="(row,col)=>{return kindo.dictionary.getLabel(source.sourceHtdm, row[col.property])}" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="140" label="出院诊断" prop="discharge_diag" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="140" label="科室" prop="visit_dept" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="医生工号" prop="doctor_code" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="70" label="住院医生" prop="doctor_name" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="医疗费用" prop="total_costs" align="right" :formatter="kindo.util.formatNum" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="医保费用" prop="insurance_cost" align="right" :formatter="kindo.util.formatNum" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="自费金额" prop="self_expense" align="right" :formatter="kindo.util.formatNum" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="自付金额" prop="self_payment" align="right" :formatter="kindo.util.formatNum" header-align="center" show-overflow-tooltip></el-table-column>
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
      exportDis: false,
      searchRules: {
        startDate: [{ validator: validateYear, trigger: 'blur' }]
        // deptCode: [{ required: true, message: '请输入科室名称', trigger: 'blur' }]
      },
      yqList: [{ label: '二院', value: '1' }, { label: '华美', value: '2' }],
      /* 公共部分 */
      search: {
        startDate: new Date().proDate('{%d-30}').formatDate('yyyy-MM'),
        endDate: new Date().formatDate('yyyy-MM'),
        deptCode: '',
        cblx: ''
      },
      searchCondition: {},
      /* 第一部分 */
      source: {
        sourceHtdm: [],
        deptList: [],
        dyybfyItem: { content: '-', contentVal: 0, standard: '-', standardVal: 0, percent: 0 },
        dyybyeItem: { content: '-', contentVal: 0 },
        dyksceItem: { content: '-', contentVal: 0 },
        cjybffItem: { content: '-', contentVal: 0, standard: '-', standardVal: 0, percent: 0 }
      },
      deptOptions: {
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
            yAxisIndex: 1,
            smooth: true,
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
      },
      doctorOptions: {
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          }
        },
        legend: {
          data: ['医保费用', '住院人次'],
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
          }
        ]
      }
    }
  },
  created() {
    if (kindo.cache.get('USER_INFO').userDataOrgaList && kindo.cache.get('USER_INFO').userDataOrgaList.length > 0) {
      for (let qq = 0; qq < kindo.cache.get('USER_INFO').userDataOrgaList.length; qq++) {
        if (kindo.cache.get('USER_INFO').userDataOrgaList[qq].id !== '0') {
          let params = Object.assign({}, kindo.cache.get('USER_INFO').userDataOrgaList[qq])
          this.source.deptList.push({ label: params.orgaName, value: params.orgaCode })
        }
      }
      this.search.deptCode = this.source.deptList[0].value
    }
  },

  mounted() {
    kindo.dictionary.getDictionary('CBLX_CODE').then(res => {
      this.source.sourceHtdm = res
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
          this.exportDis = false
          let self = this
          let searchCondition = Object.assign({}, this.search)
          searchCondition.startDate += '-01'
          searchCondition.endDate += '-01'
          this.searchCondition = Object.assign({}, searchCondition)
          let params = { params: searchCondition }
          // 获取指标数据
          self.getZhibiao(params)

          // 获取各个科室的图表
          self.getdeptChart(params)
          // 获取医生的图表
          self.getdoctorChart(params)
          this.$nextTick(() => {
            this.$refs.table.loadData()
          })
        } else {
          this.exportDis = true
        }
      })
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
            content: obj.fee !== undefined ? (obj.fee !== null ? kindo.util.formatNum(obj.fee) : '-') : '-',
            contentVal: obj.fee !== undefined ? (obj.fee !== null ? obj.fee : '-') : '-',
            standard: obj.quota !== undefined ? (obj.quota !== null ? kindo.util.formatNum(obj.quota) : '-') : '-',
            standardVal: obj.quota !== undefined ? (obj.quota !== null ? obj.quota : '-') : '-',
            percent: parseInt(quotaPercent.toFixed(0))
          }
          self.source.dyybyeItem = {
            content: obj.balance !== undefined ? (obj.balance !== null ? kindo.util.formatNum(obj.balance) : '-') : '-',
            contentVal: obj.balance !== undefined ? (obj.balance !== null ? obj.balance : '-') : '-'
          }
          self.source.dyksceItem = {
            content: obj.above !== undefined ? (obj.above !== null ? kindo.util.formatNum(obj.above) : '-') : '-',
            contentVal: obj.above !== undefined ? (obj.above !== null ? obj.above : '-') : '-'
          }
          self.source.cjybffItem = {
            content: obj.avg_fee !== undefined ? (obj.avg_fee !== null ? kindo.util.formatNum(obj.avg_fee) : '-') : '-',
            contentVal: obj.avg_fee !== undefined ? (obj.avg_fee !== null ? obj.avg_fee : '-') : '-',
            standard: obj.avg_standard !== undefined ? (obj.avg_standard !== null ? kindo.util.formatNum(obj.avg_standard) : '-') : '-',
            standardVal: obj.avg_standard !== undefined ? (obj.avg_standard !== null ? obj.avg_standard : '-') : '-',
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

    // 获取各个科室医保额度使用情况
    getdeptChart(params) {
      this.$http.get(config.api.deptchart, params).then(res => {
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
            result.name.push(data[i].month)
            result.fee.push(data[i].fee.toFixed(2))
            result.quota.push((data[i].quota ? data[i].quota : 0).toFixed(2))
            result.inpatient_time.push(data[i].inpatient_time)
            result.dep_id.push(data[i].dep_id)
          }
        }
        this.deptOptions.dataZoom = {
          show: !(data && data.length <= 15),
          start: 0,
          end: res.data && res.data.length <= 15 ? 100 : Math.floor((15 / res.data.length) * 100),
          bottom: 25
        }
        this.deptOptions.xAxis[0].data = result.name
        this.deptOptions.series[0].data = result.fee
        this.deptOptions.series[1].data = result.inpatient_time
        this.deptOptions.series[2].data = result.quota
      })
    },
    getdoctorChart(params) {
      this.$http.get(config.api.doctorchart, params).then(res => {
        let data = res.data
        var result = {}
        result.name = []
        result.fee = []
        result.inpatient_time = []
        result.outpatient_time = []
        result.quota = []
        if (data) {
          for (var i = 0; i < data.length; i++) {
            result.name.push(data[i].doc_name)
            result.fee.push(data[i].fee)
            result.inpatient_time.push(data[i].inpatient_time)
          }
        }
        this.doctorOptions.dataZoom = {
          show: !(data && data.length <= 15),
          start: 0,
          end: res.data && res.data.length <= 15 ? 100 : Math.floor((15 / res.data.length) * 100),
          bottom: 25
        }
        this.doctorOptions.xAxis[0].data = result.name
        this.doctorOptions.series[0].data = result.fee
        this.doctorOptions.series[1].data = result.inpatient_time
      })
    },
    download() {
      let searchCondition = Object.assign({}, this.search)
      searchCondition.startDate += '-01'
      searchCondition.endDate += '-01'
      kindo.util.downloadFile(config.api.exportTable, searchCondition)
    }
  },
  watch: {
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

