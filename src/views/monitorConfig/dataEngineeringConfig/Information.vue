<template>
    <!-- 数据配置 -->
    <div class="Information">
        <Row class="padding16-18" style="background:white;">
            <i-col span="24" class="flex nav">
                <ul>
                    <li>模块名称 </li>
                    <li><Input /></li>
                </ul>
                <ul>
                    <li><Button type="primary">搜索</Button></li>
                </ul>
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
    </div>
</template>

<script>
    import DiySwitch from './DiySwitch';

    export default {
        data() {
            return {
                aaa: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                columns: [],
                tableData: [],
                current: 1,
                pageSize: 0,
                allDataSize: 0
            };
        },
        props: {
            screenWidth: {
                type: Number,
                require: true
            }
        },
        created() {
            this.columns = [
                {
                    title: '模块名称',
                    key: 'key',
                    // minWidth: 100,
                    align: 'left',
                    tooltip: true
                },
                {
                    title: '更新时间',
                    key: 'value',
                    // minWidth: 100,
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '显示状态',
                    // minWidth: 100,
                    align: 'center',
                    tooltip: true,
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
                            'a', {
                                on: {
                                    click: () => {
                                        this.$router.push('/dataEngineeringConfig/editConfig');
                                    }
                                }
                            },
                            '编辑'
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
                this.tableData = [
                    {
                        key: '1',
                        value: '2'
                    }
                ];
            },
            swtichChange(e) {
                console.log(e);
            },
            /** 删除表格数据 */
            deleteEvent(params) {
                this.$Modal.confirm({
                    title: '确认删除此活动？',
                    content: `活动名称：${params.row.display_name}`,
                    loading: true,
                    onOk: () => {
                        this.$Message.destroy();
                        // this.$https.calendarLife.delete(params.row.code).then(() => {
                        this.$Modal.remove();
                        // this.$Message.success('已删除');
                        // });
                    },
                    onCancel: () => {}
                });
            },
            pageChange(ind) {
                this.current = ind;
                this.getData();
            },
            analysis() {},
            resize() {}
        }
    };
</script>

<style lang="less" scoped>
    .Information{
        .nav{
            box-sizing: border-box;
            padding-left:6px;
            margin-bottom: 25px;
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
