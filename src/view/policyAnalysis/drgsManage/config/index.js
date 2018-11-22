export default {
  api: {
    getTop: kindo.config.api.jcfx + "api/singleDisease/getTop",
    getKsfyChart: kindo.config.api.jcfx + 'api/singleDisease/getKsfyChart',
    getDbzfyChart: kindo.config.api.jcfx + 'api/singleDisease/getDbzfyChart',
    queryDbzList: kindo.config.api.jcfx + 'api/singleDisease/queryDbzList',
    queryDbzDetail: kindo.config.api.jcfx + 'api/singleDisease/queryDbzDetail',
    exportDbzDetail: kindo.config.api.jcfx + 'api/singleDisease/exportDbzDetail',
    getDeptList: kindo.config.api.upms + "system/dict/queryDynDetails?catalog=DICT_DYN_STAND_DEPARTMENT"
  }
}