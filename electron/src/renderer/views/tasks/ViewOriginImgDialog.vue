<!--查看某个任务的原图列表-->
<template>
    <Dialog title="任务原图" class="view-image-dialog" :show="dialogVisible" @close="doDialogClose()">
        <div class="panel-tools">
            <div class="left">
                <span>任务ID：{{ taskId }}</span>
                <span>状态：{{ taskStatus }}</span>
                <span>航测日期：{{ aerialDate }}</span>
                <span v-show="images.length">{{ images.length }}张图片，{{ totalSize }}</span>
            </div>
        </div>
        <div class="list-wrap" v-show="images.length">
            <div class="data-table">
                <ul>
                    <li>文件名</li>
                    <li>拍摄时间</li>
                    <li>文件大小</li>
                    <li>图片尺寸</li>
                    <li>经度</li>
                    <li>纬度</li>
                    <li>高度</li>
                    <li>操作</li>
                </ul>
                <ul v-for="(img,index) in images" :key="index">
                    <li>{{ img.fileName }}</li>
                    <li>{{ img.photoTime }}</li>
                    <li>{{ img.fileSize }}</li>
                    <li>{{ img.imgSize }}</li>
                    <li>{{ img.lng }}</li>
                    <li>{{ img.lat }}</li>
                    <li>{{ img.h }}</li>
                    <li>查看</li>
                </ul>
            </div>
        </div>
        <div v-show="images.length==0" class="null-list"></div>
    </Dialog>
</template>
<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import api from '@/lib/api'
    // import { fromatFileSize } from '@/lib/util'

    const prop = `$store.state.${ns.TASKS}.viewOriginImgVisible`
    export default {
        name: 'ViewOriginImgDialog',
        computed: {
            dialogVisible () {
                return this.$store.state[ns.TASKS].viewOriginImgVisible
            },
            taskId () {
                return this.$store.state[ns.TASKS].viewOriginImgVisibleTaskId
            }
        },
        data () {
            return {
                taskStatus: '',
                aerialDate: '',
                totalSize: '',
                images: []
            }
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    const that = this
                    that.taskStatus = ''
                    that.aerialDate = ''
                    that.totalSize = ''
                    that.images = []
                    that.getTaskDetail()
                }
            }
        },
        methods: {
            // 查询任务详情
            getTaskDetail () {
                const that = this
                const store = that.$store
                store.dispatch(types.SWITCH_LOADING_SYNC, true)
                that.$ajax({ url: api.GET_TASK + that.taskId }).then(res => {
                    if (res.code == 200) {
                        console.log(res.data)
                        that.getOriginImgs()
                    } else {
                        store.dispatch(types.SWITCH_LOADING_SYNC, false)
                    }
                })
            },
            // 获取原图列表
            getOriginImgs () {
                const that = this
                const store = that.$store
                that.$ajax({ url: api.GET_ORIGIN_IMG_LIST + that.taskId }).then(res => {
                    if (res.code == 200) {
                        console.log(res.data)
                    } else {
                    }
                    store.dispatch(types.SWITCH_LOADING_SYNC, false)
                })
            },
            // 关闭弹窗
            doDialogClose () {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_VIEW_ORIGIN_IMG_VISIBLE_SYNC, false)
            }
        }
    }
</script>

