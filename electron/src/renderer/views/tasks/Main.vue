<template>
    <h1>Task Page</h1>
</template>
<script>
    import types from '@/store/constants/types'
    export default {
        name: 'Tasks',
        created () {
            const that = this
            const store = that.$store
            store.dispatch(types.SWITCH_LOADING_SYNC, false)
        }
    }
</script>
