<template>
    <h1>Task Page</h1>
</template>
<script>
    import types from '@/store/constants/types'
    export default {
        mounted () {
            this.$store.dispatch(types.SWITCH_LOADING_SYNC, false)
        }
    }
</script>