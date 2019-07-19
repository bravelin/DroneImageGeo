<template>
    <div></div>
</template>
<script>
    import types from '@/store/constants/types'
    export default {
        name: 'Accounts',
        created () {
            const that = this
            const store = that.$store
            store.dispatch(types.SWITCH_LOADING_SYNC, false)
        }
    }
</script>
