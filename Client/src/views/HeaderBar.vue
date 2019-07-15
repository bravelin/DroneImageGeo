<template>
    <div class="header-bar">
        <h1>裕丰科技地理数据处理系统</h1>
        <div>
            <div><i class="iconfont">&#xe625;</i>您好，<a @click="doShowUserInfo()">某某某</a></div>
            <div><i class="iconfont" @click="doLogout()">&#xe639;</i>退出</div>
        </div>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    export default {
        name: 'Header',
        methods: {
            doLogout () {
            },
            doShowUserInfo () {
                this.$store.commit(types.SWITCH_CHANGE_PW_DIALOG_STATUS, true)
            }
        }
    }
</script>
