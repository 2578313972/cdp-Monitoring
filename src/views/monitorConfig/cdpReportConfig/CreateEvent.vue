<template>
  <div class="CreateEvent slide-create-box ">
    <edit-title
      :isShowBtn="false"
      :title="title"
    ></edit-title>
    <div class="slide-scroll-box dialog-padding20">
      <Card dis-hover class="pl20 pr20">
        <p slot="title">模块名称：批量添加人群用户覆盖式阈值</p>
        <Row class="padding16-18" style="background: white">
            <i-col span="24" class="flex nav">
                <div class="select">
                <span>人群</span>
                <Select
                    filterable
                    clearable
                    v-model="name"
                    @on-change="changename"
                    style="flex: 1"
                    size="large"
                >
                    <Option v-for="item in nameArr" :value="item.name" :key="item.code">{{
                    item.name
                    }}</Option>
                </Select>
                </div>
                <div class="select second">
                <span>设置阈值</span>
                <InputNumber :min="0" v-model="configValue"  size="large" style="flex: 1" />
                </div>
                <div style="line-height: 40px;margin-left:20px;">
                    <Button type="primary" :disabled="!name" @click="addList">+ 添加</Button>
                </div>
            </i-col>

            <i-col span="24" class="flex" style="line-height:55px;" v-for="(item,index) in listArr" :key="item.typeId">
                <div class="list">{{item.typeName}}</div>
                <div class="list">{{item.channelId}}</div>
                <div class="list">
                    <Switch size="large" v-model="item.configStatus" @on-change="switchChange(index)">
                        <span slot="open">启用</span>
                        <span slot="close">禁用</span>
                    </Switch>
                </div>
                <div class="list">
                    <InputNumber :min="0" v-model="item.configValue" />
                </div>
                <div class="list" style="text-align:center" @click="listRemove(index)"><a>删除</a></div>
            </i-col>

            <i-col span="24" class="flex" style="margin-top:20px;">
                <Button type="primary" :disabled="!listArr.length" @click="ok">保存</Button>
                <Button style="margin-left:15px;" @click="cancel">取消</Button>
            </i-col>
        </Row>
      </Card>
    </div>
  </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        data() {
            return {
                title: '添加阈值配置',
                configValue: null,
                name: '',
                nameArr: [],
                listArr: []
            };
        },
        components: {
            editTitle
        },
        props: {
            configType: {
                type: String,
                required: true
            }
        },
        created() {
            this.$https.cdpReportConfig.getCrowdList().then((res) => {
                this.nameArr = res.data.data;
            });
        },
        methods: {
            addList() {
                const nameArr = this.nameArr.find(item => item.name === this.name);
                this.$https.cdpReportConfig.checkUniqueKey({
                    configType: this.configType,
                    typeId: nameArr.code
                }).then((res) => {
                    if (res.data.data.result && !this.listArr.find(item => item.typeId === nameArr.code)) {
                        this.listArr.push({
                            typeId: nameArr.code,
                            typeName: nameArr.name,
                            configValue: this.configValue === null ? 1000 : this.configValue,
                            channelId: nameArr.channelId,
                            configStatus: true
                        });
                    } else {
                        this.$Message.error(`${nameArr.name}已存在!`);
                    }
                    this.name = '';
                    this.configValue = null;
                });
            },
            changename(e) {
                console.log(this.name, e);
            },
            switchChange(ind) {
                console.log(this.listArr[ind].configStatus);
            },
            listRemove(ind) {
                this.$Modal.confirm({
                    title: '确认删除？',
                    content: `名称：${this.listArr[ind].typeName}`,
                    loading: true,
                    onOk: () => {
                        this.listArr.splice(ind, 1);
                        this.$Modal.remove();
                        this.$Message.success('已删除');
                    },
                    onCancel: () => {
                        this.$Message.warning('已取消');
                    }
                });
            },
            cancel() {
                this.$emit('cancelCreatEvent', false);
            },
            ok() {
                const params = this.listArr.map((item) => {
                    item.configType = this.configType;
                    item.configStatus = Number(item.configStatus);
                    return item;
                });
                this.$emit('submitCreatEvent', params);
            }
        }
    };
</script>

<style lang="less" scoped>
.CreateEvent{
    .select {
      // width:200px;
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
        //     // display: flex;
        //     // flex-wrap: wrap-reverse;
      }
      ~ .second {
        margin-left: 20px;
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
    /deep/ .ivu-input{
        border: 0px;
        box-shadow: 0 0 0 0;
    }
    .pr20 {
        padding: 0;
    }
    .list{
        flex: 1;
        padding-top: 15px;
        border-bottom: 1px solid #9999;
    }
}

</style>
