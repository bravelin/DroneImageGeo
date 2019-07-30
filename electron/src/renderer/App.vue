<template>
    <div id="app" :style="{ height: winHeight + 'px' }">
        <HeaderBar></HeaderBar>
        <div class="app-content">
            <NavMenus></NavMenus>
            <router-view :style="{ height: (winHeight - 70) + 'px' }"/>
        </div>
        <Spinner v-show="loading"></Spinner>
        <ChangePassword></ChangePassword>
        <GlobalMessage></GlobalMessage>
    </div>
</template>

<script>
    import Spinner from '@/components/Spinner'
    import NavMenus from '@/views/NavMenus'
    import types from './store/constants/types'
    import HeaderBar from '@/views/HeaderBar'
    import ChangePassword from '@/views/ChangePassword'
    import GlobalMessage from '@/components/Message'
    import tags from '@/lib/tags'
    import config from '@/lib/config'

    const win = window
    const doc = document
    const ls = localStorage

    export default {
        name: 'App',
        components: {
            Spinner, HeaderBar, ChangePassword, GlobalMessage, NavMenus
        },
        computed: {
            loading () {
                return this.$store.state.global.loading
            },
            winHeight () {
                return this.$store.state.global.winHeight
            }
        },
        created () {
            const that = this
            const win = window
            // 监听窗口大小的改变
            win.addEventListener('resize', () => {
                that.doWinResize()
            })
            that.$store.dispatch(types.UPDATE_USER_INFO_SYNC, {
                userToken: ls.getItem(tags.userToken) || '',
                userId: ls.getItem(tags.userId) || '', // 用户ID
                userName: ls.getItem(tags.userName) || '', // 登录名
                userRole: ls.getItem(tags.userRole) || '0', // 角色
                realName: ls.getItem(tags.realName) || '', // RealName
                loginRemember: ls.getItem(tags.loginRemember) === '0' // 是否记住账号
            })
            if (ls.getItem(tags.baseUrl)) {
                config.storeBaseUrl = ls.getItem(tags.baseUrl)
            }
            that.doWinResize()
        },
        methods: {
            doWinResize () {
                const winHeight = doc.documentElement.clientHeight || win.innerHeight
                const winWidth = doc.documentElement.clientWidth || win.innerWidth
                doc.body.style.minHeight = winHeight + 'px'
                this.$store.dispatch(types.SET_WINDOW_SIZE_SYNC, { winHeight, winWidth })
                win.ss = this.$store.state
            }
        }
    }
</script>

<style lang="scss">
    @import './style/common/app.scss';
</style>
