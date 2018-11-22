export default {
  api: {
    getData: kindo.config.api.jcfx + "api/workIndex/getGksPjZyrData",
    getCards: kindo.config.api.jcfx + 'api/workIndex/get',
    getProportionChart: kindo.config.api.jcfx + 'api/workIndex/getTopTrend1',
    getALOSChart: kindo.config.api.jcfx + 'api/workIndex/getGksPjZyrData',
    getMedicalCostsChart: kindo.config.api.jcfx + 'api/workIndex/getGksFygcData',
    getPieChart: kindo.config.api.jcfx + 'api/workIndex/getFylXData',
    getHospitalizedCostsChart: kindo.config.api.jcfx + 'api/workIndex/getGksZyCjData',
    exportTable1: kindo.config.api.jcfx + 'api/workIndex/exportGksPjZyrData',
    exportTable2: kindo.config.api.jcfx + 'api/workIndex/exportGksFygcData',
    exportTable3: kindo.config.api.jcfx + 'api/workIndex/exportGksZyCjData',
    getDeptList: kindo.config.api.upms + "system/dict/queryDynDetails?catalog=DICT_DYN_STAND_DEPARTMENT"
  }
}