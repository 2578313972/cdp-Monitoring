<template>
<div>
    <Row class="ind">
        <i-col class="demo-spin-col" span="8">
            <Spin fix style="margin:auto;background-color:transparent;">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
        </i-col>
    </Row>
</div>

</template>

<style lang="less" scoped>
    .ind{
        width:100%;
        height: 100%;
        display: flex;
        background-color: rgba(255,255,255,.6);
        position: absolute;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        width:100%;
        height: 500px;
        position: relative;
    }
</style>
