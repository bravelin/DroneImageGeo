<!--说明引导-->
<template>
    <div class="page guide-page">
        <div class="process"></div>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    export default {
        name: 'Guide',
        created () {
            this.$store.dispatch(types.SWITCH_LOADING_SYNC, false)
        }
    }
</script>
<style lang="scss">
    @import '../../style/views/guide.scss';
</style>
