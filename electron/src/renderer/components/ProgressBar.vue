<!--模态弹窗进度条-->
<template>
    <div class="progress-bar dialog">
        <div class="dialog-content" :class="{ active: contentActive }">
            <h3>{{ tip }}...</h3>
            <div class="bar-content">
                <div><div :style="{ width: progress + '%' }"></div></div>
                <div>{{ curr }}/{{ total }}</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ProgressBar',
        props: {
            tip: {
                type: String,
                default: '请稍候，正在处理'
            },
            show: {
                type: Boolean,
                default: false
            },
            curr: {
                type: Number,
                default: 0,
                required: true
            },
            total: {
                type: Number,
                default: 100,
                required: true
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
        computed: {
            progress () {
                return (this.curr / this.total) * 100
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
