<template>
    <div class="DiyInput">
        <!-- <a :style="{color:!obj?'':'#888',cursor:!obj?'':'no-drop'}" @click="modify"> 修改 </a> -->
        <a v-if="modifyBool" @click="modify(modifyBool)"> 修改 </a>
        <a v-else @click="modify(modifyBool)"> 保存设置 </a>
    </div>
</template>

<script>
// #888  cursor:no-drop
    export default {
        data() {
            return {
                modifyBool: true
            };
        },
        props: {
            obj: {
                type: Object,
                required: false
            }
        },
        methods: {
            modify(bool) {
                this.$emit('modify', bool, this.obj.index);
                this.modifyBool = !this.modifyBool;

                // if (bool) {
                //     this.$emit('modify', bool, this.obj.index);
                // } else {
                //     console.log('保存');
                //     this.$emit('save', bool);
                // }
                // if()
                // this.$emit('inputChange', e);
            }
        }
    };
</script>
