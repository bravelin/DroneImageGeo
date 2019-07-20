<!--任务列表-->
<template>
    <h1 style="color:#000">Task Page</h1>
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
