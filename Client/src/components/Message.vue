<template>
    <div class="message-tip">{{ tip }}</div>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex'
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'

    const showProp = `$store.state.showMessageTip`
    export default {
        name: 'NoResult',
        computed: {
            tip () {
                return this.$store.state.tip
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
                        this.$store.commit(types.SWITCH_MESSAGE_TIP, { show: false })
                    }, 3000)
                }
            }
        }
    }
</script>