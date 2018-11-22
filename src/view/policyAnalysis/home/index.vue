<template>
  <div>
    <kindo-card>
      <el-tabs v-model="activeName" type="card" @tab-click="getData">
        <el-tab-pane label="监管指标" name="first"></el-tab-pane>
        <el-tab-pane label="费用汇总" name="second"></el-tab-pane>
      </el-tabs>
      <kindo-card-search>
        <el-form :model="searchForm" inline label-width="100px">
          <el-form-item label="结算日期：">
            <kindo-date-range v-model="searchDate" :clearable="false"></kindo-date-range>
          </el-form-item>
          <el-form-item label="科室：">
            <el-select v-model="searchForm.dept_id" filterable clearable style="width:160px">
              <el-option v-for="item in source.deptList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="院区：">
            <el-checkbox-group v-model="szyqbm" :min="1" :max="2">
              <el-checkbox v-for="city in source.yqList" :label="city.value" :key="city.value">{{city.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>

        <el-form :model="searchForm" inline label-width="100px" slot="more">
          <el-form-item label="参保类型：">
            <el-select v-model="searchForm.yblx" clearable style="width:140px">
              <el-option v-for="item in source.yblxList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </kindo-card-search>

      <kindo-card v-if="activeName==='first'">
        <el-row :gutter="20">
          <el-col :span="idx===4?8:4" v-for="(item,idx) in monitorQuota.topCards" :key="item.title">
            <kindo-colorbox class="ccb" :theme="item.content > item.standard ? 'warning' : 'blue'">
              <div class="tips-container bgblue cost1 ">
                <div class="title">{{ item.title }}</div>
                <div class="content">{{ item.content + item.contentUnit }}</div>
                <div class="mark">{{ item.standard + item.standardUnit }}</div>
              </div>
            </kindo-colorbox>
          </el-col>
        </el-row>
      </kindo-card>

      <kindo-card v-if="activeName==='first'">
        <kindo-chart :options="monitorQuota.middleChart" ref="mainChart"></kindo-chart>
      </kindo-card>

      <kindo-card v-if="activeName==='first'">
        <el-tabs v-model="monitorQuota.footChartsTabVal">
          <el-tab-pane label="各科室平均住院日对比" name="first">
            <div class="echars-filed">
              <!-- <span style="display: inline-block">
                  <el-select v-model="monitorQuota.footCharts.leftChart.searchDeptCode" filterable style="width:160px">
                    <el-option v-for="item in source.deptList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </span> -->
              <span style="display: inline-block">
                <el-button icon="el-icon-download" @click="monitorQuotaLeftChartUpload">导出</el-button>
              </span>
            </div>
            <kindo-chart :options="monitorQuota.ALOSChart" ref="ALOSChart"></kindo-chart>
          </el-tab-pane>
          <el-tab-pane label="各科室费用构成对比" name="second">
            <div class="echars-filed">
              <!-- <span style="display: inline-block">
                  <el-select v-model="monitorQuota.footCharts.rightChart.searchDeptCode" filterable style="width:160px">
                    <el-option v-for="item in source.deptList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </span> -->
              <span style="display: inline-block">
                <el-button icon="el-icon-download" @click="monitorQuotaRightChartUpload">导出</el-button>
              </span>
            </div>
            <kindo-chart :options="monitorQuota.medicalCostsChart" ref="medicalCostsChart"></kindo-chart>
          </el-tab-pane>
        </el-tabs>
      </kindo-card>

      <kindo-card v-if="activeName==='second'">
        <el-row>
          <el-col :span="16" style="text-align: center">
            <h4>费用情况</h4>
          </el-col>
          <el-col :span="8" style="text-align: center;padding: 0px">
            <h4>费用占比及金额情况</h4>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-col :span="6" v-for="item in costsCollect.topCards" :key="item.title">
              <!--<el-col :span="10" :offset="index % 2 === 0 ? 1 : 2" v-for="(item, key, index) in source.医保情况items" :key="item.title">-->
              <kindo-colorbox style="padding: 5px;margin: 5px">
                <div class="tips-container bgblue cost1">
                  <div class="title">{{ item.title }}</div>
                  <div class="content">{{ item.content }}</div>
                </div>
              </kindo-colorbox>
            </el-col>
          </el-col>
          <el-col :span="8">
            <kindo-chart :options="costsCollect.topChart" ref="topChart"></kindo-chart>
          </el-col>
        </el-row>
      </kindo-card>

      <kindo-card v-if="activeName==='second'">
        <el-tabs v-model="costsCollect.footChartsTabVal">
          <el-tab-pane label="各科室住院次均费用对比" name="first">
            <div class="echars-filed">
              <!-- <span style="display: inline-block">
                  <el-select v-model="costsCollect.footCharts.leftChart.searchDeptCode" filterable style="width:160px">
                    <el-option v-for="item in source.deptList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </span> -->
              <span style="display: inline-block">
                <el-button icon="el-icon-download" @click="costsCollectLeftChartUpload">导出</el-button>
              </span>
            </div>
            <kindo-chart :options="costsCollect.hospitalizedCostsChart" ref="ALOSChart"></kindo-chart>
          </el-tab-pane>
        </el-tabs>
      </kindo-card>
    </kindo-card>

  </div>
</template>

<script scope>
import config from './config'

import kindoColorbox from '@/components/kindo-colorbox'
import kindoDateRange from '@/components/kindo-date-range'
export default {
  components: {
    'kindo-colorbox': kindoColorbox,
    'kindo-date-range': kindoDateRange
  },
  methods: {
    getData() {
      this.$nextTick(function() {
        if (this.activeName === 'first') {
          this.getmonitorQuotaData()
        } else {
          this.getCostsCollectData()
        }
      })
    },
    getmonitorQuotaData() {
      // top card
      this.$http.get(config.api.getCards, { params: this.searchForm }).then(res => {
        for (let key in this.monitorQuota.topCards) {
          if (this.monitorQuota.topCards.hasOwnProperty(key)) {
            let item = this.monitorQuota.topCards[key]
            item.content = '-'
            item.contentUnit = ''
            item.standard = '-'
            item.standardUnit = ''
          }
        }

        res.data.forEach(item => {
          if (this.monitorQuota.topCards.hasOwnProperty(item.title)) {
            this.monitorQuota.topCards[item.title].title = item.title === null ? '-' : item.title
            this.monitorQuota.topCards[item.title].content = item.content === null ? '-' : Number.parseFloat(item.content)
            this.monitorQuota.topCards[item.title].standard = item.standard === null ? '-' : Number.parseFloat(item.standard)
            this.monitorQuota.topCards[item.title].contentUnit = item.content === null ? '' : item.unit
            this.monitorQuota.topCards[item.title].standardUnit = item.standard === null ? '' : item.unit

            this.monitorQuota.topCards = Object.assign({}, this.monitorQuota.topCards)
          }
        })
      })

      // middle chart (平均住院日及各占比趋势图)
      this.$http.get(config.api.getProportionChart, { params: this.searchForm }).then(res => {
        let dateArr = []
        let valArr1 = []
        let valArr2 = []
        let valArr3 = []
        let valArr4 = []
        let valArr5 = []

        if (res.data && res.data.length > 0) {
          res.data.forEach(o => {
            dateArr.push(o.MON)
            valArr1.push({ name: o.MON, value: o.AVG_STAY })
            valArr2.push({ name: o.MON, value: o.DRUG_PROP })
            valArr3.push({ name: o.MON, value: o.CHECK_PROP })
            valArr4.push({ name: o.MON, value: o.VERIFY_PROP })
            valArr5.push({ name: o.MON, value: o.MATERIAL_PROP })
          })
        }

        Object.assign(this.monitorQuota.middleChart, {
          dataZoom: {
            show: !(res.data && res.data.length <= 15),
            start: 0,
            end: res.data && res.data.length <= 15 ? 100 : Math.floor((15 / res.data.length) * 100),
            bottom: 25
          },
          xAxis: [
            {
              type: 'category',
              data: dateArr
            }
          ],
          series: [
            {
              yAxisIndex: 1,
              name: '平均住院日',
              type: 'bar',
              barWidth: '50%',
              barCategoryGap: '50%',
              data: valArr1
            },
            {
              // yAxisIndex: 1,
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: '药占比',
              type: 'line',
              data: valArr2
            },
            {
              name: '检查占比',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: valArr3
            },
            {
              name: '检验占比',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: valArr4
            },
            {
              name: '材料占比',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: valArr5
            }
          ]
        })
      })

      // foot left chart (各科室平均住院日对比)
      this.$http.get(config.api.getALOSChart, { params: this.searchForm }).then(res => {
        let dateArr = []
        let valArr1 = []
        let valArr2 = []

        if (res.data && res.data.length > 0) {
          res.data.forEach(o => {
            dateArr.push(o.ksmc)
            valArr1.push({ name: o.ksmc, value: o.avgZyr })
            valArr2.push({ name: o.ksmc, value: o.avgStay })
          })
        }

        Object.assign(this.monitorQuota.ALOSChart, {
          dataZoom: {
            show: !(res.data && res.data.length <= 15),
            start: 0,
            end: res.data && res.data.length <= 15 ? 100 : Math.floor((15 / res.data.length) * 100),
            bottom: 25
          },
          xAxis: [
            {
              type: 'category',
              data: dateArr
            }
          ],
          series: [
            {
              name: '平均住院日（天）',
              type: 'bar',
              data: valArr1,
              barWidth: '50%',
              barCategoryGap: '50%'
            },
            {
              name: '限定平均住院日（天）',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: valArr2
            }
          ]
        })
      })

      // foot right chart (各科室费用构成对比)
      this.$http.get(config.api.getMedicalCostsChart, { params: this.searchForm }).then(res => {
        let dateArr = []
        let valArr1 = []
        let valArr2 = []

        if (res.data && res.data.length > 0) {
          res.data.forEach(o => {
            dateArr.push(o.ksmc)
            valArr1.push({ name: o.ksmc, value: o.zb })
            valArr2.push({ name: o.ksmc, value: o.bz })
          })
        }

        Object.assign(this.monitorQuota.medicalCostsChart, {
          dataZoom: {
            show: !(res.data && res.data.length <= 15),
            start: 0,
            end: res.data && res.data.length <= 15 ? 100 : Math.floor((15 / res.data.length) * 100),
            bottom: 25
          },
          xAxis: [
            {
              type: 'category',
              data: dateArr
            }
          ],
          series: [
            {
              name: '平均占比（%）',
              type: 'bar',
              data: valArr1,
              barWidth: '50%',
              barCategoryGap: '50%'
            },
            {
              name: '平均占比标准（%）',
              type: 'line',
              data: valArr2
            }
          ]
        })
      })
    },
    getCostsCollectData() {
      // top card
      this.$http.get(config.api.getCards, { params: this.searchForm }).then(res => {
        for (let key in this.costsCollect.topCards) {
          if (this.costsCollect.topCards.hasOwnProperty(key)) {
            let item = this.costsCollect.topCards[key]
            item.content = '-'
            item.contentUnit = ''
            item.standard = '-'
            item.standardUnit = ''
          }
        }

        res.data.forEach(item => {
          if (this.costsCollect.topCards.hasOwnProperty(item.title)) {
            this.costsCollect.topCards[item.title].title = item.title === null ? '-' : item.title
            this.costsCollect.topCards[item.title].content = item.content === null ? '-' : Number.parseFloat(item.content)
            this.costsCollect.topCards[item.title].standard = item.standard === null ? '-' : Number.parseFloat(item.standard)
            this.costsCollect.topCards[item.title].contentUnit = item.content === null ? '' : item.unit
            this.costsCollect.topCards[item.title].standardUnit = item.standard === null ? '' : item.unit

            this.costsCollect.topCards = Object.assign({}, this.costsCollect.topCards)
          }
        })
      })
      // top chart (费用占比及金额情况)
      this.$http.get(config.api.getPieChart, { params: this.searchForm }).then(res => {
        let nameArr = []
        let valArr = []

        if (res.data && res.data.length > 0) {
          res.data.forEach(o => {
            nameArr.push(o.fyflmc)
            valArr.push({ name: o.fyflmc, value: o.fee })
          })
        }

        Object.assign(this.costsCollect.topChart, {
          legend: {
            itemGap: 3,
            top: 10,
            itemHeight: 10,
            orient: 'vertical',
            x: 'right',
            data: nameArr
          },
          series: [
            {
              name: '费用详情',
              type: 'pie',
              radius: '50%',
              center: ['40%', '50%'],
              data: valArr
            }
          ]
        })
      })
      // foot chart (各科室住院次均费用对比)
      this.$http.get(config.api.getHospitalizedCostsChart, { params: this.searchForm }).then(res => {
        let dateArr = []
        let valArr1 = []
        let valArr2 = []
        let valArr3 = []

        if (res.data && res.data.length > 0) {
          res.data.forEach(o => {
            dateArr.push(o.ksmc)
            valArr1.push({ name: o.ksmc, value: o.zyFee })
            valArr2.push({ name: o.ksmc, value: o.rc })
            valArr3.push({ name: o.ksmc, value: o.avgFee })
          })
        }

        Object.assign(this.costsCollect.hospitalizedCostsChart, {
          dataZoom: {
            show: !(res.data && res.data.length <= 15),
            start: 0,
            end: res.data && res.data.length <= 15 ? 100 : Math.floor((15 / res.data.length) * 100),
            bottom: 25
          },
          xAxis: [
            {
              type: 'category',
              data: dateArr
            }
          ],
          series: [
            {
              name: '住院次均费用（元）',
              type: 'bar',
              barWidth: '50%',
              barCategoryGap: '50%',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: valArr1
            },
            {
              name: '人次',
              type: 'line',
              barWidth: '50%',
              barCategoryGap: '50%',
              yAxisIndex: 1,
              data: valArr2
            },
            {
              name: '住院次均费用标准（元）',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: valArr3
            }
          ]
        })
      })
    },
    monitorQuotaLeftChartUpload() {
      kindo.util.downloadFile(config.api.exportTable1, this.searchForm)
    },
    monitorQuotaRightChartUpload() {
      kindo.util.downloadFile(config.api.exportTable2, this.searchForm)
    },
    costsCollectLeftChartUpload() {
      kindo.util.downloadFile(config.api.exportTable3, this.searchForm)
    }
  },
  created() {
    this.$http.get(config.api.getDeptList).then(res => {
      this.source.deptList = res.data
    })

    kindo.dictionary.getDictionary('CBLX_CODE').then(res => {
      this.source.yblxList = res
    })
  },
  data() {
    return {
      activeName: 'first',
      searchDate: [new Date().proDate('{%d-3}'), new Date()],
      szyqbm: ['1', '2'], //院区
      searchForm: {
        startDate: kindo.util.formatDate(new Date().proDate('{%d-3}')), //结算日期-开始
        endDate: kindo.util.formatDate(new Date()), //结算日期-结束
        yblx: '', //参保类型
        dept_id: '', //科室ID
        szyqbm: '1,2' //院区
      },
      //监控指标
      monitorQuota: {
        topCards: {
          药占比: { title: '药占比', content: '-', contentUnit: '', standard: '-', standardUnit: '' },
          检查占比: { title: '检查占比', content: '-', contentUnit: '', standard: '-', standardUnit: '' },
          检验占比: { title: '检验占比', content: '-', contentUnit: '', standard: '-', standardUnit: '' },
          材料占比: { title: '材料占比', content: '-', contentUnit: '', standard: '-', standardUnit: '' },
          平均住院日: { title: '平均住院日', content: '-', contentUnit: '', standard: '-', standardUnit: '' }
        },
        middleChart: {
          title: {
            text: '各科室数据占比',
            show: false,
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'normal',
              color: '#605d5c'
            }
          },
          tooltip: { trigger: 'axis' },
          legend: {
            data: ['平均住院日', '药占比', '检查占比', '检验占比', '材料占比'],
            bottom: 0,
            left: 'center'
          },
          toolbox: { show: false },
          grid: {
            top: '40px',
            y2: '80px'
          },
          dataZoom: {
            bottom: 25
          },
          xAxis: [
            {
              type: 'category',
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              nameTextStyle: { color: '#c4c4c4' },
              min: 0,
              boundaryGap: [0.2, 0.2],
              axisLine: { show: true },
              name: '占比',
              axisLabel: {
                textStyle: { color: '#333' }
              }
            },
            {
              type: 'value',
              scale: true,
              nameTextStyle: { color: '#c4c4c4' },
              min: 0,
              boundaryGap: [0.2, 0.2],
              axisLine: { show: true },
              name: '平均住院日',
              axisLabel: {
                textStyle: { color: '#333' }
              }
            }
          ],
          series: [
            {
              yAxisIndex: 1,
              name: '平均住院日',
              type: 'bar',
              barWidth: '50%',
              barCategoryGap: '50%',
              data: []
            },
            {
              // yAxisIndex: 1,
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: '药占比',
              type: 'line',
              data: []
            },
            {
              name: '检查占比',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: []
            },
            {
              name: '检验占比',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: []
            },
            {
              name: '材料占比',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: []
            }
          ]
        },
        footChartsTabVal: 'first',
        ALOSChart: {
          title: {
            text: '各科室平均住院日对比',
            show: false,
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'normal',
              color: '#605d5c'
            }
          },
          tooltip: { trigger: 'axis' },
          legend: {
            data: ['平均住院日（天）', '限定平均住院日（天）'],
            bottom: 0,
            left: 'center'
          },
          toolbox: { show: false },
          grid: {
            top: '40px',
            y2: '80px'
          },
          dataZoom: {
            bottom: 25
          },
          xAxis: [
            {
              type: 'category',
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              nameTextStyle: { color: '#c4c4c4' },
              name: '天数',
              min: 0,
              boundaryGap: [0.2, 0.2],
              axisLine: { show: true },
              axisLabel: { textStyle: { color: '#333' } }
            }
          ],
          series: [
            {
              name: '平均住院日（天）',
              type: 'bar',
              data: [],
              barWidth: '50%',
              barCategoryGap: '50%'
            },
            {
              name: '限定平均住院日（天）',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: []
            }
          ]
        },
        medicalCostsChart: {
          title: {
            text: '各科室费用构成对比',
            show: false,
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'normal',
              color: '#605d5c'
            }
          },
          tooltip: { trigger: 'axis' },
          legend: {
            data: ['平均占比（%）', '平均占比标准（%）'],
            bottom: 0,
            left: 'center'
          },
          toolbox: { show: false },
          grid: {
            top: '40px',
            y2: '80px'
          },
          dataZoom: {
            bottom: 25
          },
          xAxis: [
            {
              type: 'category',
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              nameTextStyle: { color: '#c4c4c4' },
              name: '百分比（%）',
              min: 0,
              max: 100,
              boundaryGap: [0.2, 0.2],
              axisLine: { show: true },
              axisLabel: { textStyle: { color: '#333' } }
            }
          ],
          series: [
            {
              name: '平均占比（%）',
              type: 'bar',
              data: [],
              barWidth: '50%',
              barCategoryGap: '50%'
            },
            {
              name: '平均占比标准（%）',
              type: 'line',
              data: []
            }
          ]
        }
      },
      // 费用汇总
      costsCollect: {
        topCards: {
          医保费用: { title: '医保费用（万元）', content: '-' },
          次均医保费用: { title: '次均医保费用（元）', content: '-' },
          医疗总费用: { title: '医疗总费用（万元）', content: '-' },
          次均医疗费用: { title: '次均医疗费用（元）', content: '-' },
          自费率: { title: '自费率', content: '-', unit: '%' },
          自付率: { title: '自付率', content: '-', unit: '%' },
          住院人次: { title: '住院人次', content: '-', unit: '' },
          门诊人次: { title: '门诊人次', content: '-', unit: '' },
          日均医保费用: { title: '日均医保费用（元）', content: '-' },
          住院次均费用: { title: '住院次均费用（元）', content: '-', unit: '' },
          门诊次均费用: { title: '门诊次均费用（元）', content: '-', unit: '' }
        },
        topChart: {
          color: [
            '#1bb2d8',
            '#ff8e00',
            '#5ab1ef',
            '#ffb980',
            '#d87a80',
            '#8d98b3',
            '#e5cf0d',
            '#97b552',
            '#95706d',
            '#dc69aa',
            '#07a2a4',
            '#9a7fd1',
            '#588dd5',
            '#f5994e',
            '#c05050',
            '#59678c',
            '#c9ab00',
            '#7eb00a',
            '#6f5553',
            '#c14089'
          ],
          title: {
            textStyle: {
              color: '#4c4c4c',
              fontWeight: 'normal',
              fontSize: 16
            }
          },
          legend: {
            itemGap: 3,
            top: 10,
            itemHeight: 10,
            orient: 'vertical',
            x: 'right',
            data: []
          },
          grid: {
            x: 160,
            x2: 0,
            width: 120
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '费用详情',
              type: 'pie',
              radius: '50%',
              center: ['40%', '50%'],
              data: []
            }
          ]
        },
        footChartsTabVal: 'first',
        hospitalizedCostsChart: {
          title: {
            text: '各科室住院次均费用对比',
            show: false,
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 400
            }
          },
          tooltip: { trigger: 'axis' },
          legend: {
            data: ['住院次均费用（元）', '人次', '住院次均费用标准（元）'],
            bottom: 0,
            left: 'center'
          },
          toolbox: { show: false },
          grid: {
            top: '40px',
            y2: '80px'
          },
          dataZoom: {
            bottom: 25
          },
          xAxis: [
            {
              type: 'category',
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              nameTextStyle: { color: '#c4c4c4' },
              min: 0,
              boundaryGap: [0.2, 0.2],
              axisLine: { show: true },
              axisLabel: { textStyle: { color: '#333' } },
              name: '金额（元）'
            },
            {
              type: 'value',
              scale: true,
              name: '人次',
              min: 0,
              splitNumber: 8,
              boundaryGap: [0.2, 0.2]
            }
          ],
          series: [
            {
              name: '住院次均费用（元）',
              type: 'bar',
              barWidth: '50%',
              barCategoryGap: '50%',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: []
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'top'
              //   }
              // }
            },
            {
              name: '人次',
              type: 'line',
              barWidth: '50%',
              barCategoryGap: '50%',
              yAxisIndex: 1,
              data: []
            },
            {
              name: '住院次均费用标准（元）',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: []
            }
          ]
        },
        clinicCostsChart: {
          title: {
            text: '各科室门诊次均费用对比',
            show: false,
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'normal',
              color: '#605d5c'
            }
          },
          tooltip: { trigger: 'axis' },
          legend: {
            data: ['门诊次均费用（元）', '人次', '门诊次均费用标准（元）'],
            bottom: 0,
            left: 'center'
          },
          toolbox: { show: false },
          grid: {
            top: '40px',
            y2: '80px'
          },
          dataZoom: {
            bottom: 25
          },
          xAxis: [
            {
              type: 'category',
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              nameTextStyle: { color: '#c4c4c4' },
              min: 0,
              boundaryGap: [0.2, 0.2],
              axisLine: { show: true },
              name: '金额（元）',
              axisLabel: {
                textStyle: { color: '#333' }
              }
            },
            {
              type: 'value',
              scale: true,
              nameTextStyle: { color: '#c4c4c4' },
              min: 0,
              boundaryGap: [0.2, 0.2],
              axisLine: { show: true },
              name: '人次',
              axisLabel: {
                textStyle: { color: '#333' }
              }
            }
          ],
          series: [
            {
              name: '门诊次均费用（元）',
              type: 'bar',
              barWidth: '50%',
              barCategoryGap: '50%',
              data: []
            },
            {
              yAxisIndex: 1,
              name: '人次',
              type: 'line',
              data: []
            },
            {
              name: '门诊次均费用标准（元）',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: []
            }
          ]
        }
      },
      allChart: {},
      source: {
        deptList: [], // 科室
        yblxList: [], // 参保类型
        yqList: [{ label: '二院', value: '1' }, { label: '华美', value: '2' }] // 院区
      }
    }
  },
  watch: {
    searchDate: function(val) {
      this.searchForm.startDate = val && val[0] ? val[0].formatDate('yyyy-MM-dd') : ''
      this.searchForm.endDate = val && val[1] ? val[1].formatDate('yyyy-MM-dd') : ''
    },
    szyqbm: function(val) {
      this.searchForm.szyqbm = val.toString()
    }
  }
}
</script>

<style scope>
.color-box {
  margin: 10px 0px;
}

.el-col.el-col-8 > h4 {
  text-align: center;
}

.tips-container {
  cursor: pointer;
  width: 100%;
  height: 65px;
  border-radius: 10px;
  text-align: center;
}

.tips-container .title,
.tips-container .content {
  font-size: 14px;
  margin-bottom: 4px;
}

.title,
.mark {
  font-size: 12px;
  margin-bottom: 4px;
}

.echars-filed {
  text-align: center;
}
</style>



