<template>
    <div class="DiySwitch">
        <Switch @on-change="swtichChange" :disabled="!obj.row.modify" :value='!!obj.row.configStatus' size="large">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
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
            swtichChange(e) {
                this.$emit('swtichChange', e, this.obj.index);
            }
        }
    };
</script>
