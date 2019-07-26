<!--上传瓦片图弹窗-->
<template>
    <Dialog :title="'上传瓦片（任务ID：'+ taskId + '）'" class="upload-image-dialog" :show="dialogVisible" @close="doDialogClose()">
        <div class="panel-tools">
            <div class="left">
                <div class="tool-button file-button">选择待上传瓦片图目录<input type="file" ref="tilesImagePathObj" directory webkitdirectory @change="doSelectTilesImagePath()"/></div>
                <span>{{ tilesImagePath }}</span>
                <span v-show="images.length">{{ images.length }}张图片，{{ totalSize }}</span>
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
        <ProgressBar tip="请稍候，正在上传" :curr="currAddAmount" :total="images.length" :show="showProgressBar" @close="doHideProgressBar()"></ProgressBar>
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
                totalSizeData: 0
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
                        url: api.UPLOAD_TILES_IMG,
                        headers: { 'Content-Type': 'multipart/form-data' },
                        params: {
                            task: that.taskId,
                            lng: imgObj.lng,
                            lat: imgObj.lat,
                            alt: imgObj.h,
                            photo: encodeURIComponent(imgObj.photoTime),
                            size: imgObj.fileSizeData,
                            w: imgObj.width,
                            h: imgObj.height
                        },
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
                        url: api.UPDATE_TILES_IMG,
                        data: {
                            id: that.taskId,
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
                if (!that.tilesImagePath) {
                    store.dispatch(type, { show: true, tip: '请选择待上传瓦片图目录！' })
                    return false
                }
                if (!that.images.length) {
                    store.dispatch(type, { show: true, tip: '待上传瓦片图数目为0！' })
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
                    // that.$store.dispatch(types.SWITCH_LOADING_SYNC, true)
                    setTimeout(() => {
                        that.readDirs()
                        // that.scaneTileImg(that.tilesImagePath)
                        // that.$store.dispatch(types.SWITCH_LOADING_SYNC, false)
                    }, 300)
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
                        files.forEach(fileName => {
                            if (Number.isInteger(fileName - 0)) {
                                currPath = path.join(tilesImagePath, fileName)
                                dirs = fs.readdirSync(currPath)
                                dirs.forEach(dir => {
                                    imageDirs.push(path.join(currPath, dir))
                                })
                            }
                        })
                        that.readTileFiles(imageDirs, 0)
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
                    let imgObj = null
                    fs.readdir(thisPath, (err, files) => {
                        console.log(err)
                        files.forEach(fileName => {
                            if (/png/i.test(fileName)) {
                                filePath = path.join(thisPath, fileName)
                                stats = fs.statSync(filePath)
                                tileInfos = filePath.split('\\').slice(-3)
                                if (tileInfos.length == 3) {
                                    that.totalSizeData += stats.size
                                    that.images.push({
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
                                    console.log(that.images.length)
                                }
                            }
                        })
                        setTimeout(() => {
                            that.readTileFiles(imageDirs, index + 1)
                        }, 400)
                    })
                } else {
                    console.log('readTileFiles over......')
                }
            },
            // 遍历文件夹
            scaneTileImg (filePath) {
                const that = this
                fs.readdir(filePath, (err, files) => {
                    if (err) {
                        console.warn(err)
                    } else {
                        files.forEach(fileName => {
                            const fileDir = path.join(filePath, fileName)
                            fs.stat(fileDir, (err, stats) => {
                                if (err) {
                                    console.warn(err)
                                } else {
                                    const isFile = stats.isFile()
                                    const isDir = stats.isDirectory()
                                    if (isFile) {
                                        if (/png/i.test(fileDir)) {
                                            const tileInfos = fileDir.split('\\').slice(-3)
                                            if (tileInfos.length == 3) {
                                                that.totalSizeData += stats.size
                                                const imgObj = {
                                                    size: fromatFileSize(stats.size),
                                                    z: tileInfos[0] - 0,
                                                    x: tileInfos[1] - 0,
                                                    y: tileInfos[2].slice(0, -4) - 0,
                                                    name: tileInfos[2],
                                                    w: 256,
                                                    h: 256,
                                                    path: fileDir,
                                                    status: 0
                                                }
                                                that.images.push(imgObj)
                                                console.log(that.images.length)
                                            }
                                        }
                                    } else if (isDir) {
                                        setTimeout(() => {
                                            that.scaneTileImg(fileDir)
                                        }, 300)
                                    }
                                }
                            })
                        })
                    }
                })
            },
            // 关闭弹窗
            doDialogClose () {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_UPLOAD_TILES_IMG_VISIBLE_SYNC, false)
            },
            // 关闭进度条
            doHideProgressBar () {
                this.showProgressBar = false
            }
        }
    }
</script>
