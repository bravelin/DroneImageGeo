<!--任务列表-->
<template>
    <div class="page">
        <h1>Tasks</h1>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    export default {
        name: 'Tasks',
        created () {
            const that = this
            const store = that.$store
            store.commit(types.SWITCH_LOADING, false)
        }
    }
</script>
