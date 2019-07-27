<!--添加账号弹窗-->
<template>
    <Dialog title="添加账号" class="add-account-dialog" :show="addDialogVisible" @close="doDialogClose()">
        <div class="input-wrap">
            <label>账户登录名：</label>
            <input autocomplete="off" name="loginName" ref="loginName" v-model="loginName" type="text" placeholder="请输入账户登录名" maxlength="30"/>
        </div>
        <div class="input-wrap">
            <label>账户真实名：</label>
            <input autocomplete="off" name="realName" ref="realName" v-model="realName" type="text" placeholder="请输入账户真实名" maxlength="30"/>
        </div>
        <div class="input-wrap">
            <label>账户密码：</label>
            <input autocomplete="off" name="password" ref="password" v-model="password" type="text" placeholder="请输入账户密码" maxlength="50"/>
        </div>
        <div class="dialog-ope-buttons">
            <div @click="doDialogClose()">取消</div>
            <div @click="doCommit()">提交</div>
        </div>
    </Dialog>
</template>
<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import { aesEncrypt } from '@/lib/util'
    import api from '@/lib/api'
    import config from '@/lib/config'

    const prop = `$store.state.${ns.ACCOUNTS}.addDialogVisible`
    export default {
        name: 'AddDialog',
        computed: {
            addDialogVisible () {
                return this.$store.state[ns.ACCOUNTS].addDialogVisible
            }
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    const that = this
                    that.loginName = ''
                    that.realName = ''
                    that.password = config.initPassword // 统一的初始密码
                }
            }
        },
        data () {
            return {
                loginName: '',
                realName: '',
                password: ''
            }
        },
        methods: {
            doDialogClose () {
                this.$store.dispatch(ns.ACCOUNTS + '/' + types.ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE_SYNC, false)
            },
            checkForm () {
                const that = this
                const refs = that.$refs
                const store = that.$store
                const type = types.SWITCH_MESSAGE_TIP_SYNC
                if (!that.loginName.trim()) {
                    refs.loginName.focus()
                    store.dispatch(type, { show: true, tip: '请输入账号登录名称！' })
                    return false
                }
                if (!that.realName.trim()) {
                    refs.realName.focus()
                    store.dispatch(type, { show: true, tip: '请输入账号真实名称！' })
                    return false
                }
                if (!that.password) {
                    refs.password.focus()
                    store.dispatch(type, { show: true, tip: '请输入账号登录密码！' })
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
                        url: api.ADD_ACCOUNT,
                        data: { realName: that.realName.trim(), password: aesEncrypt(that.password), loginName: that.loginName.trim() }
                    }).then(res => {
                        store.dispatch(types.SWITCH_LOADING_SYNC, false)
                        if (res.code == 200) {
                            store.dispatch(type, { show: true, tip: '账号添加成功！' })
                            that.$emit('refresh') // refresh data list
                            setTimeout(() => {
                                store.dispatch(ns.ACCOUNTS + '/' + types.ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE_SYNC, false)
                            }, 1000)
                        } else {
                            store.dispatch(type, { show: true, tip: res.message || '添加失败！' })
                        }
                    })
                }
            }
        }
    }
</script>