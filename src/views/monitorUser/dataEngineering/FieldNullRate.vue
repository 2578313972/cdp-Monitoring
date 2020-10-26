<template>
  <!-- 字段空值率 -->
  <div class="FieldNullRate">
    <Loading v-if="loading" />
    <Row class="padding16-18" style="background: white">
      <i-col span="24" class="flex nav">
        <div class="select">
          <span>ETL层级</span>
          <Select
            filterable
            multiple
            v-model="etlName"
            @on-change="changeEtl"
            style="flex: 1"
            size="large"
          >
            <Option v-for="item in etlNameArr" :value="item" :key="item">{{
              item
            }}</Option>
          </Select>
        </div>

        <div class="select second">
          <span>表名</span>
          <Select
            filterable
            v-model="tableName"
            @on-change="changeTableName"
            style="flex: 1"
            size="large"
          >
            <Option v-for="item in tableNameArr" :value="item" :key="item">{{
              item
            }}</Option>
          </Select>
        </div>

        <div class="select second">
          <span>字段名称</span>
          <Select
            filterable
            v-model="fieldName"
            @on-change="changeFieldName"
            style="flex: 1"
            size="large"
          >
            <Option v-for="item in fieldNameArr" :value="item" :key="item">{{
              item
            }}</Option>
          </Select>
        </div>

        <div class="select second">
          <span>时间范围</span>
          <DatePicker
            type="daterange"
            size="large"
            :value="timeHorizon"
            :options="options"
            :clearable="false"
            @on-change="timeChange"
            placement="bottom-end"
            placeholder="Select date"
            style="width: 230px"
          ></DatePicker>
        </div>
      </i-col>
      <i-col class="echartContainers" span="24">
        <div ref="chart" style="height: 500px"></div>
      </i-col>
    </Row>
  </div>
</template>

<script>
    import Loading from '@/components/Loading';

    export default {
        data() {
            return {
                selection: [],
                // selection:[],
                etlName: '',
                tableName: '',
                fieldName: '',
                etlNameArr: [],
                tableNameArr: [],
                fieldNameArr: [],
                maxXAxisData: [],
                maxSeriesData: [],
                timeHorizon: [],
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
        components: {
            Loading
        },
        created() {
            this.timeHorizon = [
                this.$time(new Date(new Date() - 1000 * 3600 * 24 * 6)),
                this.$time(new Date())
            ];
        },
        mounted() {
            this.$https.dataEngineering.getFieldNullRateETLLevel().then((res) => {
                this.etlNameArr = res.data.data;
                this.etlName = this.etlNameArr[0];
            });
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            getDate() {
                this.$https.dataEngineering
                    .getFieldNullRateData({
                        startDay: this.timeHorizon[0],
                        endDay: this.timeHorizon[1],
                        tableName: this.tableName,
                        fieldName: this.fieldName
                    })
                    .then((res) => {
                        this.loading = false;
                        this.maxXAxisData = res.data.data.map(item => item.time);
                        this.maxSeriesData = res.data.data.map(item => item.value);
                        this.chartCallBack();
                    });
            },
            // etl
            changeEtl(e) {
                if (e.length === 0) {
                    setTimeout(() => {
                        this.etlName = ['ods'];
                    }, 200);
                    return;
                }
                this.$https.dataEngineering.getFieldNullRateTables(e).then((res) => {
                    this.tableNameArr = res.data.data;
                    this.tableName = this.tableNameArr[0];
                    this.changeTableName(this.tableNameArr[0]);
                });
            },
            // tableName
            changeTableName(e) {
                this.$https.dataEngineering.getFieldNullRateFieldNames(e).then((res) => {
                    this.fieldNameArr = res.data.data;
                    this.fieldName = this.fieldNameArr[0];
                    this.changeFieldName();
                });
            },
            // fieldName
            changeFieldName() {
                this.getDate();
            },
            // time
            timeChange(e) {
                this.timeHorizon = e;
                this.getDate();
            },
            chartCallBack() {
                this.chart = this.echarts.init(this.$refs.chart);
                this.option = {
                    color: ['#5782C4'],
                    title: [
                        {
                            text: '字段空值率',
                            left: 'center'
                        }
                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        splitLine: {
                            show: true
                        },
                        minInterval: 0,
                        data: this.maxXAxisData
                    },
                    yAxis: {
                        type: 'value',
                        min: -1,
                        max: 1,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        top: '40',
                        bottom: '6%',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        backgroundColor: '#DDE4ED',
                        borderWidth: 1,
                        borderColor: '#DDE4ED',
                        padding: 10,
                        textStyle: {
                            color: '#000'
                        },
                        position(pos, params, el, elRect, size) {
                            const obj = { top: '40' };
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = pos[0] < size.viewSize[0] / 2 ? '5%' : '10%';
                            return obj;
                        },
                        extraCssText: 'width: 170px'
                    },
                    series: [
                        {
                            name: '字段空值率',
                            type: 'line',
                            areaStyle: {
                                color: '#E7EDF7'
                            },
                            showSymbol: false,
                            data: this.maxSeriesData
                        }
                    ]
                };
                this.resize();
                this.chart.setOption(this.option);
            },
            resize() {
                this.$refs.chart.style.width = `${this.screenWidth}px`;
                this.chart.resize();
            }
        }
    };
</script>

<style lang="less" scoped>
.FieldNullRate {
  .nav {
    box-sizing: border-box;
    padding-left: 6px;
    margin-bottom: 25px;
    .select {
      height: 42px;
      display: flex;
      border-radius: 5px;
      border: 1px solid #eaeef3;
      span {
        color: #0083b3;
        line-height: 38px;
        background-color: #dde4ed;
        border-radius: 5px 0 0 5px;
        padding: 0 10px;
      }
      ~ .second {
        margin-left: 20px;
      }
    }
  }
  /deep/ .ivu-select-selection,
  /deep/ .ivu-select-selection-focused,
  /deep/ .ivu-select-selection:hover {
    border: 0px;
    box-shadow: 0 0 0 0;
  }
  /deep/ .ivu-input-large {
    border: 0;
  }
  /deep/ .ivu-select-multiple .ivu-select-input,/deep/ .ivu-select-large.ivu-select-multiple .ivu-tag{
    transform: translateY(3px);
  }
  .echartContainers {
    display: flex;
    flex-wrap: wrap;
    div {
      margin: 0 auto;
    }
  }
}
</style>
