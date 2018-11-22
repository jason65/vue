export default {
    api: {
        // 查询服务器的时间和
        queryInfo: kindo.config.api.quota + 'api/quota/fenpei/info',
        setQuota: kindo.config.api.quota + 'api/quota/fenpei/confirmqyed',
        queryTable: kindo.config.api.quota + 'api/quota/fenpei/query',
        exportTable: kindo.config.api.quota + 'api/quota/fenpei/exportlist',
        // 设置科室的个月的额度
        update: kindo.config.api.quota + 'api/quota/fenpei/update'
    }
}