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
    import { mapState } from 'vuex'
    export default {
        name: 'Header',
        computed: {
            ...mapState(['realName'])
        },
        methods: {
            doLogout () {
                const that = this
                const store = that.$store
                store.commit(types.CLEAR_USER_INFO)
                that.$router.push({ name: 'login' })
            },
            doShowUserInfo () {
                this.$store.commit(types.SWITCH_CHANGE_PW_DIALOG_STATUS, true)
            }
        }
    }
</script>
