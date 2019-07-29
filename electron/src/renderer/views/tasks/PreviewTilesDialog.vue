<!--预览瓦片图弹窗-->
<template>
    <Dialog :title="'预览瓦片图（任务ID：'+ taskId + '）'" class="view-tiles-dialog" :show="dialogVisible" @close="doDialogClose()">
        <div class="preview-content" ref="wrap" id="map-container"></div>
    </Dialog>
</template>
<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import api from '@/lib/api'
    import config from '@/lib/config'

    const prop = `$store.state.${ns.TASKS}.viewTilesImgVisible`
    export default {
        name: 'PreviewDialog',
        computed: {
            dialogVisible () {
                return this.$store.state[ns.TASKS].viewTilesImgVisible
            },
            taskId () {
                return this.$store.state[ns.TASKS].viewTilesImgVisibleTaskId
            }
        },
        data () {
            return {
                minLat: 0,
                minLng: 0,
                maxLat: 0,
                maxLng: 0,
                maxZoom: 22,
                minZoom: 1,
                map: null,
                currLayer: null
            }
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    const that = this
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
                        that.minLat = resData.minLat - 0
                        that.minLng = resData.minLng - 0
                        that.maxLat = resData.maxLat - 0
                        that.maxLng = resData.maxLng - 0
                        that.minZoom = resData.minZoom - 0
                        that.maxZoom = resData.maxZoom - 0
                        if (that.map) { // 业已初始化
                            that.changeMap() // 切换成新区块的预览图
                        } else {
                            that.initMap()
                        }
                    } else {
                        store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: res.message || '获取任务详情失败！' })
                        setTimeout(() => { that.doDialogClose() }, 100)
                    }
                    store.dispatch(types.SWITCH_LOADING_SYNC, false)
                })
            },
            // 初始化地图
            initMap () {
                const that = this
                const minZoom = that.minZoom
                const maxZoom = that.maxZoom
                const map = L.map('map-container', {
                    scrollWheelZoom: true,
                    positionControl: true,
                    zoomControl: false
                })
                const bgLayerOption = {
                    attribution: 'Map data: &copy; Google Maps',
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                    maxZoom,
                    minZoom,
                    label: 'Google Maps Hybrid'
                }
                const labelLayerOption = {
                    attribution: 'Map data: &copy; Google Maps',
                    maxZoom,
                    minZoom,
                    label: 'Google Maps Label'
                }
                const bgLayer = L.tileLayer(`http://{s}.google.cn/maps/vt?lyrs=s%40845&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}`, bgLayerOption)
                const labelLayer = L.tileLayer(`http://www.google.cn/maps/vt?lyrs=h@189&gl=cn&x={x}&y={y}&z={z}`, labelLayerOption) // 标签层
                bgLayer.addTo(map)
                labelLayer.addTo(map)
                that.map = map
                that.createOverlay()
            },
            // 切换地图
            changeMap () {
                const that = this
                const layer = that.currLayer
                that.map.removeLayer(layer)
                that.createOverlay()
            },
            // 创建图层
            createOverlay () {
                const that = this
                const minZoom = that.minZoom
                const maxZoom = that.maxZoom
                const map = that.map
                const bounds = L.latLngBounds([[that.minLat, that.minLng], [that.maxLat, that.maxLng]])
                const url = `${config.baseUrl}/api/google/tile/{z}/{x}/{y}`
                let mapBounds = L.latLngBounds()
                mapBounds.extend(bounds)
                const layer = L.tileLayer(url, {
                    bounds,
                    minZoom,
                    maxZoom: L.Browser.retina ? (maxZoom + 1) : maxZoom,
                    maxNativeZoom: L.Browser.retina ? (maxZoom - 1) : maxZoom,
                    tms: true,
                    opacity: 1,
                    detectRetina: true
                })
                map.addLayer(layer)
                map.fitBounds(mapBounds)
                that.currLayer = layer
            },
            // 关闭弹窗
            doDialogClose () {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_VIEW_TILES_IMG_VISIBLE_SYNC, false)
            }
        }
    }
</script>
