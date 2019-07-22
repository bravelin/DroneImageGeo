<template>
    <div class="page preview-tiles-page">
        <div class="panel-tools">
            <div class="left">
                <div class="tool-button file-button">选择谷歌地图瓦片目录<input type="file" ref="tilesPathObj" directory webkitdirectory @change="doSelectTilesPath()"/></div>
                <span>{{ tilesMapFilePath }}</span>
            </div>
        </div>
        <webview class="map-view" ref="view" :src="indexPath"></webview>
    </div>
</template>
<script>
    import types from '@/store/constants/types'

    const fs = require('fs')
    const path = require('path')
    const originStr = 'http://maps.google.com/maps/api/js?sensor=false'
    const distStr = 'http://maps.google.cn/maps/api/js?key=AIzaSyBS1p0Z2ibsrbtNsH6Co7ytQgL_ObYfs_E&libraries=places&language=zh-CN'
    export default {
        name: 'ToolsPreviewTiles',
        data () {
            return {
                tilesMapFilePath: '', // 目录
                indexPath: '' // 索引文件路径
            }
        },
        mounted () {
            const that = this
            that.doStopLoad()
            that.$nextTick(() => {
                const view = that.$refs.view
                view.addEventListener('did-start-loading', that.doStartLoad)
                view.addEventListener('did-stop-loading', that.doStopLoad)
            })
        },
        methods: {
            doSelectTilesPath () {
                const that = this
                const objFiles = that.$refs.tilesPathObj.files
                if (objFiles && objFiles.length == 1) {
                    that.tilesMapFilePath = objFiles[0].path
                    // console.log('tilesMapFilePath...', that.tilesMapFilePath)
                    fs.readdir(that.tilesMapFilePath, (err, files) => {
                        if (err) {
                            console.log('doSelectTilesPath error...')
                        } else {
                            let fileName = ''
                            let tag = false
                            for (let i = 0; i < files.length; i++) {
                                fileName = files[i]
                                if (/(.html|.htm)/.test(fileName)) {
                                    tag = true
                                    const indexPath = path.join(that.tilesMapFilePath, fileName)
                                    fs.readFile(indexPath, 'utf8', (err, file) => {
                                        console.log('err...', err)
                                        const result = file.replace(originStr, distStr)
                                        fs.writeFile(indexPath, result, 'utf8', (err) => {
                                            if (err) return console.log(err)
                                            that.indexPath = indexPath
                                        })
                                    })
                                    break
                                }
                            }
                            if (!tag) {
                                that.indexPath = ''
                                that.$store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: '未能找到页面索引文件！' })
                            }
                        }
                    })
                }
            },
            doStartLoad () {
                const store = this.$store
                store.dispatch(types.SWITCH_LOADING_SYNC, true)
                setTimeout(() => {
                    store.dispatch(types.SWITCH_LOADING_SYNC, false)
                }, 4000)
            },
            doStopLoad () {
                this.$store.dispatch(types.SWITCH_LOADING_SYNC, false)
            }
        },
        beforeDestroy () {
            const that = this
            const view = that.$refs.view
            view.removeEventListener('did-start-loading', that.doStartLoad)
            view.removeEventListener('did-stop-loading', that.doStopLoad)
        }
    }
</script>
<style lang="scss">
    @import '../../../style/views/toolsPreviewTiles.scss';
</style>