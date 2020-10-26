<template>
    <!-- 实时特性 -->
    <div class="RealTimeNature">
    <!-- <Loading v-if="loading" /> -->
        <Row class="padding16-18" style="background:white;">
            <i-col span="24" class="flex nav">
                <div class="select">
                    <span>channel_id</span>
                    <Select style="flex:1;width:180px;" :value="channelIdSelect" @on-change="channelIdSelectChange" size="large" filterable multiple :max-tag-count="1" >
                        <Option v-for="(item,index) in channelId" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                </div>
                <div class="select second">
                    <span>traitStatus</span>
                    <Select style="flex:1;width:120px;" :value="traitStatusSelect" @on-change="traitStatusSelectChange" size="large" filterable multiple :max-tag-count="0" >
                        <Option v-for="(item,index) in traitStatus" :value="item.traitStatus" :key="index">{{ item.traitStatus }}</Option>
                    </Select>
                </div>
                <div class="select second">
                    <span>traitDirectory</span>
                    <Select style="flex:1;width:120px;" :value="traitDirectorySelect" @on-change="traitDirectorySelectChange" size="large" filterable multiple :max-tag-count="0" >
                        <Option v-for="(item,index) in traitDirectory" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                </div>
                <div class="select second">
                    <span>时间</span>
                    <DatePicker
                        type="daterange"
                        size="large"
                        :value="timeHorizon"
                        :options="options"
                        :clearable=false
                        @on-change="timeChange"
                        placement="bottom-end"
                        placeholder="Select date"
                        style="width:230px"
                    ></DatePicker>
                </div>
            </i-col>
            <i-col class="containers" span="24">
                <Table stripe border :columns="columns" :data="tableData" :width="screenWidth"></Table>
            </i-col>
            <i-col span="24" style="text-align:right;">
                <Page
                :current="current"
                :page-size="pageSize"
                :total="allDataSize"
                @on-change="debouncePage"
                show-elevator
                ></Page>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                channelId: [],
                traitStatus: [],
                traitDirectory: [],

                channelIdSelect: [],
                traitStatusSelect: [],
                traitDirectorySelect: [],
                timeHorizon: [],

                columns: [],
                tableData: [],
                current: 1,
                pageSize: 10,
                allDataSize: 0,
                loading: true,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                }
            };
        },
        props: {
            screenWidth: {
                type: Number,
                require: true
            }
        },
        created() {
            this.timeHorizon = [this.$time(new Date(new Date() - 1000 * 3600 * 24 * 6)), this.$time(new Date())];


            this.columns = [
                {
                    title: '渠道',
                    key: 'channelId',
                    minWidth: '',
                    align: 'left',
                    tooltip: true
                },
                {
                    title: '特性ID',
                    key: 'traitId',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '特性名称',
                    key: 'traitName',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '特性类型',
                    key: 'traitType',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '覆盖用户数',
                    key: 'traitReachUsers',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '状态',
                    key: 'traitStatus',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '创建者',
                    key: 'traitCreator',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '所属目录',
                    key: 'traitDirectory',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '引用特性数量',
                    key: 'quotedTraitNum',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '被引用特性数量',
                    key: 'quotedTraitNum',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '被引用人群数量',
                    key: 'quotedCrowdNum',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '激活时间',
                    key: 'traitActivatTime',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '数据采集时间',
                    key: 'collectorTime',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                }
            ];

            const timer = this.$config.debounce_wait;
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
            this.degetData = this.$lodash.debounce(this.getData, timer);
            this.$https.cdpReport.getAllOption().then((res) => {
                this.channelId = res[0].data.data;
                this.traitStatus = res[1].data.data;
                this.traitDirectory = res[2].data.data;

                this.channelIdSelect = this.channelId[0];
                this.traitStatusSelect = this.traitStatus[0].traitStatus;
                this.traitDirectorySelect = this.traitDirectory[0];
            });
        },
        mounted() {
            this.resize();

            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            getData() {
                this.$https.cdpReport.getTraitMonitorData({
                    startDay: this.timeHorizon[0],
                    endDay: this.timeHorizon[1],
                    channelId: this.channelIdSelect.toString(),
                    status: this.traitStatusSelect.toString(),
                    directory: this.traitDirectorySelect.toString(),
                    page: this.current,
                    rows: this.pageSize
                }).then((res) => {
                    console.log(res);
                    this.tableData = res.data.data.data;
                    this.allDataSize = res.data.data.pageInfo.total;
                });
            },
            channelIdSelectChange(e) {
                if (!e.length) {
                    this.channelIdSelect = e;
                    setTimeout(() => {
                        this.channelIdSelect = this.channelId[0];
                        this.degetData();
                    }, 200);
                } else {
                    this.channelIdSelect = e;
                    this.degetData();
                }
            },
            traitStatusSelectChange(e) {
                if (!e.length) {
                    this.traitStatusSelect = e;
                    setTimeout(() => {
                        this.traitStatusSelect = this.traitStatus[0].traitStatus;
                        this.degetData();
                    }, 200);
                } else {
                    this.traitStatusSelect = e;
                    this.degetData();
                }
            },
            traitDirectorySelectChange(e) {
                if (!e.length) {
                    this.traitDirectorySelect = e;
                    setTimeout(() => {
                        this.traitDirectorySelect = this.traitDirectory[0];
                        this.degetData();
                    }, 200);
                } else {
                    this.traitDirectorySelect = e;
                    this.degetData();
                }
            },
            timeChange(e) {
                this.timeHorizon = e;
                this.degetData();
            },
            pageChange(ind) {
                this.current = ind;
                this.degetData();
            },
            resize() {}
        }
    };
</script>

<style lang="less" scoped>
    .RealTimeNature{
        .nav{
            box-sizing: border-box;
            padding-left:6px;
            margin-bottom: 25px;
            .select{
                // width:200px;
                display: flex;
                border-radius: 5px;
                border:1px solid #DDE4ED;
                span{
                    line-height: 38px;
                    display: inline-block;
                    background-color: #DDE4ED;
                    padding:0 10px;
                }
                ~.second{
                    margin-left:20px;
                }
            }
        }
        /deep/ .ivu-select-selection, /deep/ .ivu-select-selection-focused,/deep/ .ivu-select-selection:hover{
            border:0px;
            box-shadow: 0 0 0 0;
        }
        .containers{
            display: flex;
            flex-wrap: wrap;
            div{
                margin:0 auto;
            }
        }
        /deep/ .ivu-select-large /deep/ .ivu-select-input{
            height: 40px;
        }
    }
</style>
