<template>
  <div class="home">
    <div class="page-title bottom-shadow page-title-tab" ref="likeScreen">
      <Menu class="pl24" mode="horizontal" :active-name="menuName" @on-select="meunOption">
        <MenuItem v-for="(item,index) in menuList" :key="item.name" :name="index">{{item.name}}</MenuItem>
      </Menu>
        <keep-alive style="position: relative;">
            <Spin size="large" fix v-if="!showComponent"></Spin>
            <component v-else :is="menuList[menuName].component" :screenWidth="screenWidth" />
        </keep-alive>
    </div>
  </div>
</template>

<script>
    import AlarmList from '../monitorUser/cdpReport/AlarmList';

    export default {
        name: 'home',
        data() {
            return {
                menuList: [],
                menuName: 0,
                showComponent: false,
                screenWidth: 0
            };
        },
        components: {
            AlarmList
        },
        created() {
            this.menuList = [
                { name: '报警列表', component: 'AlarmList' }
            ];
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
            meunOption(e) {
                this.menuName = e;
            },
            resize() {
                // this.screenWidth = this.$refs.likeScreen.clientWidth - 36;
            }
        }
    };
</script>

<style lang="less" scoped>
    .home{
        height: 100%;
        background-color: white;
    }
</style>
