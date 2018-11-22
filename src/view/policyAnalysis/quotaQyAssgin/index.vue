<!--
 *
 *      决策分析-全院额度使用情况
 -->
<template>
  <div>
    <!--查询条件-->
    <kindo-card-search>
      <el-form :inline="true" :model="search" label-position="right" class="demo-form-inline">
        <el-form-item label="年度">
          <el-date-picker class="half" v-model="search.year" :editable="false" :clearable="false" type="year" placeholder=" "></el-date-picker>
        </el-form-item>
        <el-form-item label="参保类型" prop="cblx">
          <el-select v-model="search.cblx" style="width:160px">
            <el-option v-for="item in sourceHtdm" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getcurrntYear">查询</el-button>

          <el-popover placement="bottom" width="600" trigger="click">
            <el-form :inline="true" :model="yb" label-position="right" class="demo-form-inline">
              <el-form-item label="金额">
                <el-input-number size="mini" style="width:220px;" :min="0" :controls="false" v-model="yearlyEdNum" :precision="2" :step="1" ref="totalMoney" :disabled="operatable"></el-input-number>
              </el-form-item>
              <el-form-item label="单位">
                <el-select v-model="yb.unit" style="width:100px">
                  <el-option v-for="item in Moneyunit" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" icon="el-icon-check" @click="setYb">确定</el-button>
              </el-form-item>
            </el-form>
            <el-button type="primary" slot="reference" icon="el-icon-setting" :disabled="operatable" style="margin-left:8px;">设定本年度医保额度</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="本年度医保额度">
          <p style="font-size:16px; font-weight:bolder;margin:0;">
            <span v-show="operatable">{{kindo.util.formatNum(yearlyEdNum)}}元</span>
            <span v-show="!operatable">-元</span>
          </p>
        </el-form-item>
      </el-form>
    </kindo-card-search>

    <kindo-card title="医保费用使用情况" collapse>
      <template slot="control">
        <!-- <el-button icon="el-icon-download" @click="exportTable">导出</el-button> -->
      </template>
      <el-tag type="danger" style="margin-bottom:8px;">提示：你只能设定当前月的下一个月的医保费用数据，或者下一年的数据</el-tag>
      <kindo-table ref="table" :url="config.api.queryTable" :queryParam="search" id="doubleHeight" :loaded="loadedData" :summary-method="getSummaries" :show-summary="true" :pagination="false">
        <!-- <kindo-table ref="table" :data="tableData" id="doubleHeight" :pagination="false"> -->
        <el-table-column min-width="130" :sortable="true" fixed="left" label="科室名称" prop="deptName" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column width="130" fixed="left" label="上年度实际医保费用" prop="previousQuota" :formatter="kindo.util.formatNum" align="right"></el-table-column>
        <el-table-column width="130" fixed="left" label="本年度分配额度" prop="deptQuota" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.deptQuota)}}</span>
            <span class="yearly" v-show="editRow.id===scope.row.id">
              <el-input-number :controls="false" :min="0" size="mini" v-model="scope.row.deptQuota" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" fixed="left" label="剩余额度" prop="balance" :formatter="kindo.util.formatNum" align="right"> </el-table-column>
        <el-table-column width="98" fixed="left" label="分配额度占比" prop="deptRate" align="right">
          <template slot-scope="scope">
            <span>{{kindo.util.formatNum(scope.row.deptRate)}}%</span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="1月" prop="m1" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m1)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-01-01 00:00:00')">{{kindo.util.formatNum(scope.row.m1)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-01-01 00:00:00')" size="mini" v-model="scope.row.m1" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="2月" prop="m2" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m2)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-02-01 00:00:00')">{{kindo.util.formatNum(scope.row.m2)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-02-01 00:00:00')" size="mini" v-model="scope.row.m2" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="3月" prop="m3" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m3)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-03-01 00:00:00')">{{kindo.util.formatNum(scope.row.m3)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-03-01 00:00:00')" size="mini" v-model="scope.row.m3" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="4月" prop="m4" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m4)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-04-01 00:00:00')">{{kindo.util.formatNum(scope.row.m4)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-04-01 00:00:00')" size="mini" v-model="scope.row.m4" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="5月" prop="m5" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m5)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-05-01 00:00:00')">{{kindo.util.formatNum(scope.row.m5)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-05-01 00:00:00')" size="mini" v-model="scope.row.m5" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="6月" prop="m6" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m6)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-06-01 00:00:00')">{{kindo.util.formatNum(scope.row.m6)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-06-01 00:00:00')" size="mini" v-model="scope.row.m6" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="7月" prop="m7" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m7)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-07-01 00:00:00')">{{kindo.util.formatNum(scope.row.m7)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-07-01 00:00:00')" size="mini" v-model="scope.row.m7" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="8月" prop="m8" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m8)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-08-01 00:00:00')">{{kindo.util.formatNum(scope.row.m8)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-08-01 00:00:00')" size="mini" v-model="scope.row.m8" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="9月" prop="m9" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m9)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-09-01 00:00:00')">{{kindo.util.formatNum(scope.row.m9)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-09-01 00:00:00')" size="mini" v-model="scope.row.m9" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="10月" prop="m10" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m10)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-10-01 00:00:00')">{{kindo.util.formatNum(scope.row.m10)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-10-01 00:00:00')" size="mini" v-model="scope.row.m10" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="11月" prop="m11" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m11)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-11-01 00:00:00')">{{kindo.util.formatNum(scope.row.m11)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-11-01 00:00:00')" size="mini" v-model="scope.row.m11" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="12月" prop="m12" align="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id">{{kindo.util.formatNum(scope.row.m12)}}</span>
            <span v-show="editRow.id===scope.row.id&&editRow.serverTime>=Date.parse(search.year+'-12-01 00:00:00')">{{kindo.util.formatNum(scope.row.m12)}}</span>
            <span class="month">
              <el-input-number :controls="false" :min="0" v-show="editRow.id===scope.row.id&&editRow.serverTime<Date.parse(search.year+'-12-01 00:00:00')" size="mini" v-model="scope.row.m12" :step="1" class="innerInput"></el-input-number>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="60" label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <span v-show="editRow.id!==scope.row.id" class="el-icon-setting" @click="startSetting(scope.row,scope.$index)" style="margin-left:6px; cursor:pointer;"></span>
            <span v-show="editRow.id===scope.row.id" class="el-icon-check" @click="endSetting(scope.row,scope.$index)" style="margin-left:6px; cursor:pointer;"></span>
          </template>
        </el-table-column>
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
    return {
      config,
      yearlyEdNum: undefined,
      /* 公共部分 */
      search: {
        year: new Date().getFullYear().toString(),
        cblx: ''
      },
      yb: {
        unit: '1'
      },
      Moneyunit: [{ label: '元', value: '0' }, { label: '万元', value: '1' }],
      // 本年度的医保额度是否可以设定，false：代表不可以设定，
      operatable: true,
      sourceHtdm: [],
      footerData: [],
      editRow: {
        index: 1,
        id: '',
        deptName: '',
        serverTime: new Date().getTime()
      },
      tableAllData: [],
      tableData: [
        { id: '0', deptName: '全院', previousQuota: '123346660', deptQuota: '123346660', balance: '123346660', deptRate: '90%', m1: '123346660', m2: '0', m3: '0', m4: '0', m5: '0', m6: '0', m7: '0', m8: '0', m9: '0', m10: '0', m11: '0', m12: '0' },
        { id: '1', deptName: '儿科', previousQuota: '3', deptQuota: '0', balance: '0', deptRate: '0%', m1: '123346660', m2: '0', m3: '0', m4: '0', m5: '0', m6: '0', m7: '0', m8: '0', m9: '0', m10: '0', m11: '0', m12: '0' },
        { id: '2', deptName: '妇产', previousQuota: '3', deptQuota: '0', balance: '0', deptRate: '0%', m1: '123346660', m2: '0', m3: '0', m4: '0', m5: '0', m6: '0', m7: '0', m8: '0', m9: '0', m10: '0', m11: '0', m12: '0' }
      ]
    }
  },
  async created() {},

  mounted() {
    kindo.dictionary.get('CBLX_CODE').then(res => {
      this.sourceHtdm = res
      this.search.cblx = res[0].value
      this.getcurrntYear()
    })
    this.$nextTick(() => {
      let dom1 = document.getElementById('doubleHeight')
      // 50是调节高度，避免出现垂直滚动条
      let tableHeight = document.body.clientHeight - dom1.offsetTop - dom1.offsetParent.offsetTop - 50
      this.$refs.table.internalHeight = tableHeight
    })
  },

  methods: {
    loadedData(res) {
      // 合计的返回数据
      let f = res.data.footer.hj
      let previousQuota = kindo.util.formatNum(f.previousQuota)
      let deptQuota = kindo.util.formatNum(f.deptQuota)
      let balance = kindo.util.formatNum(f.balance)
      let deptRate = kindo.util.formatNum(f.deptRate)
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
      this.footerData = ['', '全院', previousQuota, deptQuota, balance, deptRate, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12]
      // 将所有的数值进行记录，只是id和deptQuota字段
      this.tableAllData = res.data.rows.map(item => {
        return { id: item.id, deptQuota: item.deptQuota }
      })
      this.editRow = {
        index: 1,
        id: '',
        deptName: '',
        serverTime: new Date().getTime()
      }
    },
    getSummaries() {
      return this.footerData
    },
    exportTable() {
      kindo.util.downloadFile(config.api.exportTable, this.search)
    },
    // 设置本年度医保额度
    setYb() {
      this.$confirm('确定将该年度的医保额度设置为(' + kindo.util.formatNum(this.yearlyEdNum) + ')' + kindo.dictionary.getLabel(this.Moneyunit, this.yb.unit) + '吗?设置以后不能想再次修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let yearlyEdNum = 0
          if (this.yb.unit === '1') {
            yearlyEdNum = this.yearlyEdNum * 10000
          } else {
            yearlyEdNum = this.yearlyEdNum
          }
          let params = Object.assign({}, this.search, { qyed: yearlyEdNum })
          this.$http.get(config.api.setQuota, { params: params }).then(res => {
            if (res.data.toString() === '1') {
              kindo.util.alert('设置成功', '提示', 'success')
              this.getcurrntYear()
            } else {
              kindo.util.alert('当前年度的医保额度已被设定', '提示', 'warning')
            }
          })
        })
        .catch(() => {})
    },
    // 获取当前年年度、当前参保类型下是否设置了医保额度和当前服务器的时间
    getcurrntYear() {
      // 获取当前的时间
      let self = this
      self.yearlyEdNum = undefined
      let params = { year: this.search.year, cblx: this.search.cblx }
      this.$http.get(config.api.queryInfo, { params: params }).then(res => {
        self.editRow.serverTime = new Date(res.data.time).getTime()
        self.operatable = res.data.flag.toString() === '1'
        if (self.operatable) {
          self.yearlyEdNum = res.data.qyed
          this.$refs.table.loadData()
          // self.getData()
        } else {
          this.$refs.table.clearTable()
        }
      })
    },
    // 开始配置
    startSetting(row, index) {
      if (this.editRow.serverTime > new Date(this.search.year + '-12-01 00:00:00').getTime()) {
        kindo.util.alert('您只能调整下一年的医保金额！', '提示', 'warning')
      } else {
        let self = this
        if (this.editRow.id === '') {
          this.editRow.id = row.id
          this.editRow.index = index
          this.editRow.deptName = row.deptName
        } else {
          self
            .$confirm('确定放弃(' + this.editRow.deptName + ')设置的金额?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              this.editRow.id = row.id
              this.editRow.deptName = row.deptName
              this.editRow.index = index
              this.$refs.table.loadData()
              // self.getData()
            })
            .catch(() => {})
        }
      }
    },
    endSetting(row) {
      // 发起请求
      let self = this
      self
        .$confirm('确定保存(' + this.editRow.deptName + ')设置的金额?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          // 校验输入的金额是否合理
          let deptQuota = parseFloat(row.deptQuota)
          let sum =
            parseFloat(row.m1) +
            parseFloat(row.m2) +
            parseFloat(row.m3) +
            parseFloat(row.m4) +
            parseFloat(row.m5) +
            parseFloat(row.m6) +
            parseFloat(row.m7) +
            parseFloat(row.m8) +
            parseFloat(row.m9) +
            parseFloat(row.m10) +
            parseFloat(row.m11) +
            parseFloat(row.m12)
          let othersQuota = 0
          this.tableAllData.map(item => {
            if (row.id !== item.id) {
              othersQuota += item.deptQuota
            }
          })
          let deptQuotaisOk = othersQuota + row.deptQuota <= this.yearlyEdNum
          if (sum <= deptQuota && deptQuotaisOk) {
            this.editRow.id = ''
            this.editRow.index = 0
            this.editRow.deptName = row.deptName
            let params = Object.assign({}, row, this.search)
            this.$http.post(config.api.update, params).then(res => {
              if (res.code === '200') {
                kindo.util.alert('设置成功', '提示', 'success')
                this.$refs.table.loadData()
                // self.getData()
              } else {
                kindo.util.alert('设置失败', '提示', 'warning')
              }
            })
          } else if (sum > deptQuota) {
            kindo.util.alert('您输入的各月的医保金额的合计大于该科室分配的医保金额，请重新调整！', '提示', 'warning')
          } else {
            kindo.util.alert('您输入的当前科室的医保金额的合计大于该年度分配的医保金额，请重新调整！', '提示', 'warning')
          }
        })
        .catch(() => {
          this.$refs.table.loadData()
          // self.getData()
        })
    }
  },
  watch: {
    'search.year': function(val) {
      if (typeof val !== 'string') {
        this.search.year = new Date(val).getFullYear().toString()
        // this.getcurrntYear()
      }
    }
    // 'search.cblx': function(val, oldVal) {
    //   if (oldVal !== '') {
    //     this.getcurrntYear()
    //   }
    // }
  }
}
</script>
<style scoped>
#doubleHeight .yearly .el-input-number {
  width: 130px;
}
#doubleHeight .month .el-input-number {
  width: 110px;
}
#doubleHeight .yearly .innerInput {
  margin-left: -10px;
}
#doubleHeight .month .innerInput {
  margin-left: -10px;
}
</style>
<style>
#doubleHeight .innerInput div input {
  padding-left: 2px !important;
  padding-right: 2px !important;
}
</style>


