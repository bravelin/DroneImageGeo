<!--新增任务弹窗-->
<template>
    <Dialog title="新增任务" class="add-task-dialog" :show="addDialogVisible" @close="doDialogClose()">
        <div class="input-wrap">
            <label>任务备注：</label>
            <input ref="remark" v-model="remark" type="text" placeholder="请输入任务备注" maxlength="200"/>
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

    const prop = `$store.state.${ns.TASKS}.addDialogVisible`
    export default {
        name: 'AddDialog',
        computed: {
            addDialogVisible () {
                return this.$store.state[ns.TASKS].addDialogVisible
            }
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    const that = this
                    that.remark = ''
                }
            }
        },
        data () {
            return {
                remark: ''
            }
        },
        methods: {
            doDialogClose () {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_ADD_DIALOG_VISIBLE_SYNC, false)
            },
            checkForm () {
                const that = this
                const refs = that.$refs
                const store = that.$store
                const type = types.SWITCH_MESSAGE_TIP_SYNC
                if (!that.remark.trim()) {
                    refs.remark.focus()
                    store.dispatch(type, { show: true, tip: '请输入任务备注！' })
                    return false
                }
                return true
            },
            doCommit () {
                const that = this
                const store = that.$store
                const type = types.SWITCH_MESSAGE_TIP_SYNC
                if (that.checkForm()) {
                    store.dispatch(types.SWITCH_LOADING_SYNC, true)
                    that.$ajax({
                        method: 'post',
                        url: api.ADD_TASK,
                        data: { remark: that.remark.trim() }
                    }).then(res => {
                        store.dispatch(types.SWITCH_LOADING_SYNC, false)
                        if (res.code == 200) {
                            store.dispatch(type, { show: true, tip: '任务创建成功！' })
                            that.$emit('refresh') // refresh data list
                            setTimeout(() => {
                                store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_ADD_DIALOG_VISIBLE_SYNC, false)
                            }, 1000)
                        } else {
                            store.dispatch(type, { show: true, tip: res.message || '创建失败！' })
                        }
                    })
                }
            }
        }
    }
</script>