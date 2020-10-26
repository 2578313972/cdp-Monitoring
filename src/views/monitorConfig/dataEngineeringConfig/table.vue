<template>
  <div class="dataEngineering">
    <div class="page-title bottom-shadow page-title-tab" ref="likeScreen">
        <keep-alive style="position: relative;">
            <Spin size="large" fix v-if="!showComponent"></Spin>
            <component v-else :is="menuName" :screenWidth="screenWidth" />
        </keep-alive>
    </div>
  </div>
</template>

<script>
    import Parameter from './Parameter';
    import Information from './Information';

    export default {
        data() {
            return {
                showComponent: false,
                screenWidth: 0
            };
        },
        props: {
            menuName: {
                type: String,
                required: true
            }
        },
        components: {
            Parameter,
            Information
        },
        created() {
        },
        mounted() {
            this.resize();
            this.showComponent = true;
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            resize() {
                this.screenWidth = this.$refs.likeScreen.clientWidth - 36;
            }
        }
    };
</script>

<style lang="less" scoped>
    .dataEngineering{
        height: 100%;
        background-color: white;
    }
</style>
