<template>
    <div class="page home-page">
        <GMap></GMap>
        <Plane></Plane>
        <Tool></Tool>
        <!--数据录入-->
        <DataEntryDialog></DataEntryDialog>
        <!--导入导出-->
        <ImportExportDialog></ImportExportDialog>
        <!--果树审核-->
        <AuditDialog></AuditDialog>
        <!--修改密码-->
        <ChangePassword></ChangePassword>
        <!--果园信息编辑弹窗-->
        <GardenInfo></GardenInfo>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    import { createNamespacedHelpers, mapState } from 'vuex'
    import ns from '@/store/constants/ns'
    import GMap from '@/views/GMap'
    import Plane from '@/views/Plane'
    import Tool from '@/views/Tool'
    import DataEntryDialog from '@/views/dialog/DataEntry'
    import ImportExportDialog from '@/views/dialog/ImportExport'
    import AuditDialog from '@/views/dialog/Audit'
    import ChangePassword from '@/views/dialog/ChangePassword'
    import GardenInfo from '@/views/dialog/GardenInfo'

    const moduleNameSpace = ns.HOME
    const thisMapState = createNamespacedHelpers(moduleNameSpace).mapState
    export default {
        name: 'HomeIndex',
        components: {
            GMap, Plane, Tool, DataEntryDialog, ImportExportDialog, AuditDialog, ChangePassword, GardenInfo
        },
        created () {
            const that = this
            const store = that.$store
            store.commit(types.SWITCH_LOADING, false)
            setTimeout(() => {
                store.commit(ns.DATA_MANAGE + '/' + types.SWITCH_GARDEN_INFO_DIALOG_STATUS, true)
            }, 3000)
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
    @import '../style/views/plane.scss';
    @import '../style/views/tool.scss';
</style>
