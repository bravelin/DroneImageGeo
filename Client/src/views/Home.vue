<template>
    <div class="page home-page">
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    import { createNamespacedHelpers, mapState } from 'vuex'
    import ns from '@/store/constants/ns'

    const moduleNameSpace = ns.HOME
    const thisMapState = createNamespacedHelpers(moduleNameSpace).mapState
    export default {
        name: 'HomeIndex',
        components: {
        },
        created () {
            const that = this
            const store = that.$store
            store.commit(types.SWITCH_LOADING, false)
        },
        methods: {
        },
        beforeDestroy () {
            const that = this
            const store = that.$store
        }
    }
</script>
<style lang="scss">
    @import '../style/views/home.scss';
</style>
