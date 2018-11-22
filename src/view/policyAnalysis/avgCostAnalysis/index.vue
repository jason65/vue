<template>
  <div>
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
          <!-- <el-checkbox-group v-model="szyqbm" :min="1" :max="2"> -->
          <el-checkbox-group v-model="szyqbm">
            <el-checkbox v-for="city in source.yqList" :label="city.value" :key="city.value">{{city.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>

      <el-form :model="searchForm" inline label-width="100px" slot="more">
        <el-form-item label="参保类型：">
          <el-select v-model="searchForm.yblx" filterable clearable style="width:160px">
            <el-option v-for="item in source.yblxList" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </kindo-card-search>

    <kindo-card>
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in topCards" :key="item.title">
          <kindo-colorbox class="ccb" :theme="item.content > item.standard ? 'warning' : 'blue'">
            <div class="tips-container bgblue cost1 ">
              <div class="title">{{ item.title }}</div>
              <div class="content">{{ item.content + item.contentUnit }}</div>
              <!-- <div class="mark">{{ item.standard + item.standardUnit }}</div> -->
            </div>
          </kindo-colorbox>
        </el-col>
      </el-row>
    </kindo-card>

    <kindo-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <div style="text-align: center;margin-top:8px;">
            <span class="exportTitle">科室费用排序TOP</span>
            <span class="exportSpan">
              <el-select v-model="deptTopNum" style="width:80px" @change="getKsfyChart">
                <el-option v-for="(item,idx) in [10,15,20,25]" :key="idx" :value="item">{{item}}</el-option>
              </el-select>
            </span>
          </div>
          <kindo-chart :options="deptChart" ref="deptChart"></kindo-chart>
        </el-col>
        <el-col :span="12">
          <div style="text-align: center;margin-top:8px;">
            <span class="exportTitle">疾病费用排序TOP</span>
            <span class="exportSpan">
              <el-select v-model="drgsTopNum" style="width:80px" @change="getDbzfyChart">
                <el-option v-for="(item,idx) in [10,15,20,25]" :key="idx" :value="item">{{item}}</el-option>
              </el-select>
            </span>
          </div>
          <kindo-chart :options="drgsChart" ref="drgsChart"></kindo-chart>
        </el-col>
      </el-row>
    </kindo-card>

    <kindo-card>
      <kindo-table ref="table" :url="api.queryDbzList" :queryParam="searchForm">
        <el-table-column min-width="160" label="科室名称" prop="ksmc" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="160" label="参保类型" prop="yblx" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="总费用" prop="zfy" align="right" header-align="center" show-overflow-tooltip :formatter="kindo.util.formatNum"></el-table-column>
        <el-table-column width="100" label="出院人次" prop="cyrc" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="100" label="次均住院费用" prop="cjzyfy" align="right" header-align="center" show-overflow-tooltip :formatter="kindo.util.formatNum"></el-table-column>
        <el-table-column width="100" label="操作" prop="total_costs" align="center" header-align="center" show-overflow-tooltip fixed="right">
          <template slot-scope="scope">
            <el-button title="查看详情" type="text" icon="el-icon-delete" @click="show(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </kindo-table>
    </kindo-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="80%">
      <el-form :model="dialogSearchForm" inline label-width="120px">
        <el-form-item label="住院号：">
          <el-input v-model="dialogSearchForm.zyh" style="width:140px"></el-input>
        </el-form-item>
        <el-form-item label="开立医生/编码：">
          <el-input v-model="dialogSearchForm.klys" style="width:140px"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="getDialogData">查询</el-button>
          <el-button icon="el-icon-download" @click="dialogExport">导出</el-button>
        </el-form-item>
      </el-form>
      <kindo-table ref="dialogTable" :url="api.queryDbzDetail" :queryParam="Object.assign({},searchForm,dialogSearchForm,{dept_id: this.currentRow.ksdm,yblx: this.currentRow.yblxdm})">
        <el-table-column width="160" label="患者姓名" prop="xm" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="性别" prop="xb" align="left" header-align="center" show-overflow-tooltip :formatter="(r,c,v)=>{return v !== null ? kindo.dictionary.getLabel(source.sex, v):'-'}"></el-table-column>
        <el-table-column width="160" label="住院号" prop="zyh" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="床位号" prop="cwh" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="开立医生" prop="klysmc" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="医生编码" prop="klysdm" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="住院科室" prop="zyks" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="住院费用" prop="zyfy" align="right" header-align="center" show-overflow-tooltip :formatter="kindo.util.formatNum"></el-table-column>
        <el-table-column width="120" label="结算日期" prop="jsrq" align="center" header-align="center" show-overflow-tooltip :formatter="kindo.util.formatDate"></el-table-column>
        <el-table-column width="120" label="住院天数" prop="zyts" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="120" label="入院时间" prop="rysj" align="center" header-align="center" show-overflow-tooltip :formatter="kindo.util.formatDate"></el-table-column>
        <el-table-column width="120" label="出院时间" prop="cysj" align="center" header-align="center" show-overflow-tooltip :formatter="kindo.util.formatDate"></el-table-column>
      </kindo-table>
    </el-dialog>
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
      this.$http.get(config.api.getTop, { params: this.searchForm }).then(res => {
        for (let key in this.topCards) {
          if (this.topCards.hasOwnProperty(key)) {
            let item = this.topCards[key]
            item.content = '-'
            item.contentUnit = ''
            // item.standard = '-'
            // item.standardUnit = ''
          }
        }

        res.data.forEach(item => {
          if (this.topCards.hasOwnProperty(item.title)) {
            this.topCards[item.title].title = item.title === null ? '-' : item.title
            this.topCards[item.title].content = item.content === null ? '-' : Number.parseFloat(item.content)
            // this.topCards[item.title].standard = item.standard === null ? '-' : Number.parseFloat(item.standard)
            this.topCards[item.title].contentUnit = item.content === null ? '' : item.unit
            // this.topCards[item.title].standardUnit = item.standard === null ? '' : item.unit

            this.topCards = Object.assign({}, this.topCards)
          }
        })
      })
      this.getKsfyChart()
      this.getDbzfyChart()
      this.$refs.table.loadData()
    },
    getKsfyChart() {
      this.$http.get(config.api.getKsfyChart, { params: Object.assign({}, this.searchForm, { topNum: this.deptTopNum }) }).then(res => {
        let dateArr = []
        let valArr1 = []
        let valArr2 = []

        if (res.data && res.data.length > 0) {
          res.data.forEach(o => {
            dateArr.push(o.ksmc)
            valArr1.push({ name: o.ksmc, value: o.je })
            valArr2.push({ name: o.ksmc, value: o.rc })
          })
        }

        Object.assign(this.deptChart, {
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
              name: '金额(万元)',
              type: 'bar',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: valArr1,
              barWidth: '50%',
              barCategoryGap: '50%'
            },
            {
              name: '人次',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 1,
              data: valArr2
            }
          ]
        })
      })
    },
    getDbzfyChart() {
      this.$http.get(config.api.getDbzfyChart, { params: Object.assign({}, this.searchForm, { topNum: this.drgsTopNum }) }).then(res => {
        let dateArr = []
        let valArr1 = []
        let valArr2 = []

        if (res.data && res.data.length > 0) {
          res.data.forEach(o => {
            dateArr.push(o.jbmc)
            valArr1.push({ name: o.jbmc, value: o.je })
            valArr2.push({ name: o.jbmc, value: o.rc })
          })
        }

        Object.assign(this.drgsChart, {
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
              name: '金额(万元)',
              type: 'bar',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: valArr1,
              barWidth: '50%',
              barCategoryGap: '50%'
            },
            {
              name: '人次',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 1,
              data: valArr2
            }
          ]
        })
      })
    },
    getDialogData() {
      this.$refs.dialogTable.loadData()
    },
    dialogExport() {
      kindo.util.downloadFile(
        config.api.exportDbzDetail,
        Object.assign({}, this.searchForm, this.dialogSearchForm, {
          dept_id: this.currentRow.ksdm,
          yblx: this.currentRow.yblxdm
        })
      )
    },
    show(row) {
      this.currentRow = row
      this.dialogTitle = row.ksmc
      this.dialogVisible = true

      this.$nextTick(function() {
        this.$refs.dialogTable.loadData()
      })
    }
  },
  created() {
    this.$http.get(config.api.getDeptList).then(res => {
      this.source.deptList = res.data
    })

    kindo.dictionary.getDictionary('CBLX_CODE').then(res => {
      this.source.yblxList = res
    })

    kindo.dictionary.getDictionary('GB_T2261_1').then(res => {
      this.source.sex = res || []
    })
  },
  data() {
    return {
      api: {
        queryDbzList: config.api.queryDbzList,
        queryDbzDetail: config.api.queryDbzDetail
      },
      searchDate: [new Date().proDate('{%d-3}'), new Date()],
      szyqbm: ['1', '2'], //院区
      searchForm: {
        startDate: kindo.util.formatDate(new Date().proDate('{%d-3}')), // 结算日期-开始
        endDate: kindo.util.formatDate(new Date()), // 结算日期-结束
        dept_id: '', // 科室ID
        szyqbm: '1,2', // 院区
        yblx: '' // 参保类型
      },
      dialogSearchForm: {
        zyh: '', // 住院号
        klys: '' // 开立医生
      },
      topCards: {
        住院人次: { title: '住院人次', content: '-', contentUnit: '', standard: '-', standardUnit: '' },
        住院人数: { title: '住院人数', content: '-', contentUnit: '', standard: '-', standardUnit: '' },
        住院总费用: { title: '住院总费用（万元）', content: '-', contentUnit: '', standard: '-', standardUnit: '' },
        次均住院费用: { title: '次均住院费用', content: '-', contentUnit: '', standard: '-', standardUnit: '' }
      },
      source: {
        deptList: [],
        yqList: [{ label: '二院', value: '1' }, { label: '华美', value: '2' }], // 院区
        sex: [],
        yblxList: []
      },
      deptChart: {
        // title: {
        //   text: '科室费用排序TOP',
        //   show: true,
        //   left: 'center',
        //   textStyle: {
        //     fontSize: 16,
        //     fontWeight: 'normal',
        //     color: '#605d5c'
        //   }
        // },
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['金额(万元)', '人次'],
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
            name: '金额(万元)',
            min: 0,
            boundaryGap: [0.2, 0.2],
            axisLine: { show: true },
            axisLabel: { textStyle: { color: '#333' } }
          },
          {
            type: 'value',
            scale: true,
            nameTextStyle: { color: '#c4c4c4' },
            name: '人次',
            min: 0,
            boundaryGap: [0.2, 0.2],
            axisLine: { show: true },
            axisLabel: { textStyle: { color: '#333' } }
          }
        ],
        series: [
          {
            name: '金额(万元)',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: [],
            barWidth: '50%',
            barCategoryGap: '50%'
          },
          {
            name: '人次',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      drgsChart: {
        // title: {
        //   text: '单病种费用排序TOP',
        //   show: true,
        //   left: 'center',
        //   textStyle: {
        //     fontSize: 16,
        //     fontWeight: 'normal',
        //     color: '#605d5c'
        //   }
        // },
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['金额(万元)', '人次'],
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
            xAxisIndex: 0,
            yAxisIndex: 0,
            scale: true,
            nameTextStyle: { color: '#c4c4c4' },
            name: '金额(万元)',
            min: 0,
            boundaryGap: [0.2, 0.2],
            axisLine: { show: true },
            axisLabel: { textStyle: { color: '#333' } }
          },
          {
            type: 'value',
            xAxisIndex: 0,
            yAxisIndex: 0,
            scale: true,
            nameTextStyle: { color: '#c4c4c4' },
            name: '人次',
            min: 0,
            boundaryGap: [0.2, 0.2],
            axisLine: { show: true },
            axisLabel: { textStyle: { color: '#333' } }
          }
        ],
        series: [
          {
            name: '金额(万元)',
            type: 'bar',
            data: [],
            barWidth: '50%',
            barCategoryGap: '50%'
          },
          {
            name: '人次',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      dialogTitle: '',
      dialogVisible: false,
      currentRow: {},
      deptTopNum: 10,
      drgsTopNum: 10
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

.exportTitle {
  display: inline-block;
  margin-right: 8px;
}

.exportSpan {
  display: inline-block;
  margin-right: 8px;
}
</style>



