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
                    console.log('tilesMapFilePath...', that.tilesMapFilePath)
                    fs.readdir(that.tilesMapFilePath, (err, files) => {
                        if (err) {
                            console.log('doSelectTilesPath error...')
                        } else {
                            let fileName = ''
                            let tag = false
                            for (let i = 0; i < files.length; i++) {
                                fileName = files[i]
                                if (/.html/.test(fileName)) {
                                    tag = true
                                    console.log('fileName...', fileName)
                                    that.indexPath = path.join(that.tilesMapFilePath, fileName)
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