export default {
    api: {
        get: kindo.config.api.quota + "api/ks/quotacontrol/query4",
        getDeptList: kindo.config.api.upms + "system/dict/queryDynDetails?catalog=DICT_DYN_STAND_DEPARTMENT",
        deptchart: kindo.config.api.quota + "api/ks/quotacontrol/quotadeptquota",
        doctorchart: kindo.config.api.quota + 'api/ks/quotacontrol/quotadoc',
        patientTable: kindo.config.api.quota + 'api/ks/quotacontrol/patient',
        exportTable: kindo.config.api.quota + 'api/ks/quotacontrol/exportpatient'
    }
}