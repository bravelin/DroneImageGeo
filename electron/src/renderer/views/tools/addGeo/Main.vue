<!--添加经纬度-->
<template>
    <div class="page add-geo-page">
        <div class="panel-tools">
            <div class="left">
                <div class="tool-button file-button" :class="{ disabled: currStatus==1 }">1.选择待处理图片目录<input type="file" ref="originImagePathObj" directory webkitdirectory @change="doSelectOriginImagePath()"/></div>
                <div class="tool-button file-button" :class="{ disabled: currStatus==1 }">2.选择地理坐标信息文本文件<input type="file" multiple="false" accept="text/plain" ref="geoTextFileObj" @change="doSelectGeoTextFile()"/></div>
                <div class="tool-button file-button" :class="{ disabled: currStatus==1 }">3.选择处理完图片存放目录<input type="file" ref="distImagePathObj" directory webkitdirectory @change="doSelectDistImagePath()"/></div>
                <div class="check-button" :class="{ active: needRectify, disabled: currStatus==1 }" @click="doSwitchNeedRectify()">
                    <i class="iconfont">&#xe686;</i>
                    <i class="iconfont">&#xe685;</i>
                    <span>处理中进行经纬度纠偏</span>
                </div>
            </div>
            <div class="right">
                <div class="tool-button" @click="doStart()" v-show="currStatus==0">开始处理</div>
                <div class="tool-button" @click="doReset()" v-show="currStatus==1">重置</div>
            </div>
        </div>
        <ul class="info-list">
            <li><label>待处理图片目录：</label><span>{{ originImagePath }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="spec" v-show="images.length">（总共：<em>{{ images.length }}</em>张图片）</span></li>
            <li><label>地理坐标信息文本文件：</label><span>{{ geoTextFilePath }}</span></li>
            <li><label>处理完图片存放目录：</label><span>{{ distImagePath }}</span></li>
        </ul>
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
        <ProgressBar :curr="currAddAmount" :total="images.length" :show="showProgressBar" @close="doHideProgressBar()"></ProgressBar>
    </div>
</template>
<script>
    import types from '@/store/constants/types'
    import api from '@/lib/api'
    import { formatTime, fromatFileSize, formatPhotoTime, convertGeoNum } from '@/lib/util'

    const readline = require('readline')
    const fs = require('fs')
    const path = require('path')
    const piexif = require('piexifjs')

    export default {
        name: 'ToolsAddGeo',
        data () {
            return {
                currStatus: 0, // 还未处理，1--已处理完成
                currAddAmount: 0, // 当前已处理的数目
                showProgressBar: false, // 是否显示进度条
                needRectify: true, // 默认进行纠偏
                originImagePath: '', // 待处理图片目录
                geoTextFilePath: '', // 地理坐标信息文本文件
                distImagePath: '', // 处理完图片存放目录
                statusText: ['待处理', '处理中...', '处理完'],
                geoDataList: [], // 读取的geo data
                images: [
                    // {
                    //     fileName: 'DSC00129.JPG', // 文件名
                    //     photoTime: '2019-07-11 12:30:12',
                    //     fileSize: '12M', // 文件大小
                    //     imgSize: '1200*900', // 图片尺寸
                    //     lng: 113.12, // 经度
                    //     lat: 24.333, // 纬度
                    //     h: 100, // 高度
                    //     status: 2 // 状态 0-待处理   1-处理中   2-已处理
                    // }
                ]
            }
        },
        created () {
            this.$store.dispatch(types.SWITCH_LOADING_SYNC, false)
        },
        methods: {
            // 启动处理
            doStart () {
                const that = this
                if (that.doCheck()) {
                    that.currAddAmount = 0
                    that.showProgressBar = true
                    fs.mkdirSync(that.distImagePath) // 创建目录
                    that.doRun(0)
                }
            },
            // 递归执行处理
            doRun (index) {
                const that = this
                if (index < that.images.length) {
                    const imgObj = that.images[index]
                    imgObj.status = 1
                    const geoData = that.geoDataList[index]
                    if (that.needRectify) { // 需要纠偏
                        that.$ajax({
                            url: api.GET_RECTIFY_LATLNG,
                            params: { lat: geoData.lat, lng: geoData.lng }
                        }).then(res => {
                            if (res.code == 200 && res.data.lat) {
                                const { lat, lng } = res.data
                                // console.log('success...', lat, lng)
                                that.writeGeoDataIntoImg(imgObj, { lat, lng, height: geoData.height }, index)
                            } else {
                                console.log('request rectify error....', res)
                                // 出错，500毫秒之后重试
                                setTimeout(() => { that.doRun(index) }, 500)
                            }
                        })
                    } else {
                        that.writeGeoDataIntoImg(imgObj, geoData, index)
                    }
                }
            },
            // 将经纬度信息写入到新生成的图片中
            writeGeoDataIntoImg (imgObj, geo, index) {
                const that = this
                const fileName = imgObj.fileName
                const jpeg = fs.readFileSync(imgObj.path)
                const imageData = jpeg.toString('binary')
                const exifObj = piexif.load(imageData)
                const geoData = exifObj['GPS']
                const convertLatObj = convertGeoNum(geo.lat)
                const convertLngObj = convertGeoNum(geo.lng)
                if (geoData && geoData['2']) { // 已存在经纬度信息
                    // 修正经纬度GeoData
                    geoData['2'][0][0] = convertLatObj.deg
                    geoData['2'][1][0] = convertLatObj.min
                    geoData['2'][2][0] = convertLatObj.sec

                    geoData['4'][0][0] = convertLngObj.deg
                    geoData['4'][1][0] = convertLngObj.min
                    geoData['4'][2][0] = convertLngObj.sec
                } else {
                    // 填充经纬度GeoData
                    geoData['0'] = [2, 3, 0, 0]
                    geoData['1'] = ['N']
                    geoData['2'] = [[0, 1], [0, 1], [0, 10000]]
                    geoData['2'][0][0] = convertLatObj.deg
                    geoData['2'][1][0] = convertLatObj.min
                    geoData['2'][2][0] = convertLatObj.sec
                    geoData['3'] = ['E']
                    geoData['4'] = [[0, 1], [0, 1], [0, 10000]]
                    geoData['4'][0][0] = convertLngObj.deg
                    geoData['4'][1][0] = convertLngObj.min
                    geoData['4'][2][0] = convertLngObj.sec
                    geoData['5'] = 0
                    geoData['6'] = [geo.height * 1000, 1000]
                }
                // 写入新文件中
                const exifBytes = piexif.dump(exifObj)
                const newData = piexif.insert(exifBytes, imageData)
                const newJpeg = Buffer.from(newData, 'binary')
                fs.writeFileSync(that.distImagePath + fileName, newJpeg)
                imgObj.status = 2
                imgObj.lat = geo.lat
                imgObj.lng = geo.lng
                imgObj.h = geo.height
                that.currAddAmount++
                if (that.currAddAmount < that.images.length) {
                    setTimeout(() => { that.doRun(index + 1) }, 300)
                } else {
                    that.doHideProgressBar()
                    that.currStatus = 1
                    setTimeout(() => {
                        that.$store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: '图片处理完毕！' })
                        that.$electron.shell.openExternal(that.distImagePath)
                    }, 500)
                }
            },
            // 检查1,2,3步骤是否执行
            doCheck () {
                const that = this
                const type = types.SWITCH_MESSAGE_TIP_SYNC
                if (!that.originImagePath) {
                    that.$store.dispatch(type, { show: true, tip: '请选择待处理图片目录！' })
                    return false
                }
                if (!that.images.length) {
                    that.$store.dispatch(type, { show: true, tip: '待处理图片数目为0！' })
                    return false
                }
                if (!that.geoTextFilePath) {
                    that.$store.dispatch(type, { show: true, tip: '请选择地理坐标信息文本文件！' })
                    return false
                }
                if (!that.geoDataList.length) {
                    that.$store.dispatch(type, { show: true, tip: '未能成功读取地理坐标信息！' })
                    return false
                }
                if (that.geoDataList.length != that.images.length) {
                    that.$store.dispatch(type, { show: true, tip: '待处理图片数目与地理坐标数目不一致！' })
                    return false
                }
                if (!that.distImagePath) {
                    that.$store.dispatch(type, { show: true, tip: '请选择处理完图片存放目录！' })
                    return false
                }
                return true
            },
            // 选择待处理图片目录
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
                                let exitGps = false
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
                                        imgObj.fileSize = fromatFileSize(fs.statSync(imgPath).size)
                                        imgObj.photoTime = formatPhotoTime(exifObj['Exif']['36867'])
                                        imgObj.imgSize = exifObj['Exif']['40962'] + '*' + exifObj['Exif']['40963']
                                        if (geoData[0] && geoData[2]) {
                                            latArr = geoData['2']
                                            lngArr = geoData['4']
                                            heightArr = geoData['6']
                                            imgObj.lat = (latArr[0][0] / latArr[0][1]) + (latArr[1][0] / latArr[1][1]) / 60 + (latArr[2][0] / latArr[2][1]) / 3600
                                            imgObj.lng = (lngArr[0][0] / lngArr[0][1]) + (lngArr[1][0] / lngArr[1][1]) / 60 + (lngArr[2][0] / lngArr[2][1]) / 3600
                                            imgObj.h = heightArr[0] / heightArr[1]
                                            exitGps = true
                                        } else {
                                            imgObj.lng = '-'
                                            imgObj.lat = '-'
                                            imgObj.h = '-'
                                        }
                                        that.images.push(imgObj)
                                    }
                                }
                                if (exitGps) { // 图片已经存在经纬度信息
                                    that.$store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: '图片已经存在经纬度信息！' })
                                }
                                that.$store.dispatch(types.SWITCH_LOADING_SYNC, false)
                                // 判定与geoDataList数目是否一致
                                that.doCheckAmount()
                            }
                        })
                    }, 300)
                }
            },
            // 选择地理坐标信息文本文件
            doSelectGeoTextFile () {
                const that = this
                const files = that.$refs.geoTextFileObj.files
                if (files && files.length == 1) {
                    that.geoTextFilePath = files[0].path
                    that.geoDataList = []
                    // 读取此文件
                    const rl = readline.createInterface({ input: fs.createReadStream(that.geoTextFilePath) })
                    let tempArr = null
                    rl.on('line', (line) => {
                        tempArr = line.split(' ')
                        if (tempArr.length >= 4) {
                            that.geoDataList.push({ lng: tempArr[1] - 0, lat: tempArr[2] - 0, height: tempArr[3] - 0 })
                        }
                    })
                    setTimeout(() => { that.doCheckAmount() }, 3000)
                }
            },
            // 选择处理完图片存放目录
            doSelectDistImagePath () {
                const that = this
                const files = that.$refs.distImagePathObj.files
                if (files && files.length == 1) {
                    that.distImagePath = files[0].path + '\\' + formatTime(new Date(), 'yyyyMMddhhmmss') + '\\'
                }
            },
            // 判定数目是否一致
            doCheckAmount () {
                const that = this
                if (that.geoDataList.length && that.images.length && that.images.length != that.geoDataList.length) {
                    that.$store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: '待处理图片数目与地理坐标数目不一致！' })
                }
            },
            doSwitchNeedRectify () {
                const that = this
                if (that.currStatus == 0) {
                    that.needRectify = !that.needRectify
                }
            },
            // 关闭进度条
            doHideProgressBar () {
                this.showProgressBar = false
            },
            // 重置
            doReset () {
                const that = this
                that.currStatus = 0
                that.images = []
                that.geoDataList = []
                that.currAddAmount = 0
                that.showProgressBar = false
                that.needRectify = true
                that.originImagePath = ''
                that.geoTextFilePath = ''
                that.distImagePath = ''
                const refs = that.$refs
                refs.originImagePathObj.value = ''
                refs.geoTextFileObj.value = ''
                refs.distImagePathObj.value = ''
            }
        }
    }
</script>
<style lang="scss">
    @import '../../../style/views/toolsAddGeo.scss';
</style>