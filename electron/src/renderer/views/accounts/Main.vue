<template>
    <div class="page account-page">
        <div class="panel-tools">
            <div class="left">
                <input type="text" ref="key" placeholder="输入账号名称（登录名）"  maxlength="50"/>
                <div class="search-button tool-button" @click="doSearch()"><i class="iconfont">&#xe782;</i>搜索</div>
            </div>
            <div class="right">
                <div class="tool-button" @click="doAddAccount()"><i class="iconfont">&#xe600;</i>添加账号</div>
            </div>
        </div>
        <div class="data-table">
            <ul>
                <li>序号</li>
                <li>登录名</li>
                <li>真实名称</li>
                <li>创建时间</li>
                <li>上次登录时间</li>
                <li>操作</li>
            </ul>
            <ul>
                <li>4</li>
                <li>果园</li>
                <li>面</li>
                <li></li>
                <li></li>
                <li>
                    <div class="dialog-table-button">删除</div>
                    <div class="dialog-table-button">重置密码</div>
                    <div class="dialog-table-button">修改名称</div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    export default {
        name: 'Accounts',
        created () {
            const that = this
            const store = that.$store
            store.dispatch(types.SWITCH_LOADING_SYNC, false)
        },
        methods: {
            doSearch () {
            },
            doAddAccount () {
            }
        }
    }
</script>
<style lang="scss">
    @import '../../style/views/accounts.scss';
</style>
