<!--任务列表-->
<template>
    <div class="page task-page">
        <div class="panel-tools">
            <div class="left">
                <input type="text" ref="key" v-model="keyWord" placeholder="输入关键字" maxlength="50"/>
                <div class="search-button tool-button" @click="doSearch()"><i class="iconfont">&#xe782;</i>搜索</div>
            </div>
            <div class="right">
                <div class="tool-button" @click="doAddTask()"><i class="iconfont">&#xe600;</i>新增任务</div>
            </div>
        </div>
        <div class="data-table">
            <ul>
                <li>ID</li>
                <li>创建时间</li>
                <li>创建人</li>
                <li>状态</li>
                <li>航测时间</li>
                <li>数据量大小</li>
                <li>图片总数量</li>
                <li>瓦片总数量</li>
                <li>备注</li>
                <li>操作</li>
            </ul>
            <template v-if="dataList.length">
                <ul v-for="item in dataList" :key="item.id">
                    <li>{{ item.id }}</li>
                    <li>{{ item.createdAt }}</li>
                    <li>{{ item.creatorName }}</li>
                    <li>{{ item.status }}</li>
                    <li>{{ item.aerialDate }}</li>
                    <li>{{ item.imgTotalSize }}</li>
                    <li>{{ item.imgTotalAmount }}</li>
                    <li>{{ item.tilesAmount }}</li>
                    <li>{{ item.remark }}</li>
                    <li>
                        <div class="dialog-table-button" v-if="item.status=='0'" @click="doDel(item)">删除</div>
                        <div class="dialog-table-button" v-if="item.status=='0'" @click="doUploadOriginImage(item)">上传原始图</div>
                        <div class="dialog-table-button" v-if="item.status=='1'" @click="doViewOriginImage(item)">查看原始图</div>
                    </li>
                </ul>
            </template>
            <div v-else class="no-data-list">未能查询到数据！</div>
            <Pagination :total="totalPage" :curr="currPage" v-show="dataList.length"></Pagination>
        </div>
        <AddDialog @refresh="doSearch()"></AddDialog>
        <DelConfirm @refresh="doSearch()"></DelConfirm>
        <UploadOriginImgDialog @refresh="doSearch()"></UploadOriginImgDialog>
        <ViewOriginImgDialog @refresh="doSearch()"></ViewOriginImgDialog>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import api from '@/lib/api'
    import AddDialog from './AddDialog'
    import DelConfirm from './DelConfirm'
    import UploadOriginImgDialog from './UploadOriginImgDialog'
    import ViewOriginImgDialog from './ViewOriginImgDialog'

    export default {
        name: 'Tasks',
        components: {
            AddDialog, DelConfirm, UploadOriginImgDialog, ViewOriginImgDialog
        },
        computed: {
            dataList () {
                return this.$store.state[ns.TASKS].dataList
            },
            totalPage () {
                return this.$store.state[ns.TASKS].totalPage
            },
            currPage () {
                return this.$store.state[ns.TASKS].currentPage
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
                    url: api.GET_TASKS,
                    params: { page, pageSize, key: key ? encodeURIComponent(key) : '' }
                }).then(res => {
                    store.dispatch(types.SWITCH_LOADING_SYNC, false)
                    if (res.code == 200) {
                        const resData = res.data
                        resData.page = page
                        resData.pageSize = pageSize
                        store.dispatch(ns.TASKS + '/' + types.SET_TASKS_DATA_LIST_SYNC, resData)
                    } else {
                        store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: res.message || '查询请求失败！' })
                    }
                })
            },
            // 创建任务
            doAddTask () {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_ADD_DIALOG_VISIBLE_SYNC, true)
            },
            // 删除任务
            doDel ({ id }) {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_DEL_CONFIRM_VISIBLE_SYNC, {
                    id, isShow: true
                })
            },
            // 上传原始航拍图
            doUploadOriginImage ({ id }) {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_UPLOAD_ORIGIN_IMG_VISIBLE_SYNC, {
                    id, isShow: true
                })
            },
            // 查看原始图
            doViewOriginImage ({ id }) {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_VIEW_ORIGIN_IMG_VISIBLE_SYNC, {
                    id, isShow: true
                })
            }
        }
    }
</script>
<style lang="scss">
    @import '../../style/views/tasks.scss';
</style>
