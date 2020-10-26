<template>
    <!-- 特性阈值配置 -->
    <div class="CharacterConfig">
        <Row class="padding16-18" style="background:white;">
            <i-col span="20" class="flex nav">
                <ul>
                    <li>特性名称： </li>
                    <li><Input v-model="typeName" /></li>
                </ul>
                <ul style="width:130px;display:flex;justify-content: space-around;">
                    <li><Button type="primary" @click="getData">搜索</Button></li>
                    <li><Button @click="typeName='',getData()">重置</Button></li>
                </ul>

            </i-col>
            <i-col span="4" style="height:60px;text-align:right;">
                    <Button type="primary" @click="creatEvent=true">+ 特性</Button>
            </i-col>

            <i-col class="containers" span="24">
                <Table stripe :columns="columns" :data="tableData" :width="screenWidth"></Table>
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

    <Drawer v-model="creatEvent" width="900" :mask-closable="false">
      <create-event
        v-if="creatEvent"
        :configType="'trait'"
        @cancelCreatEvent="cancelCreat"
        @submitCreatEvent="submitCreat"
      ></create-event>
    </Drawer>
    </div>
</template>

<script>
    import DiySwitch from '@/components/DiySwitch';
    import DiyInput from '@/components/DiyInput';
    import DiyModify from '@/views/monitorConfig/cdpReportConfig/DiyModify';

    import CreateEvent from '../CreateEventChara';

    export default {
        data() {
            return {
                columns: [],
                tableData: [],
                typeName: '',
                current: 1,
                pageSize: 10,
                allDataSize: 0,
                creatEvent: false
            };
        },
        props: {
            screenWidth: {
                type: Number,
                require: true
            }
        },
        components: { CreateEvent },
        created() {
            this.columns = [
                {
                    title: '特性名称',
                    key: 'typeName',
                    // minWidth: 100,
                    align: 'left',
                    tooltip: true
                },
                {
                    title: '特性ID',
                    key: 'typeId',
                    // minWidth: 100,
                    align: 'left',
                    tooltip: true
                },
                {
                    title: '监控状态',
                    key: 'configStatus',
                    // minWidth: 100,
                    align: 'center',
                    render: (h, params) => h(DiySwitch, {
                        props: {
                            obj: params

                        },
                        on: {
                            swtichChange: this.swtichChange
                        }
                    })
                },
                {
                    title: '阈值设置',
                    key: 'configValue',
                    // minWidth: 100,
                    align: 'center',
                    render: (h, params) => h(DiyInput, {
                        props: {
                            obj: params
                        },
                        on: {
                            inputChange: this.inputChange
                        }
                    })
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 140,
                    align: 'center',
                    render: (h, params) => (h('div', {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-around'
                        }
                    }, [
                        h(
                            DiyModify,
                            {
                                props: {
                                    obj: params
                                },
                                on: {
                                    modify: this.modify
                                }
                            }
                        ),
                        h(
                            'a', {
                                on: {
                                    click: () => {
                                        this.deleteEvent(params);
                                    }
                                }
                            },
                            '删除'
                        )
                    ]))
                }
            ];
            this.getData();

            const timer = this.$config.debounce_wait;
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
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
                this.$https.cdpReportConfig.getListByType({
                    configType: 'trait',
                    typeName: this.typeName,
                    page: this.current,
                    rows: this.pageSize
                }).then((res) => {
                    this.tableData = res.data.data.data;
                    this.tableData.forEach((item) => {
                        this.$set(item, 'modify', false);
                    });
                    this.allDataSize = res.data.data.pageInfo.total;
                });
            },
            swtichChange(e, ind) {
                this.tableData[ind].configStatus = Number(e);
            },
            inputChange(e, ind) {
                this.tableData[ind].configValue = e;
            },
            modify(bool, ind) {
                this.tableData[ind].modify = bool;
                // 调用修改接口
                if (!bool) {
                    this.$https.cdpReportConfig.updataConfigByType([{
                        configType: 'trait',
                        id: this.tableData[ind].id,
                        configValue: this.tableData[ind].configValue,
                        configStatus: this.tableData[ind].configStatus
                    }]).then((res) => {
                        console.log(res);
                    });
                }
            },
            /** 删除表格数据 */
            deleteEvent(params) {
                this.$Modal.confirm({
                    title: '确认删除此活动？',
                    content: `特性名称：${params.row.typeName}`,
                    loading: true,
                    onOk: () => {
                        this.$Message.destroy();
                        this.$https.cdpReportConfig.delConfig(params.row.id).then(() => {
                            this.getData();
                            this.$Modal.remove();
                            this.$Message.success('已删除');
                        });
                    },
                    onCancel: () => {}
                });
            },
            pageChange(ind) {
                this.current = ind;
                this.getData();
            },
            resize() {
            },
            cancelCreat() {
                this.creatEvent = false;
            },
            submitCreat(params) {
                this.$https.cdpReportConfig.addConfigByType(params).then((res) => {
                    console.log(res);
                    this.getData();
                    this.creatEvent = false;
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .CharacterConfig{
        .nav{
            box-sizing: border-box;
            padding-left:6px;
            ul{
                display: flex;
                li{
                    ~li{margin-left: 5px;}
                }
                &~ul{
                    margin-left: 15px;
                }
            }
        }
        .containers{
            display: flex;
            flex-wrap: wrap;
            div{
                margin:0 auto;
            }
        }
    }
</style>
