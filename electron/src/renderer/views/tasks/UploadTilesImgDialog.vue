<!--上传瓦片图弹窗-->
<template>
    <Dialog :title="'上传瓦片（任务ID：'+ taskId + '）'" class="upload-image-dialog" :show="dialogVisible" @close="doDialogClose()">
        <div class="panel-tools">
            <div class="left">
                <div class="tool-button file-button">选择待上传瓦片图目录<input type="file" ref="tilesImagePathObj" directory webkitdirectory @change="doSelectTilesImagePath()"/></div>
                <span>{{ tilesImagePath }}</span>
                <span v-show="images.length">{{ images.length }}张图片，{{ totalSize }}（{{ minZoom }} ~ {{ maxZoom }}）</span>
                <span class="orange" v-if="bounds.length==4">边界：[{{ bounds[0] }},{{ bounds[1] }},{{ bounds[2] }},{{ bounds[3] }}]</span>
            </div>
            <div class="right">
                <div class="tool-button" @click="doStart()">开始上传</div>
            </div>
        </div>
        <div class="list-wrap" v-show="images.length">
            <div class="data-table">
                <ul>
                    <li>文件</li>
                    <li>文件大小</li>
                    <li>图片尺寸</li>
                    <li>x</li>
                    <li>y</li>
                    <li>z</li>
                    <li>状态</li>
                </ul>
                <ul v-for="(img,index) in images" :key="index">
                    <li>{{ img.path }}</li>
                    <li>{{ img.size }}</li>
                    <li>{{ img.w }} * {{ img.h }}</li>
                    <li>{{ img.x }}</li>
                    <li>{{ img.y }}</li>
                    <li>{{ img.z }}</li>
                    <li :class="'status-'+img.status">{{ statusText[img.status] }}</li>
                </ul>
            </div>
        </div>
        <div v-show="images.length==0" class="null-list"></div>
        <ProgressBar tip="请稍候，正在读取瓦片信息" :curr="currReadImageDir" :total="imageDirsAmount" :show="showReadProgressBar" @close="doHideProgressBar(1)"></ProgressBar>
        <ProgressBar tip="请稍候，正在上传" :curr="currAddAmount" :total="images.length" :show="showProgressBar" @close="doHideProgressBar(0)"></ProgressBar>
    </Dialog>
</template>
<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import api from '@/lib/api'
    import { fromatFileSize } from '@/lib/util'

    const fs = require('fs')
    const path = require('path')
    const prop = `$store.state.${ns.TASKS}.uploadTilesImgVisible`

    export default {
        name: 'UploadTilesImgDialog',
        computed: {
            dialogVisible () {
                return this.$store.state[ns.TASKS].uploadTilesImgVisible
            },
            taskId () {
                return this.$store.state[ns.TASKS].uploadTilesImgVisibleTaskId
            },
            totalSize () {
                return fromatFileSize(this.totalSizeData)
            }
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    const that = this
                    that.images = []
                    that.tilesImagePath = ''
                    that.currAddAmount = 0
                    that.showProgressBar = false
                    that.totalSizeData = 0
                    that.imageDirsAmount = 0
                    that.currReadImageDir = 0
                    that.showReadProgressBar = false
                    that.bounds = []
                    const fileObj = that.$refs.tilesImagePathObj
                    if (fileObj) {
                        fileObj.value = ''
                    }
                }
            }
        },
        data () {
            return {
                images: [],
                tilesImagePath: '', // 待上传图片目录
                currAddAmount: 0, // 当前已处理的数目
                showProgressBar: false, // 是否显示进度条
                statusText: ['等待上传', '上传中...', '上传完'],
                totalSizeData: 0,
                showReadProgressBar: false, // 读取文件夹进度条
                imageDirsAmount: 0, // 文件夹总数
                currReadImageDir: 0, // 当前已读取的文件夹数目
                bounds: [], // 边界经纬度
                minZoom: 100, // 最小级别
                maxZoom: 0 // 最大级别
            }
        },
        methods: {
            // 启动上传
            doStart () {
                const that = this
                if (that.doCheck()) {
                    that.currAddAmount = 0
                    that.showProgressBar = true
                    setTimeout(() => { that.doRun(0) }, 300)
                }
            },
            // 按顺序执行，依次上传
            doRun (index) {
                const that = this
                const store = that.$store
                if (index < that.images.length) {
                    const formData = new FormData()
                    const imgObj = that.images[index]
                    const fileBuffer = fs.readFileSync(imgObj.path)
                    const file = new File([fileBuffer], imgObj.fileName, { type: 'image/png' })
                    formData.append('img', file)
                    imgObj.status = 1
                    that.$ajax({
                        method: 'post',
                        url: api.UPLOAD_TILES_IMG,
                        headers: { 'Content-Type': 'multipart/form-data' },
                        params: {
                            task: that.taskId,
                            size: imgObj.sizeData,
                            x: imgObj.x,
                            y: imgObj.y,
                            z: imgObj.z,
                            w: imgObj.w || 256,
                            h: imgObj.h || 256
                        },
                        data: formData
                    }).then(res => {
                        if (res.code == 200) {
                            that.currAddAmount++
                            imgObj.status = 2
                            setTimeout(() => { that.doRun(index + 1) }, 100)
                        } else {
                            setTimeout(() => { that.doRun(index) }, 100)
                        }
                    })
                } else {
                    that.$ajax({
                        method: 'post',
                        url: api.UPDATE_TILES_IMG,
                        data: {
                            id: that.taskId,
                            tilesAmount: that.images.length,
                            tilesSize: that.totalSizeData,
                            tilesPath: that.tilesImagePath,
                            minLat: that.bounds[0],
                            minLng: that.bounds[1],
                            maxLat: that.bounds[2],
                            maxLng: that.bounds[3],
                            minZoom: that.minZoom,
                            maxZoom: that.maxZoom
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
                if (!that.tilesImagePath) {
                    store.dispatch(type, { show: true, tip: '请选择待上传瓦片图目录！' })
                    return false
                }
                if (!that.images.length) {
                    store.dispatch(type, { show: true, tip: '待上传瓦片图数目为0！' })
                    return false
                }
                if (!that.bounds.length) {
                    store.dispatch(type, { show: true, tip: '没有瓦片边界经纬度信息！' })
                    return false
                }
                return true
            },
            // 选择待上传图片目录
            doSelectTilesImagePath () {
                const that = this
                const objFiles = that.$refs.tilesImagePathObj.files
                if (objFiles && objFiles.length == 1) {
                    that.tilesImagePath = objFiles[0].path
                    that.images = []
                    that.totalSizeData = 0
                    that.$store.dispatch(types.SWITCH_LOADING_SYNC, true)
                    setTimeout(() => { that.readDirs() }, 300)
                }
            },
            // 预先读取所有文件夹
            readDirs () {
                const that = this
                const tilesImagePath = that.tilesImagePath
                let dirs = null
                const imageDirs = []
                fs.readdir(tilesImagePath, (err, files) => {
                    if (err) {
                        console.warn(err)
                    } else {
                        let currPath = ''
                        let zoom = 0
                        files.forEach(fileName => {
                            if (Number.isInteger(fileName - 0)) {
                                zoom = fileName - 0
                                if (zoom < that.minZoom) { that.minZoom = zoom }
                                if (zoom > that.maxZoom) { that.maxZoom = zoom }
                                currPath = path.join(tilesImagePath, fileName)
                                dirs = fs.readdirSync(currPath)
                                dirs.forEach(dir => { imageDirs.push(path.join(currPath, dir)) })
                            } else if (fileName.endsWith('.html')) { // 读取边距信息
                                const indexPath = path.join(tilesImagePath, fileName)
                                fs.readFile(indexPath, 'utf8', (err, fileData) => {
                                    if (err) {
                                        console.log('err...', err)
                                    } else {
                                        const searchReg = /new google.maps.LatLng\((.+?)\)/g
                                        const searchRes = fileData.match(searchReg)
                                        const reg = /\((.+?)\)/g
                                        const bounds = []
                                        let tempArr = null
                                        let arr = null
                                        searchRes.forEach(str => {
                                            tempArr = str.match(reg)
                                            if (tempArr[0]) {
                                                arr = tempArr[0].slice(1, -1).split(',')
                                                arr.forEach(num => { bounds.push(num.trim() - 0) })
                                            }
                                        })
                                        that.bounds = bounds
                                    }
                                })
                            }
                        })
                        setTimeout(() => {
                            that.$store.dispatch(types.SWITCH_LOADING_SYNC, false)
                            if (that.bounds.length == 4) { // 弹出进度条，依次读取每个目录
                                that.imageDirsAmount = imageDirs.length
                                that.currReadImageDir = 0
                                that.showReadProgressBar = true
                                setTimeout(() => { that.readTileFiles(imageDirs, 0) }, 200)
                            } else { // 没有边界信息，可能目录选择不对
                                that.$store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: '没有边界经纬度，请选择正确的瓦片目录！' })
                            }
                        }, 1000)
                    }
                })
            },
            // 依次读取每个文件夹
            readTileFiles (imageDirs, index) {
                const that = this
                if (index < imageDirs.length) {
                    const thisPath = imageDirs[index]
                    let stats = null
                    let filePath = ''
                    let tileInfos = null
                    fs.readdir(thisPath, (err, files) => {
                        if (err) {
                            console.log(err)
                        } else {
                            files.forEach(fileName => {
                                if (/png/i.test(fileName)) {
                                    filePath = path.join(thisPath, fileName)
                                    stats = fs.statSync(filePath)
                                    tileInfos = filePath.split('\\').slice(-3)
                                    if (tileInfos.length == 3) {
                                        that.totalSizeData += stats.size
                                        that.images.push({
                                            fileName,
                                            sizeData: stats.size,
                                            size: fromatFileSize(stats.size),
                                            z: tileInfos[0] - 0,
                                            x: tileInfos[1] - 0,
                                            y: tileInfos[2].slice(0, -4) - 0,
                                            name: tileInfos[2],
                                            w: 256,
                                            h: 256,
                                            path: filePath,
                                            status: 0
                                        })
                                    }
                                }
                            })
                            setTimeout(() => {
                                that.currReadImageDir++
                                that.readTileFiles(imageDirs, index + 1)
                            }, 100)
                        }
                    })
                } else {
                    that.doHideProgressBar(1)
                }
            },
            // 关闭弹窗
            doDialogClose () {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_UPLOAD_TILES_IMG_VISIBLE_SYNC, false)
            },
            // 关闭进度条
            doHideProgressBar (tag) {
                if (tag == 1) {
                    this.showReadProgressBar = false
                } else {
                    this.showProgressBar = false
                }
            }
        }
    }
</script>
