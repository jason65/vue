<template>
  <div>
    <slot name="more"></slot>

    <kindo-card title="">
      <el-row :gutter="10" >
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <kindo-patientInfo-item title="医疗机构">{{ detailData.username?detailData.username:'' }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <kindo-patientInfo-item title="组织机构代码">{{ detailData.hosId?detailData.hosId:'' }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <kindo-patientInfo-item title="医疗付费方式">{{ kindo.dictionary.getLabel(source.ylfkfs,detailData.ylfkfs) }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <kindo-patientInfo-item title="病案号">{{ detailData.bah }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <kindo-patientInfo-item title="入院次数">{{ detailData.rycs }}</kindo-patientInfo-item>
        </el-col>
      </el-row>
      <!-- 入组病案 -->
      <el-row :gutter="10" v-if="detailData.bastate==='1'">
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <kindo-patientInfo-item title="DRG组编码">{{ detailData.drgCode }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
          <kindo-patientInfo-item title="DRG组名称">{{ detailData.drgName }}</kindo-patientInfo-item>
        </el-col>
      </el-row>
      <!-- 问题病案 -->
      <el-row :gutter="10" v-else-if="detailData.bastate==='9'">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <kindo-patientInfo-item title="错误描述">
            <ul class="errsUl">
              <li v-for="err in detailData.errs" :key="err">{{err}}</li>
            </ul>
          </kindo-patientInfo-item>
        </el-col>
      </el-row>
    </kindo-card>

    <!-- 患者基础信息 -->
    <kindo-card title="患者基础信息" collapse>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="姓名">{{ detailData.xm }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="性别">{{ kindo.dictionary.getLabel(source.xb,detailData.xb) }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="出生日期">{{ detailData.csrq !== undefined && detailData.csrq !== null ? detailData.csrq.formatDate():'-' }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="年龄">{{ detailData.nl }}</kindo-patientInfo-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="（年龄不足一周岁）年龄" v-if="detailData.bzyzsnl===undefined || detailData.bzyzsnl===null"></kindo-patientInfo-item>
          <kindo-patientInfo-item title="（年龄不足一周岁）年龄" v-else>{{ detailData.bzyzsnl }}月</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="新生儿出生体重" v-if="detailData.xsecstz===undefined || detailData.xsecstz===null"></kindo-patientInfo-item>
          <kindo-patientInfo-item title="新生儿出生体重" v-else>{{ detailData.xsecstz }}g</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="新生儿入院体重" v-if="detailData.xserytz===undefined || detailData.xserytz===null"></kindo-patientInfo-item>
          <kindo-patientInfo-item title="新生儿入院体重" v-else>{{ detailData.xserytz }}g</kindo-patientInfo-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="出生地">{{ detailData.csd }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="籍贯">{{ detailData.jg }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="民族">{{ kindo.dictionary.getLabel(source.mz,detailData.mz) }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="国籍">{{ kindo.dictionary.getLabel(source.gj,detailData.gj) }}</kindo-patientInfo-item>
        </el-col>
      </el-row>
    </kindo-card>

    <!-- 患者诊断详情 -->
    <kindo-card title="患者诊断/治疗信息" collapse>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-table :data="zdxqArr" ref="diagnoseTable" height="220px">
            <el-table-column label="诊   断" header-align="center" align="center">
              <el-table-column label="诊断类型" prop="zdlx" header-align="center" align="center" width="120px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="临床诊断术语编码" prop="jbbm" header-align="center" width="120px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="临床诊断术语名称" prop="zdmc" header-align="center" min-width="160px" :show-overflow-tooltip="true"></el-table-column>            
              <el-table-column label="ICD10编码" prop="icd10bm" header-align="center" width="120px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="ICD10名称" prop="icd10mc" header-align="center" min-width="160px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="入院病情" prop="rybq" header-align="center" width="120px" :show-overflow-tooltip="true" :formatter="(r,c,v)=>{return v!==null?kindo.dictionary.getLabel(source.rybq,v):'-'}"></el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <br>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-table :data="operationArr" ref="operationTable" height="220px">
            <el-table-column label="操   作" header-align="center" align="center">
              <el-table-column label="操作类型" prop="zdlx" header-align="center" align="center" width="120px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="CCHI编码" prop="cchibm" header-align="center" width="120px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="CCHI名称" prop="cchimc" header-align="center" min-width="160px" :show-overflow-tooltip="true"></el-table-column>          
              <el-table-column label="ICD9编码" prop="icd9bm" header-align="center" align="center" width="120px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="ICD9名称" prop="icd9mc" header-align="center" min-width="160px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="手术级别" prop="ssjb" header-align="center" align="center" min-width="100px" :show-overflow-tooltip="true" :formatter="(r,c,v)=>{return v!==null?kindo.dictionary.getLabel(source.ssjb,v):'-'}"></el-table-column>
              <el-table-column label="手术及操作日期" prop="ssrq" header-align="center" align="center" min-width="100px" :show-overflow-tooltip="true" :formatter="(r,c,v)=>{return v!==null?v.formatDate():'-'}"></el-table-column>              
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <br>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="入院途径">{{ kindo.dictionary.getLabel(source.rytj,detailData.rytj) }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="入院时间">{{ detailData.rysj !== undefined && detailData.rysj !== null ? detailData.rysj.formatDate():'-' }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="入院科别">{{ detailData.rykb }}</kindo-patientInfo-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="门/急诊诊断">{{ detailData.mjzsymc }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="疾病编码">{{ detailData.mjzsybm }}</kindo-patientInfo-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="入院后确诊日期">{{ detailData.ryqzrq !== undefined && detailData.ryqzrq !== null ? detailData.ryqzrq.formatDate():'-' }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="入院诊断编码">{{ detailData.ryzdbm }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="入院诊断名称">{{ detailData.ryzdmc }}</kindo-patientInfo-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="转科科别">{{ detailData.zkkb }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="转科时间">{{ detailData.zksj1 }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="出院科别">{{ detailData.cykb }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="出院时间">{{ detailData.cysj !== undefined && detailData.cysj !== null ? detailData.cysj.formatDate():'-' }}</kindo-patientInfo-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="实际住院(天)">{{ detailData.sjzyts }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="抢救次数">{{ detailData.qjcs }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="成功次数">{{ detailData.qjcgcs }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="呼吸机使用时间">{{ detailData.hxjsysjf }}</kindo-patientInfo-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <kindo-patientInfo-item title="离院方式">{{ kindo.dictionary.getLabel(source.lyfs,detailData.lyfs) }}</kindo-patientInfo-item>
        </el-col>
      </el-row>
    </kindo-card>

    <!-- 费用信息 -->
    <kindo-card title="费用信息" collapse>
      <table id="costTable" style="width:100%">
        <tbody>
          <tr>
            <th>住院费用（元）</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="总费用" class="spanMoney">
                    {{ detailData.zfy !== undefined && detailData.zfy !== null ? detailData.zfy.formatNum() : '-' }}
                  </kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="（自付金额" class="spanMoney">
                    {{ detailData.zfje !== undefined && detailData.zfje !== null ? detailData.zfje.formatNum() : '-' }}）
                  </kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <th>综合医疗服务类</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="一般医疗服务费" class="spanMoney">{{ detailData.ylfuf !== undefined && detailData.ylfuf !== null ? detailData.ylfuf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="一般治疗操作费" class="spanMoney">{{ detailData.zlczf !== undefined && detailData.zlczf !== null ? detailData.zlczf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="护理费" class="spanMoney">{{ detailData.hlf !== undefined && detailData.hlf !== null ? detailData.hlf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="其他费用" class="spanMoney">{{ detailData.qtfy !== undefined && detailData.qtfy !== null ? detailData.qtfy.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <th>诊断类</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="病理诊断费" class="spanMoney">{{ detailData.blzdf !== undefined && detailData.blzdf !== null ? detailData.blzdf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="实验室诊断费" class="spanMoney">{{ detailData.syszdf !== undefined && detailData.syszdf !== null ? detailData.syszdf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="影像学诊断费" class="spanMoney">{{ detailData.yxxzdf !== undefined && detailData.yxxzdf !== null ? detailData.yxxzdf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="临床诊断项目费" class="spanMoney">{{ detailData.lczdxmf !== undefined && detailData.lczdxmf !== null ? detailData.lczdxmf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <th>治疗类</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="非手术治疗项目" class="spanMoney">{{ detailData.fsszlxmf !== undefined && detailData.fsszlxmf !== null ? detailData.fsszlxmf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="（临床物理治疗费" titleClass="greyClass" class="spanMoney">
                    <span class="greyClass">{{ detailData.wlzlf !== undefined && detailData.wlzlf !== null ? detailData.wlzlf.formatNum() : '-' }}）</span>
                  </kindo-patientInfo-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="手术治疗费" class="spanMoney">{{ detailData.sszlf !== undefined && detailData.sszlf !== null ? detailData.sszlf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="（麻醉费" titleClass="greyClass" class="spanMoney">
                    <span class="greyClass">{{ detailData.mzf !== undefined && detailData.mzf !== null ? detailData.mzf.formatNum() : '-' }}</span>
                  </kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="手术费" titleClass="greyClass" class="spanMoney">
                    <span class="greyClass">{{ detailData.ssf !== undefined && detailData.ssf !== null ? detailData.ssf.formatNum() : '-' }}）</span>
                  </kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>

          <tr>
            <th>康复类</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="康复费" class="spanMoney">{{ detailData.kff !== undefined && detailData.kff !== null ? detailData.kff.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <th>中医类</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="中医治疗费" class="spanMoney">{{ detailData.zyzlf !== undefined && detailData.zyzlf !== null ? detailData.zyzlf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <th>西药类</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="西药费" class="spanMoney">{{ detailData.xyf !== undefined && detailData.xyf !== null ? detailData.xyf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="（抗菌药物费用" titleClass="greyClass" class="spanMoney">
                    <span class="greyClass">{{ detailData.kjywf !== undefined && detailData.kjywf !== null ? detailData.kjywf.formatNum() : '-' }}）</span>
                  </kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <th>中药类</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="中成药费" class="spanMoney">{{ detailData.zcyf !== undefined && detailData.zcyf !== null ? detailData.zcyf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="中草药费" class="spanMoney">{{ detailData.zcyf1 !== undefined && detailData.zcyf1 !== null ? detailData.zcyf1.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>

          <tr>
            <th>血液及血液制品类</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="血费" class="spanMoney">{{ detailData.xf !== undefined && detailData.xf !== null ? detailData.xf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="白蛋白类制品费" class="spanMoney">{{ detailData.bdblzpf !== undefined && detailData.bdblzpf !== null ? detailData.bdblzpf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="球蛋白类制品费" class="spanMoney">{{ detailData.qdblzpf !== undefined && detailData.qdblzpf !== null ? detailData.qdblzpf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="凝血因子类制品费" class="spanMoney">{{ detailData.nxyzlzpf !== undefined && detailData.nxyzlzpf !== null ? detailData.nxyzlzpf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="细胞因子类制品费" class="spanMoney">{{ detailData.xbyzlzpf !== undefined && detailData.xbyzlzpf !== null ? detailData.xbyzlzpf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <th class="thClass">耗材类</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="检查用一次性医用材料费" class="spanMoney">{{ detailData.hcyyclf !== undefined && detailData.hcyyclf !== null ? detailData.hcyyclf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="治疗用一次性医用材料费" class="spanMoney">{{ detailData.yyclf !== undefined && detailData.yyclf !== null ? detailData.yyclf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="手术用一次性医用材料费" class="spanMoney">{{ detailData.ycxyyclf !== undefined && detailData.ycxyyclf !== null ? detailData.ycxyyclf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <th class="thClass">其他类</th>
            <td>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                  <kindo-patientInfo-item title="其他费" class="spanMoney">{{ detailData.qtf !== undefined && detailData.qtf !== null ? detailData.qtf.formatNum() : '-' }}</kindo-patientInfo-item>
                </el-col>
              </el-row>
            </td>
          </tr>
        </tbody>
      </table>
    </kindo-card>
    <slot></slot>
  </div>
</template>

<script>
import KindoPatientInfoItem from '../../kindo-patientInfo-item/src/KindoPatientInfoItem'
export default {
  name: 'kindo-patientInfo',
  components: {
    'kindo-patientInfo-item': KindoPatientInfoItem
  },
  data() {
    return {
      detailData: this.data,
      tt: '',
      source: {
        ylfkfs: [], // 医疗付费方式
        xb: [], // 性别
        mz: [], // 民族
        gj: [], // 国籍
        rytj: [], // 入院途径
        lyfs: [], // 离院方式
        ssjb:[], // 手术级别
        rybq:[] // 入院病情
      },
      cyzdNum: 15,
      ssczNum: 8,
      zdxqArr: [], // 诊断详情
      diagnoseTableHeight: 0,
      operationArr: [], // 操作
      operationTableHeight: 0
    }
  },
  created() {
    // 医疗付费方式
    kindo.dictionary.getDictionary('OT_01').then(res => {
      this.source.ylfkfs = res || []
    })
    // 性别
    kindo.dictionary.getDictionary('GB_T2261_1').then(res => {
      this.source.xb = res || []
    })
    // 民族
    kindo.dictionary.getDictionary('GB_T3304').then(res => {
      this.source.mz = res || []
    })
    // 国籍
    kindo.dictionary.getDictionary('GB_T2659').then(res => {
      this.source.gj = res || []
    })
    // 入院途径
    kindo.dictionary.getDictionary('CC06_00_237_00').then(res => {
      this.source.rytj = res || []
    })
    // 离院方式
    kindo.dictionary.getDictionary('CC06_00_223_00').then(res => {
      this.source.lyfs = res || []
    })
    // 手术级别
    kindo.dictionary.getDictionary('CC06_00_255_00').then(res => {
      this.source.ssjb = res || []
    })
    // 入院病情
    kindo.dictionary.getDictionary('CC09_00_104_00').then(res => {
      this.source.rybq = res || []
    })    
  },
  mounted() {
    this.$nextTick(() => {
      let trHeight = this.$refs.diagnoseTable.$el.querySelector('.el-table__header-wrapper tr').offsetHeight
      this.diagnoseTableHeight = (this.zdxqArr.length + 1) * trHeight + trHeight + 2
      this.$refs.diagnoseTable.doLayout()

      trHeight = this.$refs.operationTable.$el.querySelector('.el-table__header-wrapper tr').offsetHeight
      this.operationTableHeight = (this.operationArr.length + 1) * trHeight + trHeight + 2
      this.$refs.operationTable.doLayout()

      this.getData()
    })
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    url: {
      type: String,
      default: () => {
        return ''
      }
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    async getData() {
      if (this.url !== '') {
        let data = await this.$http.get(this.url, { params: this.params })
        if (data.data !== null) {
          this.detailData = data.data
        }
      }
    },
    emitTableData() {
      this.zdxqArr.splice(0, this.zdxqArr.length)
      this.operationArr.splice(0, this.operationArr.length)

      // 诊断详情
      if (!kindo.valid.isEmpty(this.detailData['symc']) || !kindo.valid.isEmpty(this.detailData['sybm']) || !kindo.valid.isEmpty(this.detailData['jbdm']) || !kindo.valid.isEmpty(this.detailData['qtzd'])) {
        this.zdxqArr.push({
          zdlx: '主要诊断',
          zdmc: this.detailData.symc,
          jbbm: this.detailData.sybm,
          icd10bm: this.detailData['jbdm'],
          icd10mc: this.detailData['qtzd'],
          rybq: this.detailData['rybq']
        })
      }

      for (let i = 1; i <= 15; i++) {
        if (!kindo.valid.isEmpty(this.detailData['symc' + i]) || !kindo.valid.isEmpty(this.detailData['sybm' + i]) || !kindo.valid.isEmpty(this.detailData['jbdm' + i]) || !kindo.valid.isEmpty(this.detailData['qtzd' + i])) {
          this.zdxqArr.push({
            zdlx: '其他诊断',
            zdmc: this.detailData['symc' + i],
            jbbm: this.detailData['sybm' + i],
            icd10bm: this.detailData['jbdm' + i],
            icd10mc: this.detailData['qtzd' + i],
            rybq: this.detailData['rybq' + i]
          })
        }
      }

      let trHeight = this.$refs.diagnoseTable.$el.querySelector('.el-table__header-wrapper tr').offsetHeight
      this.diagnoseTableHeight = this.zdxqArr.length * trHeight
      this.$refs.diagnoseTable.doLayout()

      // 操作
      if (!kindo.valid.isEmpty(this.detailData['cchibm1']) || !kindo.valid.isEmpty(this.detailData['cchimc1']) || !kindo.valid.isEmpty(this.detailData['ssjczbm1']) || !kindo.valid.isEmpty(this.detailData['ssjczmc1'])) {
        this.operationArr.push({
          zdlx: '主要操作',
          cchibm: this.detailData.cchibm1,
          cchimc: this.detailData.cchimc1,
          icd9bm: this.detailData['ssjczbm1'],
          icd9mc: this.detailData['ssjczmc1'],
          ssjb: this.detailData['ssjb1'],
          ssrq: this.detailData['ssjczrq1']
        })
      }

      for (let i = 2; i < 8; i++) {
        if (!kindo.valid.isEmpty(this.detailData['cchibm' + i]) || !kindo.valid.isEmpty(this.detailData['cchimc' + i]) || !kindo.valid.isEmpty(this.detailData['ssjczbm' + i]) || !kindo.valid.isEmpty(this.detailData['ssjczmc' + i])) {
          this.operationArr.push({
            zdlx: '其他操作',
            cchibm: this.detailData['cchibm' + i],
            cchimc: this.detailData['cchimc' + i],
            icd9bm: this.detailData['ssjczbm' + i],
            icd9mc: this.detailData['ssjczmc' + i],
            ssjb: this.detailData['ssjb' + i],
            ssrq: this.detailData['ssjczrq' + i]
          })
        }
      }

      trHeight = this.$refs.operationTable.$el.querySelector('.el-table__header-wrapper tr').offsetHeight
      this.operationTableHeight = this.operationArr.length * trHeight
      this.$refs.operationTable.doLayout()
    }
  },
  watch: {
    detailData: function() {
      this.emitTableData()
    },
    url: function() {
      this.getData()
      this.emitTableData()
    },
    params: function() {
      this.getData()
      this.emitTableData()
    }
  }
}
</script>
<style scoped>
.spanMoney {
  text-align: right;
}

.errsUl{
  margin:0;
  padding:0;
}

.errsUl li{
  list-style: none;
}
</style>
