<template>
    <div class="DiySwitch">
        <Switch @on-change="aaa" :value='!!obj' size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
        </Switch>
    </div>
</template>

<script>
    export default {
        props: {
            obj: {
                type: Object,
                required: true
            }
        },
        methods: {
            aaa(e) {
                console.log(e, this.obj);
                this.$emit('swtichChange', e);
            }
        }
    };
</script>
