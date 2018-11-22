/*
 * updated by zhengtian on 2018/06/21
 * modify by
 * -------------------------------------------------
 */
import KindoApiCompare from '@/components/kindo-kpiCompare/KindoApiCompare'
import KindoOrganization from '@/components/kindo-organization/KindoOrganization'
import KindoOrgaLevel from '@/components/kindo-orgaLevel/KindoOrgaLevel'
import KindoPatientInfo from '@/components/kindo-patientInfo/index'
import KindoPatientInfoItem from '@/components/kindo-patientInfo-item/index'
export const mixinKPI = {
  components: {
    'kindo-kpiCompare': KindoApiCompare,
    'kindo-organization': KindoOrganization,
    'kindo-orgaLevel': KindoOrgaLevel,
    'kindo-patientInfo': KindoPatientInfo,
    'kindo-patientInfo-item': KindoPatientInfoItem
  },
  methods: {
    getDictionary(obj) {
      for (let k in this[obj]) {
        if (this[obj].hasOwnProperty(k)) {
          kindo.dictionary.getDictionary(k).then(res => {
            this[obj][k] = res || []
          })
        }
      }
    },
    loadTable(table) {
      this.$refs[table].reloadData()
    },
    showTable(row, visible, table) {
      if (row.hasOwnProperty('memberCode')) {
        this.showTableParams = {
          year: this.searchForm.year,
          quarter: this.searchForm.quarter,
          month: this.searchForm.month,
          yyCode: row.memberCode
        }
        this.showTableTitle = row.memberName
      } else if (row.hasOwnProperty('ksmc')) {
        this.showTableParams = Object.assign({}, this.searchForm)
        this.showTableParams.ksCode = row.ksbm
        delete this.showTableParams.compItems
        this.showTableTitle = row.ksmc
      }
      this[visible] = true
      this.$nextTick(() => {
        this.loadTable(table)
      })
    },
    // 柱状图
    setBar(xname, yname) {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: { color: 'rgba(0, 0, 0, 0)' }
          }
        },
        legend: {
          data: (function() {
            if (yname === '死亡率（%）') {
              return ['低风险组死亡率（%）', '中低风险组死亡率（%）']
            }
          })(),
          selected: (function() {
            if (yname === '死亡率（%）') {
              return { '低风险组死亡率（%）': true, '中低风险组死亡率（%）': true }
            }
          })()
        },
        grid: {
          top: 50,
          left: 50,
          right: 70,
          bottom: 60
        },
        xAxis: [
          {
            name: xname,
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            splitLine: {
              show: false
            }
            // axisLabel: {
            //   interval: 0,
            //   rotate: 40
            // }
          }
        ],
        yAxis: [
          {
            name: yname,
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        series: [],
        dataZoom: [
          {
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            start: 0,
            end: 0,
            bottom: 0
          }
        ]
      }
    },
    // 散点图
    setScatter(xname, yname) {
      return {
        tooltip: {
          formatter: function(obj) {
            if (obj.value.length > 1) {
              if (xname === 'DRG组数') {
                return `<div>${obj.name}</div>${xname}：${obj.value[0].toFixed(0)}<br>${yname}：${obj.value[1]}`
              } else {
                return `<div>${obj.name}</div>${xname}：${obj.value[0]}<br>${yname}：${obj.value[1]}`
              }
            } else {
              return `${obj.name}:${obj.value}`
            }
          }
        },
        xAxis: {
          type: 'value',
          name: xname,
          nameLocation: 'middle',
          nameGap: 25,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: yname,
          splitLine: {
            show: false
          }
        },
        series: [],
        dataZoom: [
          {
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            start: 0,
            end: 100,
            bottom: 0
          }
        ]
      }
    },
    setDataZoom(length, obj, number) {
      // debugger
      if (length > number) {
        obj.dataZoom[0].show = true
        obj.dataZoom[0].end = parseInt(number / length * 100)
      } else {
        obj.dataZoom[0].show = false
        obj.dataZoom[0].end = 100
      }
    },
    // 散点图
    async getScatter(echart, url) {
      let data = await this.$http.get(url, { params: this.searchForm })
      data = data.data
      if (data.rows.length > 0) {
        let value = []
        for (let item of data.rows) {
          value.push({ name: item.name, value: [this.getNum(item.valuex), this.getNum(item.valuey)] })
        }
        if (this.tabsBtn === '效率') {
          // 设定x, y轴 为坐标值为最大值 * 1.2
          let x = data.rows.map(item => item.valuex)
          let y = data.rows.map(item => item.valuey)
          x.push(parseInt(data.polex))
          y.push(parseInt(data.poley))
          echart.xAxis.max = Math.ceil(Math.max(...x) * 1.2)
          echart.yAxis.max = Math.ceil(Math.max(...y) * 1.2)
        }

        echart.series = [
          {
            data: value,
            type: 'scatter',
            markLine: {
              lineStyle: {
                normal: { type: 'solid', color: '#3fb1e3' }
              },
              data: [{ xAxis: data.polex, name: '平均值' }, { yAxis: data.poley, name: '平均值' }]
            }
          }
        ]
      } else {
        echart.series = []
      }
    },
    // 柱状图
    async getBarPerformance(echart, url) {
      let data = await this.$http.get(url, { params: this.searchForm })
      data = data.data.rows
      this.setDataZoom(data.length, echart, 20)
      let name = []
      let value = []
      for (let item of data) {
        name.push(item.name)
        value.push(this.getNum(item.value))
      }
      echart.xAxis[0].data = name
      echart.series = [{ type: 'bar', barWidth: '60%', barMaxWidth: '60', data: value }]
    },
    // 柱状图
    async getBarSafe(echart, url, order = 'low') {
      let params = Object.assign({}, this.searchForm)
      params.aqOrder = order
      let data = await this.$http.get(url, { params: params })
      data = data.data.rows
      this.setDataZoom(data.length, echart, 10)
      let name = []
      let med = []
      let low = []
      for (let item of data) {
        name.push(item.name)
        med.push(this.getNum(item.med))
        low.push(this.getNum(item.low))
      }
      echart.xAxis[0].data = name
      echart.series = [
        { type: 'bar', name: '中低风险组死亡率（%）', barMaxWidth: '30', barWidth: '30%', data: med },
        { type: 'bar', name: '低风险组死亡率（%）', barMaxWidth: '30', barWidth: '30%', data: low, show: false }
      ]
    },
    chartClick(params) {
      let selected = params.selected
      if (selected['低风险组死亡率（%）'] === true && selected['中低风险组死亡率（%）'] === false) {
        this.chartSafe.legend.selected['低风险组死亡率（%）'] = true
        this.chartSafe.legend.selected['中低风险组死亡率（%）'] = false
        this.getBarSafe(this.chartSafe, this.api.aq, 'low')
      } else if (selected['低风险组死亡率（%）'] === false && selected['中低风险组死亡率（%）'] === true) {
        this.chartSafe.legend.selected['低风险组死亡率（%）'] = false
        this.chartSafe.legend.selected['中低风险组死亡率（%）'] = true
        this.getBarSafe(this.chartSafe, this.api.aq, 'med')
      } else if (selected['低风险组死亡率（%）'] === true && selected['中低风险组死亡率（%）'] === true) {
        this.chartSafe.legend.selected['低风险组死亡率（%）'] = true
        this.chartSafe.legend.selected['中低风险组死亡率（%）'] = true
        this.getBarSafe(this.chartSafe, this.api.aq, 'low')
      }
    },
    tabsChange(name = '') {
      let val = this.tabsBtn
      if (val === '综合绩效') {
        this.chartPerformance = this.setBar(name, '指数')
        this.getBarPerformance(this.chartPerformance, this.api.zhjx)
      } else if (val === '产能') {
        this.chartProductivity = this.setScatter('DRG组数', 'CMI')
        this.getScatter(this.chartProductivity, this.api.cnzb)
      } else if (val === '效率') {
        this.chartEfficiency = this.setScatter('费用消耗指数', '时间消耗指数')
        this.getScatter(this.chartEfficiency, this.api.efficiency)
      } else if (val === '安全') {
        this.chartSafe = this.setBar(name, '死亡率（%）')
        this.getBarSafe(this.chartSafe, this.api.aq)
      }
    },
    async compareStart(url, filed, prevParams) {
      let compareSel = this.compare.selection
      if (compareSel.length >= 2) {
        let params = prevParams
        let id = []
        for (let item of compareSel) {
          id.push(item[filed])
        }
        params.compItems = id.join(',')
        this.compare.selection = []
        let data = await this.$http.get(url, { params: params })
        this.compare.resultData.data = data.data.rows

        this.compare.selectVisi = false
        this.compare.resultVisi = true
      } else {
        this.$message({
          message: '请至少选择2个进行对比',
          type: 'warning'
        })
      }
    },
    async compareStartDept(url, filed, prevParams) {
      let compareSel = this.compare.selection
      if (compareSel.length >= 2) {
        let params = prevParams
        let id = []
        for (let item of compareSel) {
          id.push(item[filed])
        }
        params.compItems = id.join(',')
        this.compare.selection = []
        let data = await this.$http.get(url, { params: params })
        data = data.data.rows
        for (let i in data) {
          for (let sel of compareSel) {
            if (data[i].itemCode === sel.ksbm) {
              data[i] = Object.assign(data[i], {
                drgNum: sel.drgnum,
                rwt: sel.zrwt,
                inDrgNum: sel.rzbls,
                cmi: sel.cmi,
                timeCostSi: sel.timesi,
                feeCostSi: sel.costsi,
                lowDieRate: sel.lowswl
              })
              break
            }
          }
        }
        this.compare.resultData.data = data
        this.compare.selectVisi = false
        this.compare.resultVisi = true
      } else {
        this.$message({
          message: '请至少选择2个进行对比',
          type: 'warning'
        })
      }
    },
    isCompare(row, filed) {
      let obj = this.compare.selection
      if (obj.length > 0) {
        let result = obj.filter(item => {
          return item[filed] === row[filed]
        })
        if (result.length > 0) {
          return true
        } else {
          return false
        }
      }
    },
    compareSel(index, row) {
      this.compare.selectVisi = true
      if (this.compare.selection.length >= 5) {
        this.$message({
          message: '对比最多为5个',
          type: 'warning'
        })
      } else {
        this.compare.selection.push(row)
      }
    },
    compareRemoveSingle(row, index) {
      this.compare.selection.splice(index, 1)
    },
    compareRemoveAll() {
      this.compare.selection = []
      this.compare.selectVisi = false
    },
    queryBa(row) {
      // this.detailBa.hosName = row.yyName
      this.detailBa.bahId = row.id
      this.detailBa.visible = true
    },
    getNum(val, precision = 2) {
      if (val || val === 0) {
        // debugger
        return val.formatNum(precision)
      } else {
        return '-'
      }
    },
    getPercent(val) {
      if (val) {
        return val.formatNum() + '%'
      } else if (val === 0) {
        return val
      } else {
        return '-'
      }
    },
    // 导出
    exportTable(url, params) {
      kindo.util.downloadFile(url, params)
    }
  }
}
export default mixinKPI
