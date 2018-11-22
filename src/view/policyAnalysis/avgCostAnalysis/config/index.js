export default {
  api: {
    getTop: kindo.config.api.jcfx + "api/avgCostAnalysis/getTop",
    getKsfyChart: kindo.config.api.jcfx + 'api/avgCostAnalysis/getKsfyChart',
    getDbzfyChart: kindo.config.api.jcfx + 'api/avgCostAnalysis/getJbfyChart',
    queryDbzList: kindo.config.api.jcfx + 'api/avgCostAnalysis/getCostAnalysisList',
    queryDbzDetail: kindo.config.api.jcfx + 'api/avgCostAnalysis/getCostAnalysisDetail',
    exportDbzDetail: kindo.config.api.jcfx + 'api/avgCostAnalysis/exportCostAnalysisDetail',
    getDeptList: kindo.config.api.upms + "system/dict/queryDynDetails?catalog=DICT_DYN_STAND_DEPARTMENT"
  }
}