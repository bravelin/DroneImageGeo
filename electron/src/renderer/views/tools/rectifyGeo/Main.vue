<template>
    <div class="page">
        <h1 style="color:#000">Rectify Geo...</h1>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    export default {
        name: 'ToolsRectifyGeo',
        created () {
            this.$store.dispatch(types.SWITCH_LOADING_SYNC, false)
        }
    }
</script>
