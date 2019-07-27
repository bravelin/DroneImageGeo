<template>
    <div class="message-tip">{{ tip }}</div>
</template>
<script>
    import types from '@/store/constants/types'
    const showProp = `$store.state.global.showMessageTip`
    export default {
        name: 'NoResult',
        computed: {
            tip () {
                return this.$store.state.global.tip
            }
        },
        watch: {
            [showProp] (newVal) {
                const el = this.$el
                if (newVal) {
                    el.classList.add('show')
                    setTimeout(() => { el.classList.add('active') }, 100)
                    setTimeout(() => {
                        el && el.classList.remove('active')
                        setTimeout(() => { el && el.classList.remove('show') }, 100)
                        this.$store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: false })
                    }, 3000)
                }
            }
        }
    }
</script>