<!--
 *
 *      决策分析-病组管理-门慢病分析
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

    <kindo-card>
      <el-row>
        <el-col :span="6" v-for="item in source.zbList" :key="item.title">
          <kindo-colorbox theme="white">
            <div class="tips-container bgblue cost1">
              <div class="title">{{ item.title }}</div>
              <div class="content">{{ item.content}}</div>
            </div>
          </kindo-colorbox>
        </el-col>
      </el-row>
    </kindo-card>
    <el-row style="background-color:#fff;margin-bottom:8px;">
      <el-col :span="12">
        <div style="text-align: center;margin-top:8px;">
          <span class="exportTitle">慢性病违规类型分布</span>
          <span class="exportSpan" @click="uploadDistribution"><i class="el-icon-download"></i><span>导出</span></span>
        </div>
        <kindo-chart :options="distributionOptions" ref="linebar"></kindo-chart>
      </el-col>
      <el-col :span="12" style="text-align: center">
        <div style="text-align: center;margin-top:8px;">
          <span class="exportTitle">慢性病违规科室排名</span>
          <span class="exportSpan" @click="uploadRank"><i class="el-icon-download"></i><span>导出</span></span>
        </div>
        <kindo-chart :options="rankOptions" ref="linebar"></kindo-chart>
      </el-col>
    </el-row>
    <kindo-card title="门诊慢性病违规数据汇总" collapse>
      <!-- <template slot="control">
        <el-button icon="el-icon-download" @click="download">导出</el-button>
      </template> -->
      <kindo-table ref="table" :url="config.api.get" :queryParam="search">
        <el-table-column min-width="140" label="慢性病疾病名称" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="90" label="就诊人次" prop="RYSJ" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="90" label="就诊人数" prop="CYSJ" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" label="医保违规总金额(万元)" prop="CYKB" align="right" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="60" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看明细</el-button>
          </template>
        </el-table-column>
      </kindo-table>
    </kindo-card>
    <!-- dialogTitle是慢性病的名称 -->
    <el-dialog v-drag :visible.sync="dialogVisible" :title="dialogTitle" width="80%">
      <kindo-card-search>
        <el-form :inline="true" :model="diaSearch" label-width="140px" label-position="right" class="demo-form-inline">
          <el-form-item label="患者姓名/就诊卡号" prop="patient">
            <el-input v-model="diaSearch.patient"></el-input>
          </el-form-item>
          <el-form-item label="开立医生工号/姓名" prop="doc" label-width="140px">
            <el-input v-model="diaSearch.doc" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="diaGet">查询</el-button>
            <el-button icon="el-icon-download" @click="diaExport">导出</el-button>
          </el-form-item>
        </el-form>
      </kindo-card-search>
      <kindo-card title="门诊慢性病违规明细数据" collapse>
        <!-- <template slot="control">
        <el-button icon="el-icon-download" @click="download">导出</el-button>
      </template> -->
        <kindo-table ref="diaTable" :url="config.api.get" :queryParam="diaSearch">
          <el-table-column width="120" label="就诊流水号" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" label="就诊卡号" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="患者姓名" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="140" label="身份证" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" label="参保类型" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip :formatter="(row,column)=>{return kindo.dictionary.getLabel(sourceHtdm,row.CBLX_CODE)}"></el-table-column>
          <el-table-column width="60" label="性别" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip :formatter="(row,column)=>{return kindo.dictionary.getLabel(source.XB,row.CBLX_CODE)}"></el-table-column>
          <el-table-column min-width="140" label="违规药品名称" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="开立数量" prop="CYKB" align="right" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="80" label="单价" prop="CYKB" align="right" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="100" label="总金额" prop="CYKB" align="right" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="90" label="开立医生" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" label="医生工号" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="100" label="开立科室" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
          <el-table-column width="100" label="开立时间" prop="GENERATE_DATE" align="left" header-align="center" show-overflow-tooltip></el-table-column>
        </kindo-table>
      </kindo-card>
    </el-dialog>
  </div>
</template>

<script>
import config from "./config";
import kindoColorbox from "@/components/kindo-colorbox";
export default {
  components: {
    "kindo-colorbox": kindoColorbox
  },
  data() {
    return {
      config,
      yqList: [{ label: "二院", value: "1" }, { label: "华美", value: "2" }],
      searchYq: ["1", "2"],
      /* 公共部分 */
      search: {
        START_DATE: new Date().proDate("{%d-7}").formatDate("yyyy-MM-dd"),
        END_DATE: new Date().formatDate("yyyy-MM-dd"),
        yq: "1,2",
        htdm: "05"
      },
      sourceHtdm: [],
      /* 第一部分 */
      source: {
        zbList: [
          { title: "慢性病就诊人数", content: "-" },
          { title: "慢性病就诊人次", content: "-" },
          { title: "慢性病医保费用（万元）", content: "-" },
          { title: "慢性病违规医保费用（万元）", content: "-" }
        ],
        XB: []
      },
      distributionOptions: {
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left"
          }
        },
        legend: {
          data: ["人次", "金额"],
          bottom: 0,
          left: "center"
        },
        grid: {
          top: "40px",
          y2: "80px"
        },
        dataZoom: {
          bottom: 25
        },
        xAxis: [{ type: "category", data: ["慢性病1", "慢性病2"] }],
        yAxis: [
          { type: "value", name: "人次" },
          { type: "value", name: "金额(万元)" }
        ],
        series: [
          {
            name: "人次",
            type: "bar",
            data: [1, 2],
            barWidth: "50%",
            barCategoryGap: "50%"
          },
          { name: "金额", type: "line", yAxisIndex: 1, data: [3, 4] }
        ]
      },
      rankOptions: {
        grid: {
          top: "40px",
          y2: "80px"
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left"
          }
        },
        legend: {
          data: ["人次", "金额"],
          bottom: 0,
          left: "center"
        },
        xAxis: [{ type: "category", data: ["科室1", "科室2"] }],
        yAxis: [
          { type: "value", name: "人次" },
          { type: "value", name: "金额(万元)" }
        ],
        dataZoom: {
          bottom: 25
        },
        series: [
          {
            name: "人次",
            type: "bar",
            data: [3, 4],
            barWidth: "50%",
            barCategoryGap: "50%"
          },
          { name: "金额", type: "line", yAxisIndex: 1, data: [4, 5] }
        ]
      },
      /* 弹出部分 */
      diaSearch: {
        parient: "",
        doc: "",
        mtbzd: "" // 疾病编码
      },
      dialogVisible: false,
      dialogTitle: ""
    };
  },
  async created() {
    // 获取性别的数据字典
  },

  mounted() {},

  methods: {
    // 验证查询时间
    TimeDisabledST(v) {
      if (Date.parse(v) > Date.parse(this.search.END_DATE)) {
        return true;
      } else {
        return false;
      }
    },
    TimeDisabledEND(v) {
      if (Date.parse(v) - Date.parse(this.search.START_DATE) <= -86400000) {
        return true;
      } else {
        return false;
      }
    },
    getData() {
      let self = this;
      // 获取指标数据
      self.getSpeicalChart();

      // 获取慢性病违规类型分布
      self.getSpeicalChartByCate();

      // 获取慢性病违规科室排名
      self.getSpeicalChartByDept();

      // 获取表格数据
      self.getSpeicalGrid();
      this.dialogVisible = true;
    },
    // 获取指标数据
    getSpeicalChart() {},

    // 获取慢性病违规类型分布
    getSpeicalChartByCate() {
      // let xData = [];
      //     let sData1 = [];
      //     let sData2 = [];
      //     if (res.data && res.data.listL && res.data.listL.length > 0) {
      //       res.data.listL.forEach(item => {
      //         xData.push(item.MTBMC);
      //         sData1.push(item.RC);
      //         sData2.push(kindo.util.formatMoneyThousand(item.ZFY, 2));
      //       });
      //     }
      //     let option = self.allChart.门特病类型分布.getOption();
      //     option.dataZoom = {
      //       show: !(res.data && res.data.listL && res.data.listL.length <= 15),
      //       start: 0,
      //       end:
      //         res.data && res.data.listL && res.data.listL.length <= 15
      //           ? 100
      //           : Math.floor((15 / res.data.listL.length) * 100),
      //       bottom: 25
      //     };
    },
    uploadDistribution() {},
    getSpeicalChartByDept() {},
    uploadRank() {},

    // 获取门特病明细表格
    getSpeicalGrid() {},
    diaGet() {},
    diaExport() {}
  },
  watch: {
    searchYq: function(val) {
      this.search.yq = val.toString();
    }
  }
};
</script>
<style scoped>
.el-date-editor.el-input {
  width: 120px;
}

.tips-container {
  margin-left: 1.7%;
}

.bgblue {
  width: 95%;
  margin: 10px auto;
  border-radius: 10px;
  border: 1px solid #d4d4d4;
  background: #fff;
  text-align: center;
  padding-top: 10px;
}

.title {
  font-size: 14px;
  color: #838383;
}

.content {
  margin: 12px 0 10px 0;
  font-size: 30px;
  color: #0875c8;
}
.exportTitle {
  display: inline-block;
  margin-right: 8px;
}
.exportSpan {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #03bdd6;
  color: #fff;
  cursor: pointer;
}
</style>

