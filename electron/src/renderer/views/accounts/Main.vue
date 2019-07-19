<template>
    <div class="page account-page">
        <div class="panel-tools">
            <div class="left">
                <input type="text" ref="key" v-model="keyWord" placeholder="输入账号名称（登录名）"  maxlength="50"/>
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
                <li>角色</li>
                <li>创建时间</li>
                <li>上次登录时间</li>
                <li>操作</li>
            </ul>
            <ul v-for="item in dataList" :key="item.id">
                <li>{{ item.index }}</li>
                <li>{{ item.loginName }}</li>
                <li>{{ item.realName }}</li>
                <li>{{ item.roleName }}</li>
                <li>{{ item.createdAt }}</li>
                <li>{{ item.lastLoginTime }}</li>
                <li>
                    <div class="dialog-table-button" v-if="item.role!='0'" @click="doDel(item)">删除</div>
                    <div class="dialog-table-button" v-if="item.role!='0'" @click="doResetPassword(item)">重置密码</div>
                    <div class="dialog-table-button" v-if="item.role!='0'">修改名称</div>
                </li>
            </ul>
        </div>
        <AddDialog @refresh="doSearch()"></AddDialog>
        <ResetPasswordConfirm></ResetPasswordConfirm>
        <DelConfirm @refresh="doSearch()"></DelConfirm>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import api from '@/lib/api'
    import AddDialog from './AddDialog'
    import ResetPasswordConfirm from './ResetPasswordConfirm'
    import DelConfirm from './DelConfirm'

    export default {
        name: 'Accounts',
        components: {
            AddDialog, ResetPasswordConfirm, DelConfirm
        },
        computed: {
            dataList () {
                return this.$store.state[ns.ACCOUNTS].dataList
            }
        },
        data () {
            return {
                keyWord: ''
            }
        },
        created () {
            const that = this
            const store = that.$store
            store.dispatch(types.SWITCH_LOADING_SYNC, false)
            that.doQuery({})
        },
        methods: {
            // 点击搜索按钮
            doSearch () {
                this.doQuery({ page: 1, pageSize: 15, key: this.keyWord.trim() })
            },
            // 数据列表查询
            doQuery ({ page, pageSize, key }) {
                const that = this
                const store = that.$store
                page = page || 1
                pageSize = pageSize || 15
                key = key || ''
                store.dispatch(types.SWITCH_LOADING_SYNC, true)
                that.$ajax({
                    url: api.GET_ACCOUNTS,
                    params: { page, pageSize, key: key ? encodeURIComponent(key) : '' }
                }).then(res => {
                    store.dispatch(types.SWITCH_LOADING_SYNC, false)
                    if (res.code == 200) {
                        const resData = res.data
                        resData.page = page
                        resData.pageSize = pageSize
                        store.dispatch(ns.ACCOUNTS + '/' + types.SET_ACCOUNTS_DATA_LIST_SYNC, resData)
                    } else {
                        store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: res.message || '查询请求失败！' })
                    }
                })
            },
            // 添加账号
            doAddAccount () {
                this.$store.dispatch(ns.ACCOUNTS + '/' + types.ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE_SYNC, true)
            },
            // 重置账号密码
            doResetPassword ({ id, loginName }) {
                this.$store.dispatch(ns.ACCOUNTS + '/' + types.ACCOUNTS_SWITCH_RESET_PW_CONFIRM_VISIBLE_SYNC, {
                    id, loginName, isShow: true
                })
            },
            // 删除账号
            doDel ({ id, loginName }) {
                this.$store.dispatch(ns.ACCOUNTS + '/' + types.ACCOUNTS_SWITCH_DEL_CONFIRM_VISIBLE_SYNC, {
                    id, loginName, isShow: true
                })
            }
        }
    }
</script>
<style lang="scss">
    @import '../../style/views/accounts.scss';
</style>
