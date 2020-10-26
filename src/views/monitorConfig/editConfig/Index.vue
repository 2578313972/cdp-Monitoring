<template>
    <div class="editPage">
        <Row>
            <i-col span="24">
                <Card dis-hover>
                    <p slot="title">模块编辑</p>
                    <p>模块名称：CLV算法</p>
                </Card>
            </i-col>
            <i-col span="24" class="borbox" style="padding:0 20px;margin-top:20px;">
                <Card dis-hover>
                    <p slot="title" class="flex" style="height:40px;">
                    <Select style="width:200px;" size="large" >
                        <Option v-for="item in aaa" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                    </p>
                    <p>模块名称：CLV算法</p>
                </Card>
                <i-col span="24">
                    <Button type="primary">保存</Button>
                    <Button>取消</Button>
                </i-col>
            </i-col>
            <!-- <i-col span="24">模块名称：CLV算法</i-col> -->
        </Row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                aaa: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            };
        },
        created() {
            console.log('进入');
        }
    };
</script>
