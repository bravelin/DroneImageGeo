<!--修改账号realName弹窗-->
<template>
    <Dialog title="修改账号" class="edit-account-dialog" :show="editAccountVisible" @close="doDialogClose()">
        <div class="input-wrap">
            <label>账户登录名：</label>
            <input autocomplete="off" readonly disabled name="loginName" ref="loginName" v-model="loginName" type="text" placeholder="请输入账户登录名" maxlength="30"/>
        </div>
        <div class="input-wrap">
            <label>账户真实名：</label>
            <input autocomplete="off" name="realName" ref="realName" v-model="realName" type="text" placeholder="请输入账户真实名" maxlength="30"/>
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

    const prop = `$store.state.${ns.ACCOUNTS}.editAccountVisible`
    export default {
        name: 'EditDialog',
        computed: {
            editAccountVisible () {
                return this.$store.state[ns.ACCOUNTS].editAccountVisible
            }
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    const that = this
                    const state = that.$store.state[ns.ACCOUNTS]
                    that.loginName = state.editAccountLoginName
                    that.realName = state.editAccountRealName
                }
            }
        },
        data () {
            return {
                loginName: '',
                realName: ''
            }
        },
        methods: {
            doDialogClose () {
                this.$store.dispatch(ns.ACCOUNTS + '/' + types.ACCOUNTS_SWITCH_EDIT_DIALOG_VISIBLE_SYNC, { isShow: false })
            },
            checkForm () {
                const that = this
                const refs = that.$refs
                const store = that.$store
                const type = types.SWITCH_MESSAGE_TIP_SYNC
                if (!that.realName.trim()) {
                    refs.realName.focus()
                    store.dispatch(type, { show: true, tip: '请输入账号真实名称！' })
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
                    const accountId = store.state[ns.ACCOUNTS].editAccountId
                    that.$ajax({
                        method: 'PUT',
                        url: api.UPDATE_ACCOUNT_NAME + accountId,
                        data: { realName: that.realName.trim() }
                    }).then(res => {
                        store.dispatch(types.SWITCH_LOADING_SYNC, false)
                        if (res.code == 200) {
                            store.dispatch(type, { show: true, tip: '账号修改成功！' })
                            setTimeout(() => {
                                store.dispatch(ns.ACCOUNTS + '/' + types.ACCOUNTS_SWITCH_EDIT_DIALOG_VISIBLE_SYNC, { isShow: false })
                                that.$emit('refresh') // refresh data list
                            }, 1000)
                        } else {
                            store.dispatch(type, { show: true, tip: res.message || '修改失败！' })
                        }
                    })
                }
            }
        }
    }
</script>