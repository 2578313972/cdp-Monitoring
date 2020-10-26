<template>
  <!-- 唯一性检查 -->
  <div class="UniquenessCheck">
    <Loading v-if="loading"/>
    <Row class="padding16-18" style="background: white">
      <i-col span="24" class="flex nav">

        <div class="select">
          <span>ETL层级</span>
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
          <span>表名</span>
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
            :clearable=false
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
                tableName: '',
                fieldName: '',
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
            this.timeHorizon = [this.$time(new Date(new Date() - 1000 * 3600 * 24 * 6)), this.$time(new Date())];
        },
        mounted() {
            this.$https.dataEngineering.getUniquenessCheckETLLevel().then((res) => {
                this.tableNameArr = res.data.data;
                this.tableName = this.tableNameArr[0];
                this.changeTableName(this.tableNameArr[0]);
            });
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            getDate() {
                this.$https.dataEngineering.getUniquenessCheckData({
                    startDay: this.timeHorizon[0],
                    endDay: this.timeHorizon[1],
                    tableName: this.tableName,
                    fieldName: this.fieldName
                }).then((res) => {
                    this.loading = false;
                    this.maxXAxisData = res.data.data.map(item => item.time);
                    this.maxSeriesData = res.data.data.map(item => item.value);
                    this.chartCallBack();
                });
            },
            changeTableName(e) {
                this.$https.dataEngineering.getUniquenessCheckTables(e).then((res) => {
                    this.fieldNameArr = res.data.data;
                    this.fieldName = this.fieldNameArr[0];
                    this.getDate();
                });
            },
            changeFieldName() {
                this.getDate();
            },
            timeChange(e) {
                this.timeHorizon = e;
                this.getDate();
            },
            chartCallBack() {
                this.chart = this.echarts.init(this.$refs.chart);
                this.option = {
                    color: ['#5782C4'],
                    title: [{
                        text: '主键重复数量',
                        left: 'center'
                    }],
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
                            name: '主键重复数量',
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
.UniquenessCheck {
  .nav {
    box-sizing: border-box;
    padding-left: 6px;
    margin-bottom: 25px;
    .select {
      // width:200px;
      height: 42px;
      display: flex;
      border-radius: 5px;
      border: 1px solid #eaeef3;
      // [size]{
      // &:last-child{
      // background-color: blueviolet;
      // height: 100px;
      // }
      // }
      span {
        color: #0083b3;
        line-height: 38px;
        background-color: #dde4ed;
        border-radius: 5px 0 0 5px;
        padding: 0 10px;
        //     // display: flex;
        //     // flex-wrap: wrap-reverse;
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
  .echartContainers {
    display: flex;
    flex-wrap: wrap;
    div {
      margin: 0 auto;
    }
  }
}
</style>
