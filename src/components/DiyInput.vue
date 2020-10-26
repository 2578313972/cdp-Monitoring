<template>
    <div class="DiyInput">
        <Input type="number" v-model="value" :readonly='!obj.row.modify' @on-change="inputChange" placeholder="Enter something..." style="width:100px;" />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: ''
            };
        },
        props: {
            obj: {
                type: Object,
                required: true
            }
        },
        created() {
            // console.log(this.obj.row);
            this.value = this.obj.row.configValue;
        },
        methods: {
            inputChange() {
                this.$emit('inputChange', this.value, this.obj.index);
            }
        }
    };
</script>
