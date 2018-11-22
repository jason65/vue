/*
 * updated by zhengtian on 2018/06/21
 * modify by
 * -------------------------------------------------
 */
import KindoDateRange from '@/components/kindo-date-range/index'
import KindoOrganization from '@/components/kindo-organization/KindoOrganization'
import KindoOrgaLevel from '@/components/kindo-orgaLevel/KindoOrgaLevel'
import KindoPatientInfo from '@/components/kindo-patientInfo/index'
import KindoPatientInfoItem from '@/components/kindo-patientInfo-item/index'
export const medical = {
  components: {
    'kindo-date-range': KindoDateRange,
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
      this.getSumData()
    },
    async getSumData() {
      let data = await this.$http.get(this.api.querySum, { params: this.searchForm })
      data = data.data
      if (data !== null) {
        this.sumData = [
          '合计',
          '',
          '',
          this.getNum(data.sumNum, 0),
          this.getNum(data.errorNum, 0),
          this.getNum(data.hqmsNum, 0),
          this.getNum(data.drgNum, 0),
          this.getNum(data.inBa, 0),
          this.getNum(data.notInBa, 0)
        ]
      }
    },
    getSummaries() {
      return this.sumData
    },
    async getSumDataDetail() {
      let data = await this.$http.get(this.api.detailSum, { params: this.showForm })
      data = data.data
      if (data !== null) {
        this.sumDataDetail = [
          '合计',
          '',
          '',
          this.getNum(data.sumNum, 0),
          this.getNum(data.errorNum, 0),
          this.getNum(data.hqmsNum, 0),
          this.getNum(data.drgNum, 0),
          this.getNum(data.inBa, 0),
          this.getNum(data.notInBa, 0)
        ]
      }
    },
    getSummariesDetail() {
      return this.sumDataDetail
    },
    // 柱状图
    setBar(xname) {
      return {
        // title: {
        //   text: '问题病案',
        //   textStyle: {
        //     color: 'rgb(0,153,204)',
        //     fontSize: 14,
        //     fontWeight: 'bold'
        //   }
        // },
        grid: {
          top: 50,
          left: 50,
          right: 70,
          bottom: 60
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: { color: 'rgba(0, 0, 0, 0)' }
          },
          formatter: params => {
            let data = this.chartData
            let html = `<div>${params[0].name}</div>`
            let item = {}
            if (xname === '医院名称') {
              item = data.filter(item => item.memberName === params[0].name)[0]
            } else if (xname === '标准科室') {
              item = data.filter(item => item.deptName === params[0].name)[0]
            }
            if (params.length >= 2) {
              html += `总病案数：${item.sumNum === null ? '-' : this.getNum(item.sumNum, 0)}<br/>问题病案数：${item.errorNum}<br/>HQMS校验未通过：${params[0]
                .value}<br/>DRG校验未通过：${params[1].value}<br/>`
            } else {
              if (params[0].seriesName === 'HQMS校验未通过') {
                html += `总病案数：${item.sumNum === null ? '-' : this.getNum(item.sumNum, 0)}<br/>问题病案数：${item.errorNum}<br/>HQMS校验未通过：${params[0]
                  .value}<br/>DRG校验未通过：-<br/>`
              } else {
                html += `总病案数：${item.sumNum === null
                  ? '-'
                  : this.getNum(item.sumNum, 0)}<br/>问题病案数：${item.errorNum}<br/>HQMS校验未通过：-<br/>DRG校验未通过：${params[0].value}<br/>`
              }
            }
            return html
          }
        },
        legend: {
          data: ['HQMS校验未通过', 'DRG校验未通过']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
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
        series: [
          {
            name: 'HQMS校验未通过',
            type: 'bar',
            stack: 'aa',
            barMaxWidth: '60',
            data: []
          },
          {
            name: 'DRG校验未通过',
            type: 'bar',
            stack: 'aa',
            barMaxWidth: '60',
            data: []
          }
        ],
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
    // 柱状图
    async getBar(echart, url) {
      // let data = [{memberName: '1', hqmsNum: '100', drgNum: '500', sumNum: '200', errorNum: '100'}, {memberName: '2', hqmsNum: '100', drgNum: '500', sumNum: '200', errorNum: '100'}]
      let data = await this.$http.get(url, { params: this.searchForm })
      data = data.data
      this.chartData = data
      this.setDataZoom(data.length, echart, 20)
      let name = []
      let hqms = []
      let drg = []
      for (let item of data) {
        if (item.hasOwnProperty('memberName')) {
          name.push(item.memberName)
        } else if (item.hasOwnProperty('deptName')) {
          name.push(item.deptName)
        }
        hqms.push(item.hqmsNum)
        drg.push(item.drgNum)
      }
      echart.xAxis[0].data = name
      echart.series[0].data = hqms
      echart.series[1].data = drg
    },
    async expandChange(row, table) {
      if (!row.hasOwnProperty('child')) {
        let tableData = this.$refs[table].internalData
        let index = 0
        let dropdownForm = Object.assign({}, this.searchForm)
        if (row.hasOwnProperty('memberCode')) {
          if (table === 'detail') {
            dropdownForm.deptCode = this.showForm.deptCode
          }
          dropdownForm.memberCode = row.memberCode
          index = tableData.findIndex(val => val.memberCode === row.memberCode)
        }
        if (row.hasOwnProperty('deptCode')) {
          if (table === 'detail') {
            dropdownForm.memberCode = this.showForm.memberCode
          }
          dropdownForm.deptCode = row.deptCode
          index = tableData.findIndex(val => val.deptCode === row.deptCode)
        }
        // let expendData = [{errName: '性别与诊断编码校验', num: '20', type: 'HQMS校验'}, {errName: '编码共存', num: '20', type: 'DRG校验'}]
        let expendData = await this.$http.get(this.api.dropdown, { params: dropdownForm })
        let childData = { hqms: { title: '', data: [] }, drg: { title: '', data: [] } }
        expendData = expendData.data
        if (expendData.length > 0) {
          childData.hqms.title = 'HQMS校验'
          childData.drg.title = 'DRG校验'
          for (let item of expendData) {
            if (item.type === 'HQMS校验') {
              childData.hqms.data.push({ label: item.errName, value: item.num })
            } else if (item.type === 'DRG校验') {
              childData.drg.data.push({ label: item.errName, value: item.num })
            }
          }
        } else {
          childData.hqms.title = '暂无数据'
        }
        this.$set(this.$refs[table].internalData, index, Object.assign(row, { child: childData }))
      }
    },
    getRowKey(row) {
      if (row.hasOwnProperty('memberCode')) {
        return row.memberCode
      } else if (row.hasOwnProperty('deptCode')) {
        return row.deptCode
      }
    },
    showTable(row, visible, table, errorType) {
      this.showForm = Object.assign({}, this.searchForm)
      if (row.hasOwnProperty('memberCode')) {
        this.showForm.memberCode = row.memberCode
      }
      if (row.hasOwnProperty('deptCode')) {
        this.popupTitle = row.deptName
        this.showForm.deptCode = row.deptCode
      }
      this.showForm.errType = errorType
      this[visible] = true
      this.$nextTick(() => {
        this.$refs[table].reloadData()
      })
      if (table === 'detail') {
        this.getSumDataDetail()
      }
    },
    queryBa(row) {
      // this.detailBa.hosName = row.memberName
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
    // getPercent(val) {
    //   if (val) {
    //     return val + '%'
    //   } else if (val === 0) {
    //     return val
    //   } else {
    //     return '-'
    //   }
    // },
    // 导出
    exportTable(url, params) {
      kindo.util.downloadFile(url, params)
    }
  }
}
export default medical
