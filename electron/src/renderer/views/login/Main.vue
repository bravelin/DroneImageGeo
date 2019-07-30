<template>
    <div class="page login-page">
        <div class="login-dialog" :class="{ active: showDialog }">
            <div class="title">
                <h1 :class="{ active: showMainTitle }" @dblclick="doShowSetting()">
                    <span>裕</span><span>丰</span><span>科</span><span>技</span><span>地</span><span>理</span><span>数</span><span>据</span><span>处</span><span>理</span><span>系</span><span>统</span>
                </h1>
            </div>
            <input type="password" style="display:none" name="password"/>
            <input type="text" style="display:none" name="loginName"/>
            <div class="input-item account" :class="{ active: accountActive }">
                <i class="iconfont">&#xe7d8;</i><input @focus="doInputFocusOrBlur('accountActive', true)" @blur="doInputFocusOrBlur('accountActive', false)" ref="loginNameInput" placeholder="请输入用户名" :disabled="isProcessing" v-model="loginName" type="text" name="loginName" disableautocomplete autocomplete="off" maxlength="50" tabindex="1"/>
            </div>
            <div class="input-item password" :class="{ active: passwordActive }">
                <i class="iconfont">&#xe61a;</i><input @focus="doInputFocusOrBlur('passwordActive', true)" @blur="doInputFocusOrBlur('passwordActive', false)" ref="passwordInput" placeholder="请输入密码" :disabled="isProcessing" v-model="password" type="password" name="password" disableautocomplete autocomplete="new-password" maxlength="50" tabindex="2"/>
            </div>
            <div class="remember" :class="{ active: loginRemember }" @click="switchLoginRemember()"><i class="iconfont">&#xe618;</i><div></div>记住密码</div>
            <div class="login-button"><button @click="doLogin()">登录</button></div>
            <div class="login-tip" :class="{ active: showTip }">{{ tipStr }}</div>
        </div>
        <div class="columns" :class="{ active: showColumns }">
            <div class="column1"></div>
            <div class="column2"></div>
            <div class="column3"></div>
            <div class="column4"></div>
            <div class="column5"></div>
            <div class="column6"></div>
            <div class="column7"></div>
            <div class="column8"></div>
            <div class="column9"></div>
        </div>
        <SettingDialog></SettingDialog>
    </div>
</template>
<script>
    import tags from '@/lib/tags'
    import types from '@/store/constants/types'
    import { aesEncrypt } from '@/lib/util'
    import api from '@/lib/api'
    import SettingDialog from './SettingDialog'

    const ls = localStorage
    export default {
        name: 'Login',
        components: { SettingDialog },
        data () {
            return {
                loginName: '',
                password: '',
                isProcessing: false,
                tipStr: '',
                showTip: false,
                timer: null,
                showDialog: false,
                showMainTitle: false,
                accountActive: false,
                passwordActive: false,
                showColumns: false,
                loginRemember: !(ls.getItem(tags.loginRemember) == '0')
            }
        },
        created () {
            const that = this
            const store = that.$store
            store.dispatch(types.SWITCH_LOADING_SYNC, false)
            document.body.addEventListener('keypress', that.doPresskey)
        },
        mounted () {
            const that = this
            that.$nextTick(() => {
                const loginName = ls.getItem(tags.userName) || ''
                const password = ls.getItem(tags.password) || ''
                const refs = that.$refs
                setTimeout(() => {
                    refs.passwordInput.value = that.password = password
                    refs.loginNameInput.value = that.loginName = loginName
                    if (!loginName) {
                        refs.loginNameInput.focus()
                    } else if (!password) {
                        refs.passwordInput.focus()
                    }
                }, 800)
                setTimeout(() => { that.showDialog = true }, 300)
                setTimeout(() => { that.showMainTitle = true }, 2000)
                setTimeout(() => { that.showColumns = true }, 500)
            })
        },
        methods: {
            doInputFocusOrBlur (prop, tag) {
                this[prop] = tag
            },
            showMessage (str) {
                const that = this
                that.tipStr = str
                if (that.timer) {
                    clearTimeout(that.timer)
                }
                that.showTip = true
                that.timer = setTimeout(() => {
                    that.showTip = false
                }, 3000)
            },
            switchLoginRemember () {
                const that = this
                that.loginRemember = !that.loginRemember
                if (that.loginRemember) { // 存用户名密码至ls
                    ls.setItem(tags.userName, that.loginName)
                    ls.setItem(tags.password, that.password)
                } else { // 从ls中清除用户名密码
                    ls.removeItem(tags.userName)
                    ls.removeItem(tags.password)
                }
            },
            // 执行登录
            doLogin () {
                const that = this
                const store = that.$store
                if (that.checkForm()) {
                    that.isProcessing = true
                    store.dispatch(types.SWITCH_LOADING_SYNC, true)
                    that.$ajax({
                        url: api.LOGIN,
                        method: 'post',
                        data: { loginName: that.loginName.trim(), password: aesEncrypt(that.password) }
                    }).then(res => {
                        store.dispatch(types.SWITCH_LOADING_SYNC, false)
                        if (res.code != 200) {
                            that.showMessage('您输入的账号或者密码不正确！')
                        } else {
                            that.showMessage('恭喜，登录成功！')
                            const resData = res.data
                            const payload = {
                                userToken: resData.token,
                                userId: resData.id,
                                userName: that.loginName.trim(),
                                realName: resData.realName,
                                userRole: resData.role,
                                password: that.password.trim(),
                                loginRemember: that.loginRemember
                            }
                            store.dispatch(types.UPDATE_USER_INFO_SYNC, payload)
                            // localstorage处理
                            ls.setItem(tags.loginRemember, that.loginRemember ? '1' : '0')
                            if (that.loginRemember) { // 记住用户信息
                                ls.setItem(tags.userToken, payload.userToken)
                                ls.setItem(tags.userId, payload.userId)
                                ls.setItem(tags.userName, payload.userName)
                                ls.setItem(tags.realName, payload.realName)
                                ls.setItem(tags.userRole, payload.userRole)
                                ls.setItem(tags.password, payload.password)
                            } else {
                                ls.removeItem(tags.userToken)
                                ls.removeItem(tags.userId)
                                ls.removeItem(tags.userName)
                                ls.removeItem(tags.realName)
                                ls.removeItem(tags.userRole)
                                ls.removeItem(tags.password)
                            }
                            // 页面跳转
                            setTimeout(() => {
                                that.$router.push({ name: 'tasks' })
                            }, 500)
                        }
                        setTimeout(() => { that.isProcessing = false }, 100)
                    })
                }
            },
            // 校验表单
            checkForm () {
                const that = this
                const refs = that.$refs
                if (!that.loginName.trim()) {
                    refs.loginNameInput.focus()
                    that.showMessage('请输入您的账号！')
                    return false
                }
                if (!that.password.trim()) {
                    refs.passwordInput.focus()
                    that.showMessage('请输入密码！')
                    return false
                }
                return true
            },
            doPresskey (e) { // 回车按键
                if (e.keyCode === 13) {
                    this.doLogin()
                }
            },
            doShowSetting () {
                this.$store.dispatch(types.SWITCH_SETTING_DIALOG_STATUS_SYNC, true)
            }
        },
        beforeDestroy () { // 移除事件
            document.body.removeEventListener('keypress', this.doPresskey)
        }
    }
</script>
<style lang="scss">
    @import '../../style/views/login.scss';
</style>
