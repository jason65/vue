<!--
 *
 *      决策分析-病组管理-住院分析
 -->
<template>
  <div>
    <!--查询条件-->
    <kindo-card-search>
      <el-form :inline="true" :model="search" label-width="120px" label-position="right" class="demo-form-inline">
        <el-form-item label="开立时间">
          <el-date-picker class="half" v-model="search.START_DATE" :editable="false" :clearable="false" :picker-options="{disabledDate:TimeDisabledST}" value-format="yyyy-MM-dd" placeholder=" "></el-date-picker>
          <span class="half line">-</span>
          <el-date-picker class="half" v-model="search.END_DATE" :editable="false" :clearable="false" :picker-options="{disabledDate:TimeDisabledEND}" value-format="yyyy-MM-dd" placeholder=" "></el-date-picker>
        </el-form-item>
        <el-form-item label="院区">
          <el-checkbox-group v-model="searchYq" :min="1" :max="2">
            <el-checkbox v-for="city in yqList" :label="city.value" :key="city.value">{{city.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="参保类型：" prop="htdm" label-width="90px">
          <el-select v-model="search.htdm" style="width:160px">
            <el-option v-for="item in sourceHtdm" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </kindo-card-search>

    <el-tabs @tab-click="tabClick" v-model="tabActive">
      <el-tab-pane :label="deptAnalysis" name="1">
        <el-row>
          <div style="text-align: center;">
            <span style="spanTitle">科室违规TOP</span>
            <el-select class="selectedTop" v-model="deptRank" @change="deptChangeTop">
              <el-option v-for="item in topList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
            <el-button icon="el-icon-download" @click="uploadDept">导出</el-button>
          </div>
          <kindo-chart :options="illegalRankOptions" ref="illegalRankChart"></kindo-chart>
        </el-row>
        <el-row style="border-top:2px solid #e4e7ed;padding-top:16px;">
          <el-col :span="8">
            <div style="text-align: center;"> <span class="spanTitle" style="margin-right:8px;">违规规则TOP</span>
              <el-button icon="el-icon-download" @click="uploadRule">导出</el-button>
            </div>
            <kindo-chart :options="ruleRankOptions" ref="ruleRankChart"></kindo-chart>
          </el-col>
          <el-col :span="8">
            <div style="text-align: center;"> <span class="spanTitle">违规类型分析TOP</span>
            </div>
            <kindo-chart :options="typeRankOptions" ref="typeRankChart"></kindo-chart>
          </el-col>
          <el-col :span="8">
            <div style="text-align: center;"> <span class="spanTitle">违规构成分析TOP</span>
            </div>
            <kindo-chart :options="consistAnalysisOptions" ref="consistAnalysisChart"></kindo-chart>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="drugAnalysis" name="2">
        <el-row>
          <div style="text-align: center;">
            <span class="spanTitle">全院违规药品分析TOP</span>
            <el-select class="selectedTop" v-model="drugRank" @change="drugChangeTop">
              <el-option v-for="item in topList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
            <el-button icon="el-icon-download" @click="uploadDrug">导出</el-button>
          </div>
          <kindo-chart :options="drugRankOptions" ref="drugRankChart" @click="drugChartClick"></kindo-chart>
        </el-row>
        <el-row>
          <kindo-card title="药品违规分析" collapse>
            <!-- <template slot="control">
        <el-button icon="el-icon-download" @click="download">导出</el-button>
      </template> -->
            <kindo-table ref="drugTable" :url="config.api.drugGet" :queryParam="search">
              <el-table-column width="120" label="科室名称" prop="deptName" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column width="120" label="违规次数" prop="num" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column min-width="120" label="最常违规诊断" prop="diagnosisName" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column width="90" label="医生NO.1" prop="doctor1" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column width="90" label="医生NO.2" prop="doctor2" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column width="90" label="医生NO.3" prop="doctor3" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column width="90" label="医生NO.4" prop="doctor4" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column width="90" label="医生NO.5" prop="doctor5" align="left" header-align="center"></el-table-column>
              <el-table-column width="90" label="医生NO.6" prop="doctor6" align="right" header-align="center" show-overflow-tooltip></el-table-column>
            </kindo-table>
          </kindo-card>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="patientAnalysis" name="3">
        <el-row>
          <div style="text-align: center;">
            <span class="spanTitle">全院患者违规Top</span>
            <el-select class="selectedTop" v-model="patientRank" @change="patientChangeTop">
              <el-option v-for="item in topList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
            <el-button icon="el-icon-download" @click="uploadPatient">导出</el-button>
          </div>
          <kindo-chart :options="patientRankOptions" ref="patientRankChart" @click="patientChartClick"></kindo-chart>
        </el-row>
        <el-row>
          <kindo-card title="药品违规分析" collapse>
            <!-- <template slot="control">
        <el-button icon="el-icon-download" @click="download">导出</el-button>
      </template> -->
            <kindo-table ref="patientTable" :url="config.api.patientGet" :queryParam="search">
              <el-table-column width="120" label="违规单据号" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column width="120" label="违规住院号" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column width="120" label="科室名称" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column min-width="120" label="违规诊断" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column min-width="120" label="违规明细" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column min-width="120" label="违规描述" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column min-width="120" label="违规详情" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column width="90" label="责任医生" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
              <el-table-column width="90" label="违规时间" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
            </kindo-table>
          </kindo-card>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import config from './config'
export default {
  data() {
    return {
      config,
      yqList: [{ label: '二院', value: '1' }, { label: '华美', value: '2' }],
      searchYq: ['1', '2'],
      /* 公共部分 */
      search: {
        START_DATE: new Date().proDate('{%d-7}').formatDate('yyyy-MM-dd'),
        END_DATE: new Date().formatDate('yyyy-MM-dd'),
        yq: '1,2',
        htdm: '05'
      },
      sourceHtdm: [],
      topList: [{ label: '10', value: '10' }, { label: '15', value: '15' }, { label: '20', value: '20' }, { label: '25', value: '25' }, { label: '30', value: '30' }],
      tabActive: '1',
      deptAnalysis: '科室违规分析',
      deptRank: '10',
      // 各科室违规分析echarts图
      illegalRankOptions: {
        title: {
          show: false
        },
        grid: {
          top: '40px',
          y2: '80px'
        },
        xAxis: [{ type: 'category', data: ['aaa', 'bbb'] }],
        yAxis: [{ type: 'value', name: '违规(次)' }],
        series: [
          {
            name: '违规次数',
            type: 'bar',
            barWidth: '50%',
            barCategoryGap: '50%',
            data: [2, 4]
          }
        ]
      },
      // 违规规则top的echarts图
      ruleRankOptions: {
        grid: { top: 60, left: 200, right: 60, bottom: 60 },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['aaa', 'bbb'],
          axisLabel: {
            margin: 4
          }
        },
        series: [
          {
            name: '违规次数',
            type: 'bar',
            barWidth: '80%',
            data: [2, 4]
          }
        ]
      },
      // 违规类型top的echarts图
      typeRankOptions: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '违规类型分析',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{ value: 30, name: 'ttt' }]
          }
        ]
      },
      // 违规构成分析的echarts图
      consistAnalysisOptions: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '违规构成分析',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{ value: 30, name: 'ttt' }]
          }
        ]
      },
      drugAnalysis: '药品违规分析',
      drugRank: '10',
      // 药品违规分析的echarts图
      drugRankOptions: {
        title: {
          show: false
        },
        grid: {
          top: '40px',
          y2: '80px'
        },
        xAxis: [{ type: 'category', data: ['aaa', 'bbb'] }],
        yAxis: [{ type: 'value', name: '违规(次)' }],
        series: [
          {
            name: '违规次数',
            type: 'bar',
            barWidth: '50%',
            barCategoryGap: '50%',
            data: [{ name: 'aaa', value: 2 }, { name: 'bbb', value: 4 }]
          }
        ]
      },
      patientAnalysis: '患者违规分析',
      // 患者违规分析的echarts图
      patientRankOptions: {
        title: {
          show: false
        },
        grid: { top: 60, left: 60, right: 60 },
        xAxis: [{ type: 'category', data: ['aaa', 'bbb'] }],
        yAxis: [{ type: 'value', name: '违规(次)' }],
        series: [
          {
            name: '违规次数',
            type: 'bar',
            barWidth: '50%',
            data: [{ name: 'aaa', value: 2 }, { name: 'bbb', value: 4 }]
          }
        ]
      },
      patientRank: '10'
    }
  },
  async created() {
    // 获取性别的数据字典
  },

  mounted() {},

  methods: {
    // 验证查询时间
    TimeDisabledST(v) {
      if (Date.parse(v) > Date.parse(this.search.END_DATE)) {
        return true
      } else {
        return false
      }
    },
    TimeDisabledEND(v) {
      if (Date.parse(v) - Date.parse(this.search.START_DATE) <= -86400000) {
        return true
      } else {
        return false
      }
    },
    // 导出科室违规的echarts图
    uploadDept() {},
    // 导出违规规则Top的echarts图
    uploadRule() {},
    // 科室排名变化的时候，重新加载
    deptChangeTop(val) {
      console.log(val)
    },
    // 导出药品违规的echarts图
    uploadDrug() {},
    // 药品排名变化的时候，重新加载
    drugChangeTop(val) {
      console.log(val)
    },
    // 当点击药品的chart的时候
    drugChartClick(params) {
      this.drugRankOptions.series[0].data.map(item => {
        delete item.itemStyle
      })
      this.drugRankOptions.series[0].data[params.dataIndex].itemStyle = { color: '#ff6' }
      this.$refs.drugRankChart.mergeOptions(this.drugRankOptions)
      // console.log(this.drugRankOptions)
    },
    // 导出患者违规的echarts图
    uploadPatient() {},
    // 患者排名变化的时候，重新加载
    patientChangeTop(val) {
      console.log(val)
    },
    patientChartClick(params) {
      this.patientRankOptions.series[0].data.map(item => {
        delete item.itemStyle
      })
      this.patientRankOptions.series[0].data[params.dataIndex].itemStyle = { color: '#ff6' }
      this.$refs.patientRankChart.mergeOptions(this.patientRankOptions)
    },

    tabClick(val) {
      console.log(val)
    },
    getData() {
      switch (this.tabActive) {
        case '1':
          // 如果是科室的查询
          this.getIllegalRankChart()
          this.getRuleRankChart()
          this.getTypeRankChart()
          this.getConsistAnalysisChart()
          break
        case '2':
          // 如果是药品的查询
          this.getDrugRankChart()
          this.$refs.drugTable.reloadData()
          break
        case '3':
          // 如果是药品的查询
          this.getPatientRankChart()
          this.$refs.patientTable.reloadData()
          break
      }
    },
    // tab1-各科室违规分析echarts图--illegalRankOptions
    getIllegalRankChart() {
      // this.$http.get(config.api.chart1, this.search).then(res => {
      //   let xData = []
      //   let sData = []
      //   res.data.forEach(item => {
      //     xData.push(item.DEPTNAME)
      //     sData.push(item.NUM)
      //   })
      //   this.illegalRankOptions.xAxis.data = xData
      //   this.illegalRankOptions.series[0].data = sData
      //   this.illegalRankOptions.dataZoom = {
      //     show: !(res.data && res.data.length <= 15),
      //     start: 0,
      //     end: res.data && res.data.length <= 15 ? 100 : Math.floor((15 / res.data.length) * 100),
      //     bottom: 25
      //   }
      // })
    },
    // tab1-违规规则top的echarts图--ruleRankOptions
    getRuleRankChart() {
      // this.$http.get(config.api.chart2, this.search).then(res => {
      //   let xData = []
      //   let sData = []
      //   res.data.forEach(item => {
      //     xData.push(item.NUM)
      //     sData.push(item.TITLE)
      //   })
      //   this.ruleRankOptions.yAxis[0].data = xData
      //   this.ruleRankOptions.series[0].data = sData
      //   this.ruleRankOptions.dataZoom = {
      //     show: !(res.data && res.data.length <= 15),
      //     start: 0,
      //     end: res.data && res.data.length <= 15 ? 100 : Math.floor((15 / res.data.length) * 100),
      //     bottom: 25
      //   }
      // })
    },
    // tab1-违规类型top的echarts图--typeRankOptions
    getTypeRankChart() {
      // this.$http.get(config.api.chart3, this.search).then(res => {
      //   let sData = []
      //   res.data.sort((itema, itemb) => {
      //     return itemb.NUM - itema.NUM
      //   })
      //   res.data.forEach(item => {
      //     sData.push({ value: item.NUM, name: item.TITLE })
      //   })
      //   this.typeRankOptions.series[0].data = sData
      // })
    },
    // tab1-违规构成分析的echarts图--consistAnalysisOptions
    getConsistAnalysisChart() {
      // this.$http.get(config.api.chart4, this.search).then(res => {
      //   let sData = []
      //   res.data.sort((itema, itemb) => {
      //     return itemb.NUM - itema.NUM
      //   })
      //   res.data.forEach(item => {
      //     sData.push({ value: item.NUM, name: item.TITLE })
      //   })
      //   this.typeRankOptions.series[0].data = sData
      // })
    },
    // tab2-药品违规分析的echarts图--drugRankOptions
    getDrugRankChart() {
      // this.$http.get(config.api.chart5, this.search).then(res => {
      //   let sData = []
      // let xData=[]
      //   res.data.sort((itema, itemb) => {
      //     return itemb.NUM - itema.NUM
      //   })
      //   res.data.forEach(item => {
      //     xData.push(item.ITEMNAME)
      //     sData.push({ name: item.ITEMNAME, value: item.NUM, code: item.ITEMCODE })
      //   })
      //   this.drugRankOptions.xAxis[0].data=xData
      //    this.drugRankOptions.series[0].data=xData
      //   this.drugRankOptions.series[0].data[0].itemStyle = { normal: { color: '#3b76e6' } }
      //   option.dataZoom = {
      //     show: !(res.data && res.data.length <= 15),
      //     start: 0,
      //     end: res.data && res.data.length <= 15 ? 100 : Math.floor(15 / res.data.length * 100),
      //     bottom: 25
      // }
      // })
    },
    // tab3-患者违规分析的echarts图--patientRankOptions
    getPatientRankChart() {
      // this.$http.get(config.api.chart5, this.search).then(res => {
      //   let sData = []
      // let xData=[]
      //   res.data.sort((itema, itemb) => {
      //     return itemb.NUM - itema.NUM
      //   })
      //   res.data.forEach(item => {
      //     xData.push(item.ITEMNAME)
      //     sData.push({ name: item.ITEMNAME, value: item.NUM, code: item.ITEMCODE })
      //   })
      //   this.drugRankOptions.xAxis[0].data=xData
      //    this.drugRankOptions.series[0].data=xData
      //   this.drugRankOptions.series[0].data[0].itemStyle = { normal: { color: '#3b76e6' } }
      //   option.dataZoom = {
      //     show: !(res.data && res.data.length <= 15),
      //     start: 0,
      //     end: res.data && res.data.length <= 15 ? 100 : Math.floor(15 / res.data.length * 100),
      //     bottom: 25
      // }
      // })
    }
  },
  watch: {
    searchYq: function(val) {
      this.search.yq = val.toString()
    }
  }
}
</script>
<style scoped>
.spanTitle {
  font-size: 16px;
  font-weight: 400;
}
.selectedTop {
  display: inline-block;
  width: 70px;
  margin-left: 8px;
  margin-right: 8px;
}
</style>

