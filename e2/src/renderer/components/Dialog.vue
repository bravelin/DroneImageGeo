<!--弹窗-->
<template>
    <div class="dialog">
        <div class="dialog-content" :class="{ active: contentActive }">
            <PlaneSubTitle :title="title"></PlaneSubTitle>
            <div class="close-button" @click="doClose()">&times;</div>
            <slot></slot>
        </div>
        <slot name="preview"></slot>    
    </div>
</template>
<script>
    export default {
        name: 'Dialog',
        props: {
            title: {
                type: String,
                default: ''
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            show (newValue, oldValue) {
                const that = this
                if (newValue) { // open
                    that.$el.style.display = 'flex'
                    setTimeout(() => { that.contentActive = true }, 200)
                } else { // close
                    that.contentActive = false
                    setTimeout(() => { that.$el.style.display = '' }, 300)
                }
            }
        },
        data () {
            return {
                contentActive: false
            }
        },
        methods: {
            doClose () {
                this.$emit('close')
            }
        }
    }
</script>
