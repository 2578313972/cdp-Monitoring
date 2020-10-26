import axios from '@/utils/axios';

/** 监控视图 */
// 数据工程
const dataEngineering = {
    /** 业务异常值 */
    // 异常表名
    getBusinessOutlierTables: data => axios.post('/monitor-web/monitor/businessOutlier/getBusinessOutlierTables', data),
    // 异常表字段
    getBusinessOutlierFieldNames: data => axios.post(`/monitor-web/monitor/businessOutlier/getBusinessOutlierFieldNames?tableName=${data}`),
    // 业务异常最小值检查查询
    getBusinessOutlierMinData: data => axios.post(`/monitor-web/monitor/businessOutlier/getBusinessOutlierMinData?startDay=${data.startDay}&endDay=${data.endDay}&tableName=${data.tableName}&fieldName=${data.fieldName}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }),
    // 业务异常最大值检查查询
    getBusinessOutlierMaxData: data => axios.post(`/monitor-web/monitor/businessOutlier/getBusinessOutlierMaxData?startDay=${data.startDay}&endDay=${data.endDay}&tableName=${data.tableName}&fieldName=${data.fieldName}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }),
    // 业务异常值检查查询
    getBusinessOutlierData: data => axios.all([dataEngineering.getBusinessOutlierMinData(data), dataEngineering.getBusinessOutlierMaxData(data)]),

    /** 唯一性检查 */
    // 唯一性检查ETL层级查询接口
    getUniquenessCheckETLLevel: data => axios.post('/monitor-web/monitor/uniquenessCheck/getUniquenessCheckETLLevel', data),
    // 唯一性检查表名查询接口
    getUniquenessCheckTables: data => axios.post(`/monitor-web/monitor/uniquenessCheck/getUniquenessCheckTables?etlLevel=${data}`),
    // 唯一性检查数据接口
    getUniquenessCheckData: data => axios.post('/monitor-web/monitor/uniquenessCheck/getUniquenessCheckData', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }),

    /** 字段空值 */
    // 字段空值ETL层级查询接口
    getFieldNullRateETLLevel: data => axios.post('/monitor-web/monitor/fieldNullRate/getFieldNullRateETLLevel', data),
    // 获取字段空值表名接口
    getFieldNullRateTables: data => axios.post(`/monitor-web/monitor/fieldNullRate/getFieldNullRateTables?etlLevel=${data}`),
    // 获取字段空值表字段名称接口
    getFieldNullRateFieldNames: data => axios.post(`/monitor-web/monitor/fieldNullRate/getFieldNullRateFieldNames?tableName=${data}`),
    // 获取空值字段图表接口
    getFieldNullRateData: data => axios.post('/monitor-web/monitor/fieldNullRate/getFieldNullRateData', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }),

    /** 数据条目 */
    // 数据条目表名查询接口
    getDataEntryTables: data => axios.post(`/monitor-web/monitor/dataEntry/getDataEntryTables?etlLevel=${data}`),
    // 数据条目图表数据接口
    getDataEntryData: data => axios.post('/monitor-web/monitor/dataEntry/getDataEntryData', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
};

// cdp报表
const cdpReport = {
    /** 实时特性 */
    // 获取特性 channelId查询接口
    getChannelId: () => axios.post('/monitor-web/monitor/traitMonitor/getChannelId'),
    // 获取特性状态
    getTraitStatus: () => axios.post('/monitor-web/monitor/traitMonitor/getTraitStatus'),
    // 获取特性公私有状态
    getTraitDirectory: () => axios.post('/monitor-web/monitor/traitMonitor/getTraitDirectory'),
    // 获取特性实时监控数据接口
    getTraitMonitorData: data => axios.post('/monitor-web/monitor/traitMonitor/getTraitMonitorData', data),

    getAllOption: () => axios.all([cdpReport.getChannelId(), cdpReport.getTraitStatus(), cdpReport.getTraitDirectory()]),


    /** 实时人群 */
    // 获取特性 channelId查询接口
    getCrowdChannelIds: () => axios.post('/monitor-web/monitor/crowdMonitor/getCrowdChannelIds'),
    // 获取特性状态
    getCrowdStatus: () => axios.post('/monitor-web/monitor/crowdMonitor/getCrowdStatus'),
    // 获取特性公私有状态
    getCrowdDirectory: () => axios.post('/monitor-web/monitor/crowdMonitor/getCrowdDirectory'),
    // 获取特性实时监控数据接口
    getCrowdMonitorData: data => axios.post('/monitor-web/monitor/crowdMonitor/getCrowdMonitorData', data),

    getCrowdAllOption: () => axios.all([cdpReport.getCrowdChannelIds(), cdpReport.getCrowdStatus(), cdpReport.getCrowdDirectory()]),


    /** 报警列表 */
    // 获取特性 channelId查询接口
    getAlarmChannelId: () => axios.post('/monitor-web/monitor/alarmInformation/getChannelId'),
    // 获取特性状态
    getAlarmStartTime: () => axios.post('/monitor-web/monitor/alarmInformation/getStartTime'),
    // 获取特性实时监控数据接口
    getAlarmCrowdMonitorData: data => axios.post('/monitor-web/monitor/alarmInformation/getAlarmInformationData', data),

    getAlarmCrowdAllOption: () => axios.all([cdpReport.getAlarmChannelId(), cdpReport.getAlarmStartTime()])

};

const cdpReportConfig = {
    // 人群特性配置查询列表接口
    getListByType: data => axios.post('/monitor-web/monitor/config/getListByType', data),
    // 新增配置接口
    addConfigByType: data => axios.post('/monitor-web/monitor/config/addConfigByType', data),
    // 修改配置接口
    updataConfigByType: data => axios.post('/monitor-web/monitor/config/updataConfigByType', data),
    // 修改配置接口
    delConfig: id => axios.delete(`/monitor-web/monitor/config/delConfig/${id}`),
    // 获取特性下拉全部列表
    getTraitList: () => axios.get('/monitor-web/monitor/traitMonitor/getTraitList'),
    // 获取人群下拉全部列表
    getCrowdList: () => axios.get('/monitor-web/monitor/crowdMonitor/getCrowdList'),
    // 校验配置是否存在
    checkUniqueKey: data => axios.post('/monitor-web/monitor/config/checkUniqueKey', data)
};

export {
    dataEngineering,
    cdpReport,
    cdpReportConfig
};
