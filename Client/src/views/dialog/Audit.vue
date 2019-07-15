<!--果树审核-->
<template>
    <Dialog title="果树审核" class="audit-dialog" :show="auditDialogShow" @close="doDialogClose()">
        <div class="dialog-condition-bar">
            <span>状态：</span>
            <DataSelector></DataSelector>
            <div class="search-button">检索</div>
        </div>
        <div class="dialog-table">
            <ul>
                <li>名称</li>
                <li>作业人</li>
                <li>作业时间</li>
                <li>处理</li>
            </ul>
            <ul><li></li><li></li><li></li><li></li></ul>
        </div>
    </Dialog>
</template>
<script>
    import { createNamespacedHelpers, mapState } from 'vuex'
    import ns from '@/store/constants/ns'
    import types from '@/store/constants/types'

    const moduleNameSpace = ns.DATA_MANAGE
    const thisMapState = createNamespacedHelpers(moduleNameSpace).mapState
    const showProp = 'auditDialogShow'

    export default {
        name: 'Audit',
        computed: {
            ...thisMapState([showProp])
        },
        data () {
            return {
            }
        },
        methods: {
            doDialogClose () {
                this.$store.commit(moduleNameSpace + '/' + types.SWITCH_AUDIT_DIALOG_STATUS, false)
            }
        }
    }
</script>
