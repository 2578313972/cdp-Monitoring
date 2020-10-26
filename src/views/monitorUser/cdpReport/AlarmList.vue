<template>
    <!-- 报警列表 -->
    <div class="AlarmList">
        <Row class="padding16-18" style="background:white;">
            <i-col span="24" class="flex nav">
                <div class="select">
                    <span>channel_id</span>
                    <Select style="flex:1;min-width:180px;" :value="channelIdSelect" @on-change="channelIdSelectChange" size="large" filterable multiple >
                        <Option v-for="(item,index) in channelId" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                </div>
                <div class="select second">
                    <span>startTime</span>
                    <Select style="flex:1;min-width:120px;" :value="traitStatusSelect" @on-change="traitStatusSelectChange" size="large" filterable multiple :max-tag-count="3">
                        <Option v-for="(item,index) in traitStatus" :value="item" :key="index">{{ item }}</Option>
                    </Select>
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
                { //
                    title: 'id',
                    key: 'id',
                    minWidth: '',
                    align: 'left',
                    tooltip: true
                },
                { //
                    title: 'channel_id',
                    key: 'channelId',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                { //
                    title: 'name',
                    key: 'name',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                { //
                    title: 'alarm_type',
                    key: 'alarmType',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                { //
                    title: 'Time',
                    key: 'collectorTime',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                { //
                    title: 'description',
                    key: 'description',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                { //
                    title: 'collector_time',
                    key: 'starttimeDay',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                }
            ];

            const timer = this.$config.debounce_wait;
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
            this.degetData = this.$lodash.debounce(this.getData, timer);
            this.$https.cdpReport.getAlarmCrowdAllOption().then((res) => {
                console.log(res);
                this.channelId = res[0].data.data;
                this.traitStatus = res[1].data.data;

                this.channelIdSelect = [this.channelId[0]];
                this.traitStatusSelect = [this.traitStatus[0], this.traitStatus[1]];
                // this.traitDirectorySelect = this.traitDirectory[0];
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
                this.$https.cdpReport.getAlarmCrowdMonitorData({
                    channelId: this.channelIdSelect.toString(),
                    startDay: this.traitStatusSelect.toString(),
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
                        this.traitStatusSelect = this.traitStatus[0].crowdStatus;
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
    .AlarmList{
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
