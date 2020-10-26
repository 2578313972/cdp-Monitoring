<template>
  <div class="dataEngineering">
    <div class="page-title bottom-shadow page-title-tab" ref="likeScreen">
      <Menu class="pl24" mode="horizontal" :active-name="menuName" @on-select="meunOption">
        <MenuItem v-for="(item,index) in menuList" :key="item.name" :name="index">{{item.name}}</MenuItem>
      </Menu>
        <keep-alive>
            <router-view :menuName="menuList[menuName].component" />
        </keep-alive>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                menuList: [],
                menuName: 0,
                showComponent: false,
                screenWidth: 0
            };
        },
        created() {
            this.menuList = [
                // { name: '参数配置', component: 'Parameter' },
                { name: '数据配置', component: 'Information' }
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
                (this.$route.path === '/dataEngineeringConfig') || this.$router.push('/dataEngineeringConfig');
                this.menuName = e;
            },
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
