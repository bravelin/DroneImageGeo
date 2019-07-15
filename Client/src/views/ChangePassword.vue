<!--修改密码-->
<template>
    <Dialog title="修改个人信息" class="change-password-dialog" :show="changePwDialogStatus" @close="doDialogClose()">
        <input type="text" style="display:none" name="userName"/>
        <div class="input-wrap user-name-input-wrap">
            <input autocomplete="off" name="userName" ref="userName" v-model="userName" type="text" placeholder="请输入中文名" maxlength="30"/>
        </div>
        <div class="input-wrap password-input-wrap">
            <input type="password" style="display:none" name="oldPassword" autocomplete="new-password"/>
            <input autocomplete="new-password" name="oldPassword" ref="oldPassword" v-model="oldPassword" type="password" placeholder="请输入旧密码" maxlength="50"/>
        </div>
        <div class="input-wrap password-input-wrap">
            <input type="password" style="display:none" name="password" autocomplete="new-password"/>
            <input autocomplete="new-password" name="password" ref="password" v-model="password" type="password" placeholder="请输入新密码" maxlength="50"/>
        </div>
        <div class="input-wrap password-input-wrap">
            <input type="password" style="display:none" name="confirmPassword" autocomplete="new-password"/>
            <input autocomplete="new-password" ref="confirmPassword" name="confirmPassword" v-model="confirmPassword" type="password" placeholder="请再次输入新密码" maxlength="50"/>
        </div>
        <div class="dialog-ope-buttons">
            <div @click="doDialogClose()">取消</div>
            <div @click="doCommit()">提交</div>
        </div>
    </Dialog>
</template>
<script>
    import { mapState } from 'vuex'
    import types from '@/store/constants/types'
    import { aesEncrypt } from '@/lib/util'

    const prop = `$store.state.changePwDialogStatus`
    export default {
        name: 'ChangePassword',
        computed: {
            ...mapState(['changePwDialogStatus', 'realName'])
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    const that = this
                    that.userName = that.realName
                    that.oldPassword = ''
                    that.password = ''
                    that.confirmPassword = ''
                }
            }
        },
        data () {
            return {
                userName: '',
                oldPassword: '',
                password: '',
                confirmPassword: ''
            }
        },
        methods: {
            doDialogClose () {
                this.$store.commit(types.SWITCH_CHANGE_PW_DIALOG_STATUS, false)
            },
            checkForm () {
                const that = this
                const refs = that.$refs
                const store = that.$store
                const type = types.SWITCH_MESSAGE_TIP
                if (!that.userName.trim()) {
                    refs.userName.focus()
                    store.commit(type, { show: true, tip: '请输入您的中文名称！' })
                    return false
                }
                if (!that.oldPassword) {
                    refs.oldPassword.focus()
                    store.commit(type, { show: true, tip: '请输入旧密码！' })
                    return false
                }
                if (!that.password) {
                    refs.password.focus()
                    store.commit(type, { show: true, tip: '请输入新密码！' })
                    return false
                }
                if (!that.confirmPassword) {
                    refs.confirmPassword.focus()
                    store.commit(type, { show: true, tip: '请再次输入新密码！' })
                    return false
                }
                if (that.password != that.confirmPassword) {
                    store.commit(type, { show: true, tip: '两次输入的密码不一致！' })
                    return false
                }
                return true
            },
            doCommit () {
                const that = this
                const store = that.$store
                const type = types.SWITCH_MESSAGE_TIP
                if (that.checkForm()) {
                    store.commit(types.SWITCH_LOADING, true)
                    that.$ajax({
                        method: 'post',
                        url: '/api/users/update',
                        data: { realName: that.userName, password: aesEncrypt(that.password), oldPassword: aesEncrypt(that.oldPassword) }
                    }).then(res => {
                        store.commit(types.SWITCH_LOADING, false)
                        if (res.code == 200) {
                            store.commit(type, { show: true, tip: '更新成功！' })
                            store.commit(types.UPDATE_ACCOUNT, { realName: that.userName, password: that.password })
                            setTimeout(() => {
                                store.commit(types.SWITCH_CHANGE_PW_DIALOG_STATUS, false)
                            }, 1000)
                        } else {
                            store.commit(type, { show: true, tip: res.message || '更新失败！' })
                        }
                    })
                }
            }
        }
    }
</script>