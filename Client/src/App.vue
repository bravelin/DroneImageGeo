<template>
    <div id="app" :style="{ height: winHeight + 'px' }">
        <HeaderBar></HeaderBar>
        <router-view :style="{ height: (winHeight - 60) + 'px' }"/>
        <Spinner v-show="loading"></Spinner>
        <ChangePassword></ChangePassword>
        <GlobalMessage></GlobalMessage>
    </div>
</template>

<script>
    import Spinner from '@/components/Spinner'
    import { mapState } from 'vuex'
    import types from '@/store/constants/types'
    import HeaderBar from '@/views/HeaderBar'
    import ChangePassword from '@/views/ChangePassword'
    import GlobalMessage from '@/components/Message'

    export default {
        name: 'App',
        components: {
            Spinner, HeaderBar, ChangePassword, GlobalMessage
        },
        computed: {
            ...mapState(['loading', 'winHeight'])
        },
        created () {
            const that = this
            const store = that.$store
            const win = window
            // 监听窗口大小的改变
            win.addEventListener('resize', () => {
                store.commit(types.GET_WINDOW_SIZE)
            })
            store.commit(types.GET_WINDOW_SIZE)
        }
    }
</script>
<style lang="scss">
    @import './style/common/app.scss';
</style>
