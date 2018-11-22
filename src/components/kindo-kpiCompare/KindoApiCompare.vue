<template>
  <div>
  <el-row>
    <el-col :span="10">
      <kindo-chart :options="radarChart" autoResize></kindo-chart>
    </el-col>
    <el-col :span="14">
      <table class="table-list">
        <tr>
          <th>指标</th>
          <th v-for="(item, index) in table.header" :key="index">{{item}}</th>
        </tr>
        <template v-for="(item, index) in table.zb">
          <tr v-if="item.title !== compareData.unused + '个数'" :key="index">
            <td class="normal" v-text="item.title"></td>
            <td v-for="(value,index) in item.data" :key="index" v-text="value"></td>
          </tr>
        </template>
        
      </table>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="10">
      <kindo-chart :options="stackbar" autoResize></kindo-chart>
    </el-col>
    <el-col :span="14">
      <table class="table-list">
        <tr>
          <th>指标</th>
          <th v-for="(item, index) in table.header" :key="index">{{item}}</th>
        </tr>
        <tr v-for="(item, index) in table.fy" :key="index">
          <td class="normal" v-text="item.title"></td>
          <td v-for="(value,index) in item.data" :key="index" v-text="getNum(value)"></td>
        </tr>
      </table>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import 'echarts/lib/chart/radar'
export default {
  name: 'kindo-kpiCompare',
  props: {
    compareData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      radarChart: {
        title: {
          text: 'DRG指标概览'
        },
        legend: {
          data: [],
          right: 0,
          orient: 'vertical',
          itemWidth: 10,
          itemHeight: 10
        },
        tooltip: {
          formatter: function (obj) {
            if (obj.value.length > 1) {
              return `<div>${obj.name}</div><div>DRG组数：${obj.value[0]}<br/>CMI值：${obj.value[1]}<br/>时间消耗指数：${obj.value[2]}<br/>费用消耗指数：${obj.value[3]}<br/>低风险组死亡率（%）：${obj.value[4]}<br/>中低风险组死亡率（%）：${obj.value[5]}</div>`
            } else {
              return obj.name + ' : ' + obj.value
            }
          }
        },
        radar: {
          radius: '60%',
          center: ['50%', '50%'],
          name: {
            textStyle: {
              color: '#444'
            }
          },
          splitNumber: 4,
          indicator: [
            { name: 'DRG组数' },
            { name: 'CMI值' },
            { name: '时间消耗指数' },
            { name: '费用消耗指数' },
            { name: '低风险组死亡率' },
            { name: '中低风险组死亡率' }
          ]
        },
        series: [
          {
            name: '对比值',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: []
          }
        ]
      },
      stackbar: {
        title: {
          text: '费用构成'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: { color: 'rgba(0, 0, 0, 0)' }
          },
          formatter:
            '<div>{b0}</div>综合服务类（%）：{c0}<br />诊断类（%）：{c1}<br />治疗类（%）：{c2}<br />康复类（%）：{c3}<br />中医类（%）：{c4}<br />药品类（%）：{c5}<br />血液和血液制品类（%）：{c6}<br />材料类（%）：{c7}<br />其他(%)：{c8}'
        },
        grid: {
          top: '15%',
          bottom: '20%',
          containLabel: true
        },
        legend: {
          data: ['综合医疗服务类', '诊断类', '治疗类', '康复类', '中医类', '药品类', '血液和血液制品类', '材料类', '其他'],
          bottom: 0
        },
        yAxis: [
          {
            name: '占比',
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        series: [
          {
            name: '综合医疗服务类',
            type: 'bar',
            stack: '总量',
            barWidth: '60%', 
            barMaxWidth: '60',
            data: []
          },
          {
            name: '诊断类',
            type: 'bar',
            stack: '总量',
            data: []
          },
          {
            name: '治疗类',
            type: 'bar',
            stack: '总量',
            data: []
          },
          {
            name: '康复类',
            type: 'bar',
            stack: '总量',
            data: []
          },
          {
            name: '中医类',
            type: 'bar',
            stack: '总量',
            data: []
          },
          {
            name: '药品类',
            type: 'bar',
            stack: '总量',
            data: []
          },
          {
            name: '血液和血液制品类',
            type: 'bar',
            stack: '总量',
            data: []
          },
          {
            name: '材料类',
            type: 'bar',
            stack: '总量',
            data: []
          },
          {
            name: '其他',
            type: 'bar',
            stack: '总量',
            data: []
          }
        ]
      },
      table: {
        header: [],
        zb: [
          { title: '入组病案数', data: [] },
          { title: 'MDC个数', data: [] },
          { title: 'ADRG组数', data: [] },
          { title: 'DRG组数', data: [] },
          { title: '总权重', data: [] },
          { title: 'CMI值', data: [] },
          { title: '时间消耗指数', data: [] },
          { title: '费用消耗指数', data: [] },
          { title: '低风险组死亡率（%）', data: [] },
          { title: '疑难病案数', data: [] },
          { title: '三四级手术占比（%）', data: [] }
        ],
        fy: [
          { title: '综合医疗服务类（%）', data: [] },
          { title: '诊断类（%）', data: [] },
          { title: '治疗类（%）', data: [] },
          { title: '康复类（%）', data: [] },
          { title: '中医类（%）', data: [] },
          { title: '药品类（%）', data: [] },
          { title: '血液及血液制品类（%）', data: [] },
          { title: '耗材类（%）', data: [] },
          { title: '其他类（%）', data: [] },
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  watch: {
    'compareData.data'(val) {
      console.log(val)
      this.init()
    }
  },
  methods: {
    init() {
      let title = []
      this.radarChart.series[0].data = []
      for (let i = 0; i <= 10; i++) {
        this.table.zb[i].data = []
      }
      for (let i = 0; i <= 8; i++) {
        this.table.fy[i].data = []
        this.stackbar.series[i].data = []
      }

      if (this.compareData.data.length > 0) {
        for(let item of this.compareData.data) {
          // title赋值
          title.push(item.itemName)

          // 雷达图赋值
          this.radarChart.series[0].data.push({
            value: [this.getNum(item.drgNum, 0), this.getNum(item.cmi), this.getNum(item.timeCostSi), this.getNum(item.feeCostSi), this.getNum(item.lowDieRate), this.getNum(item.midLowDieRate)],
            name: item.itemName
          })

           // 柱状图赋值
          this.stackbar.series[0].data.push(this.getNum(item.zhfyRate))
          this.stackbar.series[1].data.push(this.getNum(item.zdfyRate))
          this.stackbar.series[2].data.push(this.getNum(item.zlfyRate))
          this.stackbar.series[3].data.push(this.getNum(item.kffyRate))
          this.stackbar.series[4].data.push(this.getNum(item.zylfyRate))
          this.stackbar.series[5].data.push(this.getNum(item.ypfyRate))
          this.stackbar.series[6].data.push(this.getNum(item.xyfyRate))
          this.stackbar.series[7].data.push(this.getNum(item.clfyRate))
          this.stackbar.series[8].data.push(this.getNum(item.qtfyRate))

          // 表格赋值
          this.table.zb[0].data.push(this.getNum(item.inDrgNum, 0))
          if (this.compareData.unused !== 'MDC') {
            this.table.zb[1].data.push(this.getNum(item.mdcNum, 0))
          }
          this.table.zb[2].data.push(this.getNum(item.adrgNum, 0))
          this.table.zb[3].data.push(this.getNum(item.drgNum, 0))
          this.table.zb[4].data.push(this.getNum(item.rwt))
          this.table.zb[5].data.push(this.getNum(item.cmi))
          this.table.zb[6].data.push(this.getNum(item.timeCostSi))
          this.table.zb[7].data.push(this.getNum(item.feeCostSi))
          this.table.zb[8].data.push(this.getNum(item.lowDieRate))
          this.table.zb[9].data.push(this.getNum(item.ynbls, 0))
          this.table.zb[10].data.push(this.getNum(item.sszb))

          this.table.fy[0].data.push(item.zhfyRate)
          this.table.fy[1].data.push(item.zdfyRate)
          this.table.fy[2].data.push(item.zlfyRate)
          this.table.fy[3].data.push(item.kffyRate)
          this.table.fy[4].data.push(item.zylfyRate)
          this.table.fy[5].data.push(item.ypfyRate)
          this.table.fy[6].data.push(item.xyfyRate)
          this.table.fy[7].data.push(item.clfyRate)
          this.table.fy[8].data.push(item.qtfyRate)
        }
        this.radarChart.legend.data = title
        this.stackbar.xAxis[0].data = title
        this.table.header = title
      }
    },
    getNum(val, precision = 2) {
      if (val || val === 0) {
        // debugger
        return val.formatNum(precision)
      } else {
        return '-'
      }
    }
    // getPercent(val) {
    //   if (val) {
    //     return val.formatNum()
    //   } else if (val === 0) {
    //     return val
    //   } else {
    //     return '-'
    //   }
    // }
  }
}
</script>
<style scoped>
.table-list {
  table-layout: fixed;
  text-align: right;
  color: #333;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.table-list td {
  border-right: 1px solid #eee;
  padding: 10px 15px;
  height: 30px;
  color: #333;
  font-size: 18px;
  width: 150px;
}

.table-list td.normal {
  color: #666;
  font-size: 13px;
  white-space: nowrap;
}

.table-list td:last-child {
    border-right: 0;
}

.table-list th {
    padding: 0 15px;
    color: #666;
    font-size: 14px;
    vertical-align: top;
}
</style>

