export default {
  api: {
    queryPriceLimitDetail: kindo.config.api.jcfx + 'api/deptPriceLimit/queryPriceLimitDetail', //查询临床科室单病种限价标准详情
    addPriceLimit: kindo.config.api.jcfx + 'api/deptPriceLimit/addPriceLimit', //新增临床科室单病种限价标准
    editPriceLimit: kindo.config.api.jcfx + 'api/deptPriceLimit/editPriceLimit', //修改临床科室单病种限价标准
    queryPriceLimitList: kindo.config.api.jcfx + 'api/deptPriceLimit/queryPriceLimitList', //查询临床科室单病种限价标准列表
    exportPriceLimitList: kindo.config.api.jcfx + 'api/deptPriceLimit/exportPriceLimitList', //导出临床科室单病种限价标准列表
    deletePriceLimit: kindo.config.api.jcfx + 'api/deptPriceLimit/deletePriceLimit' //删除临床科室单病种限价标准
  }
}