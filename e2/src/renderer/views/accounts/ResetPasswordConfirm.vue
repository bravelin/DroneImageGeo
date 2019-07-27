<!--重置账号密码的确认弹窗-->
<template>
    <Dialog title="确认" class="confirm-dialog" :show="visible" @close="doDialogClose()">
        <div class="confirm-content">
            <div>确认要重置此账号的密码：<span>{{ loginName }}</span>？</div>
            <div class="mini-text">密码将重置为：{{ initPassword }}</div>
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
    import { aesEncrypt } from '@/lib/util'
    import config from '@/lib/config'

    export default {
        name: 'ResetPasswordConfirm',
        computed: {
            visible () {
                return this.$store.state[ns.ACCOUNTS].resetPasswordConfirmVisible
            },
            loginName () {
                return this.$store.state[ns.ACCOUNTS].resetPasswordConfirmLoginName
            }
        },
        data () {
            return {
                initPassword: config.initPassword
            }
        },
        methods: {
            doCommit () {
                const that = this
                const store = that.$store
                const type = types.SWITCH_MESSAGE_TIP_SYNC
                store.dispatch(types.SWITCH_LOADING_SYNC, true)
                that.doDialogClose()
                const accountId = store.state[ns.ACCOUNTS].resetPasswordConfirmId
                console.log('accountId...', accountId)
                that.$ajax({
                    url: api.RESET_ACCOUNT_PASSWORD + accountId,
                    method: 'PUT',
                    data: { password: aesEncrypt(config.initPassword) }
                }).then(res => {
                    store.dispatch(types.SWITCH_LOADING_SYNC, false)
                    if (res.code == 200) {
                        store.dispatch(type, { show: true, tip: '密码重置成功！' })
                    } else {
                        store.dispatch(type, { show: true, tip: res.message || '密码重置失败！' })
                    }
                })
            },
            doDialogClose () {
                this.$store.dispatch(ns.ACCOUNTS + '/' + types.ACCOUNTS_SWITCH_RESET_PW_CONFIRM_VISIBLE_SYNC, { isShow: false })
            }
        }
    }
</script>
