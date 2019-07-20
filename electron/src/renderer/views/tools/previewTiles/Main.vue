<template>
    <div class="page">
        <h1 style="color:#000">Preview Google Tiles</h1>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    export default {
        name: 'ToolsPreviewTiles',
        created () {
            this.$store.dispatch(types.SWITCH_LOADING_SYNC, false)
        }
    }
</script>
