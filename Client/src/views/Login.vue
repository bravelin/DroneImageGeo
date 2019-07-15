<template>
    <div class="page login-page">
        <div class="login-dialog" :class="{ active: showDialog }">
            <div class="title">
                <h1 :class="{ active: showMainTitle }">
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
        <div class="exit-app-btn" v-show="showExitApp" @click="doExitApp()"><i></i>退出</div>
    </div>
</template>
<script>
    import StorageTags from '@/lib/storageTags'
    import types from '@/store/constants/types'

    const ls = localStorage
    export default {
        name: 'Login',
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
                showExitApp: /yfkjtea/i.test(navigator.userAgent),
                loginRemember: !(ls.getItem(StorageTags.loginRemember) == '0')
            }
        },
        created () {
            const that = this
            const store = that.$store
            store.commit(types.SWITCH_LOADING, false)
            document.body.addEventListener('keypress', that.doPresskey)
        },
        mounted () {
            const that = this
            that.$nextTick(() => {
                const state = that.$store.state
                const loginName = state.userName
                const password = ls.getItem(StorageTags.password) || ''
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
            doExitApp () {
                location.href = 'exitAppRequest?exitApp=1'
            },
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
                    ls.setItem(StorageTags.userName, that.loginName)
                    ls.setItem(StorageTags.password, that.password)
                } else { // 从ls中清除用户名密码
                    ls.removeItem(StorageTags.userName)
                    ls.removeItem(StorageTags.password)
                }
            },
            // 执行登录
            doLogin () {
                const that = this
                const store = that.$store
                if (that.checkForm()) {
                    that.isProcessing = true
                    store.commit(types.SWITCH_LOADING, true)
                    that.$ajax({
                        url: '/data/user/login',
                        method: 'post',
                        data: {
                            username: that.loginName.trim(),
                            password: that.password.trim()
                        }
                    }).then(res => {
                        store.commit(types.SWITCH_LOADING, false)
                        if (res.code != 200) {
                            that.showMessage('您输入的账号或者密码不正确！')
                        } else {
                            that.showMessage('登录成功！')
                            const resData = res.repData
                            const userType = {
                                'BS+': '2', 'DT': '1'
                            }
                            store.commit(types.UPDATE_USER_INFO, {
                                userToken: resData.tokenKey,
                                userId: '',
                                userName: that.loginName.trim(),
                                userRole: userType[resData.user_type] || '0',
                                password: that.password.trim(),
                                loginRemember: that.loginRemember,
                            })
                            setTimeout(() => { that.$router.push({ name: 'home' }) }, 500)
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
            }
        },
        beforeDestroy () { // 移除事件
            document.body.removeEventListener('keypress', this.doPresskey)
        }
    }
</script>
<style lang="scss">
    @import '../style/views/login.scss';
</style>
