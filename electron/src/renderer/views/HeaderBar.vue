<template>
    <div class="header-bar">
        <h1>裕丰科技地理数据处理系统</h1>
        <div>
            <div><i class="iconfont">&#xe625;</i>您好，<a @click="doShowUserInfo()">{{ realName }}</a></div>
            <div @click="doLogout()"><i class="iconfont">&#xe639;</i>退出</div>
        </div>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    import tags from '@/lib/tags'

    export default {
        name: 'Header',
        computed: {
            realName () {
                return this.$store.state.global.realName
            },
            changePwDialogStatus () {
                return this.$store.state.global.changePwDialogStatus.toString()
            }
        },
        methods: {
            doLogout () {
                const that = this
                const store = that.$store
                const ls = localStorage
                store.dispatch(types.CLEAR_USER_INFO_SYNC)
                // localstorage处理
                ls.removeItem(tags.userToken)
                ls.removeItem(tags.userId)
                ls.removeItem(tags.userRole)
                if (ls.getItem(tags.loginRemember) == '0') {
                    ls.removeItem(tags.userName)
                    ls.removeItem(tags.realName)
                    ls.removeItem(tags.password)
                }
                that.$router.push({ name: 'login' })
            },
            doShowUserInfo () {
                console.log('doShowUserInfo。。。。')
                this.$store.dispatch(types.SWITCH_CHANGE_PW_DIALOG_STATUS_SYNC, true)
            }
        }
    }
</script>
