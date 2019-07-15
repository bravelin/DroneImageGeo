<!--数据管理之数据录入弹窗-->
<template>
    <Dialog title="数据录入" class="data-entry-dialog" :show="dataEntryDialogShow" @close="doDialogClose()">
        <div class="dialog-table">
            <ul>
                <li>编号</li>
                <li>名称</li>
                <li>图层类型</li>
                <li>创建时间</li>
                <li>数据编辑</li>
                <li>自动统计</li>
            </ul>
            <ul>
                <li>3</li>
                <li>植株</li>
                <li>点</li>
                <li></li>
                <li><div class="dialog-table-button">数据编辑</div></li>
                <li></li>
            </ul>
            <ul>
                <li>4</li>
                <li>果园</li>
                <li>面</li>
                <li></li>
                <li><div class="dialog-table-button">数据编辑</div></li>
                <li><div class="dialog-table-button">自动统计</div></li>
            </ul>
        </div>
    </Dialog>
</template>
<script>
    import { createNamespacedHelpers, mapState } from 'vuex'
    import ns from '@/store/constants/ns'
    import types from '@/store/constants/types'

    const moduleNameSpace = ns.DATA_MANAGE
    const thisMapState = createNamespacedHelpers(moduleNameSpace).mapState
    const showProp = 'dataEntryDialogShow'

    export default {
        name: 'DataEntry',
        computed: {
            ...thisMapState([showProp])
        },
        data () {
            return {
            }
        },
        methods: {
            doDialogClose () {
                this.$store.commit(moduleNameSpace + '/' + types.SWITCH_DATA_ENTRY_DIALOG_STATUS, false)
            }
        }
    }
</script>
