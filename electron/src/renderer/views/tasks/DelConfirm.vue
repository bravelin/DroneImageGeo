<!--删除任务的确认弹窗-->
<template>
    <Dialog title="确认" class="confirm-dialog" :show="visible" @close="doDialogClose()">
        <div class="confirm-content">
            <div>确认要删除此任务：<span>{{ taskId }}</span></div>
        </div>
        <div class="dialog-ope-buttons">
            <div @click="doDialogClose()">取消</div>
            <div @click="doCommit()">确定</div>
        </div>
    </Dialog>
</template>
<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import api from '@/lib/api'

    export default {
        name: 'DelConfirm',
        computed: {
            visible () {
                return this.$store.state[ns.TASKS].delConfirmVisible
            },
            taskId () {
                return this.$store.state[ns.TASKS].delConfirmTaskId
            }
        },
        methods: {
            doCommit () {
                const that = this
                const store = that.$store
                const type = types.SWITCH_MESSAGE_TIP_SYNC
                store.dispatch(types.SWITCH_LOADING_SYNC, true)
                that.$ajax({
                    url: api.DEL_TASK + that.taskId,
                    method: 'DELETE'
                }).then(res => {
                    store.dispatch(types.SWITCH_LOADING_SYNC, false)
                    if (res.code == 200) {
                        store.dispatch(type, { show: true, tip: '任务删除成功！' })
                        that.$emit('refresh') // 刷新界面数据列表
                    } else {
                        store.dispatch(type, { show: true, tip: res.message || '任务删除失败！' })
                    }
                })
                that.doDialogClose()
            },
            doDialogClose () {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_DEL_CONFIRM_VISIBLE_SYNC, { isShow: false })
            }
        }
    }
</script>
