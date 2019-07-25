<!--上传预处理之后的图片-->
<template>
    <Dialog :title="'上传图片（任务ID：'+ taskId + '）'" class="upload-image-dialog" :show="dialogVisible" @close="doDialogClose()">
        <div class="panel-tools">
            <div class="left">
                <div class="tool-button file-button">选择待上传图片目录<input type="file" ref="originImagePathObj" directory webkitdirectory @change="doSelectOriginImagePath()"/></div>
                <span>{{ originImagePath }}</span>
                <span v-show="images.length">{{ images.length }}张图片，{{ totalSize }}</span>
            </div>
            <div class="right">
                <div class="tool-button" @click="doStart()">开始上传</div>
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
                    <li>状态</li>
                </ul>
                <ul v-for="(img,index) in images" :key="index">
                    <li>{{ img.fileName }}</li>
                    <li>{{ img.photoTime }}</li>
                    <li>{{ img.fileSize }}</li>
                    <li>{{ img.imgSize }}</li>
                    <li>{{ img.lng }}</li>
                    <li>{{ img.lat }}</li>
                    <li>{{ img.h }}</li>
                    <li :class="'status-'+img.status">{{ statusText[img.status] }}</li>
                </ul>
            </div>
        </div>
        <div v-show="images.length==0" class="null-list"></div>
        <ProgressBar tip="请稍候，正在上传" :curr="currAddAmount" :total="images.length" :show="showProgressBar" @close="doHideProgressBar()"></ProgressBar>
    </Dialog>
</template>
<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import api from '@/lib/api'
    import { fromatFileSize, formatPhotoTime } from '@/lib/util'

    const fs = require('fs')
    const path = require('path')
    const piexif = require('piexifjs')
    const prop = `$store.state.${ns.TASKS}.uploadOriginImgVisible`

    export default {
        name: 'UploadOriginImgDialog',
        computed: {
            dialogVisible () {
                return this.$store.state[ns.TASKS].uploadOriginImgVisible
            },
            taskId () {
                return this.$store.state[ns.TASKS].uploadOriginImgVisibleTaskId
            }
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    const that = this
                    that.list = []
                }
            }
        },
        data () {
            return {
                images: [],
                originImagePath: '', // 待上传图片目录
                currAddAmount: 0, // 当前已处理的数目
                showProgressBar: false, // 是否显示进度条
                statusText: ['等待上传', '上传中...', '上传完'],
                totalSize: 0,
                totalSizeData: 0,
                aerialDate: ''
            }
        },
        methods: {
            doStart () {
                const that = this
                if (that.doCheck()) {
                    that.currAddAmount = 0
                    that.showProgressBar = true
                    setTimeout(() => { that.doRun(0) }, 300)
                }
            },
            // 按顺序执行处理
            doRun (index) {
                const that = this
                const store = that.$store
                if (index < that.images.length) {
                    const formData = new FormData()
                    const imgObj = that.images[index]
                    const fileBuffer = fs.readFileSync(imgObj.path)
                    const file = new File([fileBuffer], imgObj.fileName, { type: 'image/jpeg' })
                    formData.append('img', file)
                    imgObj.status = 1
                    that.$ajax({
                        method: 'post',
                        url: api.UPLOAD_ORIGIN_IMG,
                        headers: { 'Content-Type': 'multipart/form-data', 'task': that.taskId },
                        data: formData
                    }).then(res => {
                        if (res.code == 200) {
                            that.currAddAmount++
                            imgObj.status = 2
                            setTimeout(() => { that.doRun(index + 1) }, 300)
                        } else {
                            setTimeout(() => { that.doRun(index) }, 200)
                        }
                    })
                } else {
                    that.$ajax({
                        method: 'post',
                        url: api.UPDATE_ORIGIN_IMG,
                        data: {
                            id: that.taskId,
                            aerialDate: that.aerialDate,
                            imgTotalSize: that.totalSizeData,
                            imgTotalAmount: that.images.length
                        }
                    }).then(res => {
                        if (res.code == 200) {
                            that.doHideProgressBar()
                            setTimeout(() => {
                                store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: '图片上传完毕！' })
                                setTimeout(() => {
                                    that.doDialogClose()
                                    that.$emit('refresh')
                                }, 200)
                            }, 300)
                        } else {
                            setTimeout(() => {
                                store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: res.message || '图片上传出错！' })
                            }, 300)
                        }
                    })
                }
            },
            // 校验
            doCheck () {
                const that = this
                const type = types.SWITCH_MESSAGE_TIP_SYNC
                const store = that.$store
                if (!that.originImagePath) {
                    store.dispatch(type, { show: true, tip: '请选择待上传图片目录！' })
                    return false
                }
                if (!that.images.length) {
                    store.dispatch(type, { show: true, tip: '待上传图片数目为0！' })
                    return false
                }
                if (that.images[0].lat == '-' || that.images[0].lng == '-') {
                    store.dispatch(type, { show: true, tip: '待上传图片不存在经纬度信息，请先添加！' })
                    return false
                }
                return true
            },
            // 选择待上传图片目录
            doSelectOriginImagePath () {
                const that = this
                const objFiles = that.$refs.originImagePathObj.files
                if (objFiles && objFiles.length == 1) {
                    that.originImagePath = objFiles[0].path
                    that.images = []
                    that.$store.dispatch(types.SWITCH_LOADING_SYNC, true)
                    setTimeout(() => {
                        fs.readdir(that.originImagePath, (err, files) => {
                            if (err) {
                                console.log('doSelectOriginImagePath error...')
                            } else {
                                let fileName = ''
                                let imgPath = ''
                                let jpeg = null
                                let exifObj = null
                                let geoData = null
                                let imgObj = null
                                let latArr = null
                                let lngArr = null
                                let heightArr = null
                                let exitGps = true
                                let totalSize = 0
                                let fileSize = 0
                                for (let i = 0; i < files.length; i++) {
                                    fileName = files[i]
                                    if (/(jpeg|jpg)/i.test(fileName)) {
                                        imgObj = {}
                                        imgPath = path.join(that.originImagePath, fileName)
                                        jpeg = fs.readFileSync(imgPath)
                                        exifObj = piexif.load(jpeg.toString('binary'))
                                        geoData = exifObj['GPS']
                                        imgObj.fileName = fileName
                                        imgObj.path = imgPath
                                        imgObj.status = 0
                                        fileSize = fs.statSync(imgPath).size
                                        imgObj.fileSize = fromatFileSize(fileSize)
                                        totalSize += fileSize
                                        imgObj.photoTime = formatPhotoTime(exifObj['Exif']['36867'])
                                        imgObj.imgSize = exifObj['Exif']['40962'] + '*' + exifObj['Exif']['40963']
                                        if (!that.aerialDate) {
                                            that.aerialDate = imgObj.photoTime.split(' ')[0] + ' 00:00:00'
                                        }
                                        if (geoData[0] && geoData[2]) {
                                            latArr = geoData['2']
                                            lngArr = geoData['4']
                                            heightArr = geoData['6']
                                            imgObj.lat = (latArr[0][0] / latArr[0][1]) + (latArr[1][0] / latArr[1][1]) / 60 + (latArr[2][0] / latArr[2][1]) / 3600
                                            imgObj.lng = (lngArr[0][0] / lngArr[0][1]) + (lngArr[1][0] / lngArr[1][1]) / 60 + (lngArr[2][0] / lngArr[2][1]) / 3600
                                            imgObj.h = heightArr[0] / heightArr[1]
                                        } else {
                                            imgObj.lng = '-'
                                            imgObj.lat = '-'
                                            imgObj.h = '-'
                                            exitGps = false
                                        }
                                        that.images.push(imgObj)
                                    }
                                }
                                if (!exitGps) { // 图片不存在经纬度信息
                                    that.$store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: '图片不存在经纬度信息！' })
                                }
                                that.totalSizeData = totalSize
                                that.totalSize = fromatFileSize(totalSize)
                                that.$store.dispatch(types.SWITCH_LOADING_SYNC, false)
                            }
                        })
                    }, 300)
                }
            },
            // 关闭弹窗
            doDialogClose () {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_UPLOAD_ORIGIN_IMG_VISIBLE_SYNC, false)
            },
            // 关闭进度条
            doHideProgressBar () {
                this.showProgressBar = false
            }
        }
    }
</script>
