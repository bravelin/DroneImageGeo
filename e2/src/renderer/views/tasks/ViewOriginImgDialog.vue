<!--查看某个任务的原图列表-->
<template>
    <Dialog title="任务原图" class="view-image-dialog" :show="dialogVisible" @close="doDialogClose()">
        <div class="panel-tools">
            <div class="left">
                <span>任务ID：{{ taskId }}</span>
                <span>状态：{{ taskStatus }}</span>
                <span>航测日期：{{ aerialDate }}</span>
                <span>{{ imgAmount }}张图片</span>
                <span>{{ totalSize }}</span>
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
                    <li><a @click="doPreview(img)" class="link">{{ img.fileName }}</a></li>
                    <li>{{ img.photoTime }}</li>
                    <li>{{ img.fileSize }}</li>
                    <li>{{ img.imgSize }}</li>
                    <li>{{ img.lng }}</li>
                    <li>{{ img.lat }}</li>
                    <li>{{ img.h }}</li>
                    <li><div class="dialog-table-button" @click="doDownload(img)">下载</div></li>
                </ul>
            </div>
        </div>
        <div v-show="images.length==0" class="null-list"></div>
        <Preview :is-show.sync="showPreview" :list="previewList" :index="previewIndex" slot="preview"></Preview>
    </Dialog>
</template>
<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import api from '@/lib/api'
    import { fromatFileSize, formatTime } from '@/lib/util'
    import Preview from '@/components/Preview'

    const prop = `$store.state.${ns.TASKS}.viewOriginImgVisible`
    export default {
        name: 'ViewOriginImgDialog',
        components: { Preview },
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
                imgAmount: 0,
                images: [],
                showPreview: false,
                previewList: [],
                previewIndex: 0
            }
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    const that = this
                    that.taskStatus = ''
                    that.aerialDate = ''
                    that.totalSize = ''
                    that.imgAmount = '-'
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
                        const resData = res.data
                        that.taskStatus = resData.status
                        that.aerialDate = formatTime(new Date(resData.aerialDate), 'yyyy-MM-dd')
                        that.totalSize = fromatFileSize(resData.imgTotalSize)
                        that.imgAmount = resData.imgTotalAmount
                        that.getOriginImgs()
                    } else {
                        store.dispatch(types.SWITCH_LOADING_SYNC, false)
                        store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: res.message || '获取任务详情失败！' })
                        setTimeout(() => { that.doDialogClose() }, 100)
                    }
                })
            },
            // 获取原图列表
            getOriginImgs () {
                const that = this
                const store = that.$store
                that.$ajax({ url: api.GET_ORIGIN_IMG_LIST + that.taskId }).then(res => {
                    if (res.code == 200) {
                        const resData = res.data
                        const list = []
                        const previewList = []
                        resData.forEach(item => {
                            list.push({
                                imgUrl: item.imgUrl,
                                lat: item.latitude,
                                lng: item.longitude,
                                h: item.altitude,
                                createdAt: formatTime(new Date(item.createdAt)),
                                imgSize: item.imgWidth + '*' + item.imgHeight,
                                fileName: item.imgName,
                                fileSize: fromatFileSize(item.imgSize),
                                photoTime: formatTime(new Date(item.imgDate))
                            })
                            previewList.push({
                                src: item.imgUrl, w: item.imgWidth, h: item.imgHeight
                            })
                        })
                        that.images = list
                        that.previewList = previewList
                    } else {
                        that.images = []
                    }
                    store.dispatch(types.SWITCH_LOADING_SYNC, false)
                })
            },
            // 关闭弹窗
            doDialogClose () {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_VIEW_ORIGIN_IMG_VISIBLE_SYNC, false)
            },
            // 预览图片
            doPreview (item) {
                const that = this
                that.previewIndex = 0 // 获取index
                for (let i = 0; i < that.previewList.length; i++) {
                    if (that.previewList[i].src == item.imgUrl) {
                        that.previewIndex = i
                        break
                    }
                }
                that.showPreview = true
            },
            // 下载图片
            doDownload (item) {
                const a = document.createElement('a')
                const event = new MouseEvent('click')
                a.download = item.fileName
                a.href = item.imgUrl
                a.dispatchEvent(event)
            }
        }
    }
</script>

