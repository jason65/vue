/*
 * updated by zhengtian on 2018/06/21
 * modify by
 * -------------------------------------------------
 */
import KindoOrganization from '@/components/kindo-organization/KindoOrganization'
import KindoOrgaLevel from '@/components/kindo-orgaLevel/KindoOrgaLevel'
import KindoPatientInfo from '@/components/kindo-patientInfo/index'
import KindoPatientInfoItem from '@/components/kindo-patientInfo-item/index'
export const difficult = {
  components: {
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
    async getTableLabel(url) {
      let data = await this.$http.get(url)
      data = data.data[0]
      this.formTransit.tableLabel = [data.rwRangeExpression_1, data.rwRangeExpression_2, data.rwRangeExpression_3, data.rwRangeExpression_4]
      this.formTransit.rwVal = [data.v1, data.v2, data.v3, data.v4]
    },
    async getSumData() {
      let data = await this.$http.get(this.api.queryHosDataSum, { params: this.searchForm })
      data = data.data
      if (data !== null) {
        this.sumData = [
          '合计',
          '',
          this.getNum(data.caseSumTotal, 0),
          this.getNum(data.casesNumTotal_1, 0),
          this.getNum(data.ratioTotal_1),
          this.getNum(data.casesNumTotal_2, 0),
          this.getNum(data.ratioTotal_2),
          this.getNum(data.casesNumTotal_3, 0),
          this.getNum(data.ratioTotal_3),
          this.getNum(data.casesNumTotal_4, 0),
          this.getNum(data.ratioTotal_4)
        ]
      }
    },
    getSummaries() {
      return this.sumData
    },
    showTable(row, visible, table, type) {
      this.showTableParams = Object.assign({}, this.searchForm)
      if (row.hasOwnProperty('stdksdm')) {
        if (type) {
          Object.assign(this.showTableParams, { rangeExpression: type })
        }
        this.showTableParams.stdksdm = row.stdksdm
        this.showTableTitle = row.stdksmc
      } else if (row.hasOwnProperty('memberCode')) {
        if (type) {
          Object.assign(this.showTableParams, { rangeExpression: type })
        }
        this.showTableParams.memberCode = row.memberCode
        this.showTableTitle = row.memberName
      }

      this[visible] = true
      this.$nextTick(() => {
        this.$refs[table].reloadData()
      })
      // if (table === 'detail') {
      //   this.getSumData(this.api.detailSum, this.sumDataDetail)
      // }
    },
    showTableSum() {
      this.$nextTick(function() {
        const self = this

        this.$refs.table.$el.querySelectorAll('.el-table__footer-wrapper table tbody td:not(.is-hidden)').forEach((item, index) => {
          if (index % 2 === 0) {
            item.children[0].style.color = '#03bdd6'
            item.children[0].style.cursor = 'pointer'

            item.children[0].onclick = () => {
              let type = self.formTransit.rwVal[index / 2]
              self.showTableParams = Object.assign({}, this.searchForm)
              Object.assign(this.showTableParams, { rangeExpression: type })
              self['detailInDrg'] = true
              self.$nextTick(() => {
                self.$refs['inDrg'].reloadData()
              })
            }
          }
        })
      })
    },
    queryBa(row) {
      // this.detailBa.hosName = row.memberName
      this.detailBa.bahId = row.id
      this.detailBa.visible = true
    },
    // 柱状图
    setBar(xname) {
      // let chartData = this.chartData
      return {
        legend: {
          data: [],
          left: 'center'
        },
        grid: {
          top: 50,
          left: 50,
          right: 70,
          bottom: 60
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        xAxis: [
          {
            name: xname,
            type: 'category',
            data: [],
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            name: '病案数',
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
            end: 100,
            bottom: 0
          }
        ]
      }
    },
    setDataZoom(length, obj, number) {
      if (length > number) {
        obj.dataZoom[0].show = true
        obj.dataZoom[0].end = parseInt(number / length * 100)
      } else {
        obj.dataZoom[0].show = false
        obj.dataZoom[0].end = 100
      }
    },
    // 柱状图
    async getBar(echart, url) {
      let data = await this.$http.get(url, { params: this.searchForm })
      data = data.data
      this.setDataZoom(data.length, echart, 20)
      if (data.length > 0) {
        let result = {
          name: [],
          rwRange: this.formTransit.tableLabel,
          casesNum_1: [],
          casesNum_2: [],
          casesNum_3: [],
          casesNum_4: []
        }
        for (let item of data) {
          if (item.hasOwnProperty('stdksmc')) {
            result.name.push(item.stdksmc)
          } else if (item.hasOwnProperty('memberName')) {
            result.name.push(item.memberName)
          }
          result.casesNum_1.push(item.casesNum_1)
          result.casesNum_2.push(item.casesNum_2)
          result.casesNum_3.push(item.casesNum_3)
          result.casesNum_4.push(item.casesNum_4)
        }

        // 图表赋值
        echart.legend.data = result.rwRange
        echart.xAxis[0].data = result.name
        echart.series = []
        for (let i in result.rwRange) {
          let j = parseInt(i) + 1
          let obj = {
            name: result.rwRange[i],
            type: 'bar',
            barWidth: '60%',
            barMaxWidth: '60',
            stack: '总量',
            data: result['casesNum_' + j]
          }
          echart.series.push(obj)
        }
      }
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
export default difficult
