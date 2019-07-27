<!--预览瓦片图弹窗-->
<template>
    <Dialog :title="'预览瓦片图（任务ID：'+ taskId + '）'" class="view-tiles-dialog" :show="dialogVisible" @close="doDialogClose()">
        <div class="preview-content" ref="wrap"></div>
    </Dialog>
</template>
<script>
    import types from '@/store/constants/types'
    import ns from '@/store/constants/ns'
    import api from '@/lib/api'
    import config from '@/lib/config'

    const prop = `$store.state.${ns.TASKS}.viewTilesImgVisible`
    const maxZoom = 24
    const minZoom = 0
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
                map: null
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
                        if (that.map) { // 业已初始化
                            that.changeMap() // 切换成新区块的预览图
                        } else {
                            that.initMap()
                        }
                    } else {
                        store.dispatch(types.SWITCH_LOADING_SYNC, false)
                        store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: res.message || '获取任务详情失败！' })
                        setTimeout(() => { that.doDialogClose() }, 100)
                    }
                })
            },
            // 初始化地图
            initMap () {
                const that = this
                const mapCenterPoint = new google.maps.LatLng((that.minLat + that.maxLat) / 2, (that.minLng + that.maxLng) / 2)
                that.map = new google.maps.Map(that.$refs.wrap, {
                    center: mapCenterPoint,
                    zoom: 14,
                    maxZoom,
                    minZoom,
                    mapTypeId: 'hybrid',
                    gestureHandling: 'greedy',
                    keyboardShortcuts: false,
                    styles: [
                        {
                            elementType: 'labels.icon', // 将所有默认标记去除
                            stylers: [{ visibility: 'off' }]
                        }
                    ]
                })
                that.map.overlayMapTypes.insertAt(1, that.createOverlay())
            },
            // 切换地图
            changeMap () {
                const that = this
                const mapCenterPoint = new google.maps.LatLng((that.minLat + that.maxLat) / 2, (that.minLng + that.maxLng) / 2)
                that.map.setCenter(mapCenterPoint)
                that.map.overlayMapTypes.removeAt(1)
                that.map.overlayMapTypes.insertAt(1, that.createOverlay())
            },
            // 创建图层
            createOverlay () {
                const that = this
                const map = that.map
                const bounds = [that.minLat, that.minLng, that.maxLat, that.maxLng]
                const mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(bounds[0], bounds[1]), new google.maps.LatLng(bounds[2], bounds[3]))
                map.fitBounds(mapBounds)
                return new google.maps.ImageMapType({
                    getTileUrl (coord, zoom) {
                        console.log('zoom...', zoom)
                        const proj = map.getProjection()
                        const tileSize = 256 / Math.pow(2, zoom)
                        const tileBounds = new google.maps.LatLngBounds(proj.fromPointToLatLng(new google.maps.Point(coord.x * tileSize, (coord.y + 1) * tileSize)), proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * tileSize, coord.y * tileSize)))
                        if (mapBounds.intersects(tileBounds) && (zoom >= minZoom) && (zoom <= maxZoom)) {
                            return config.baseUrl + '/api/google/tile/' + zoom + '/' + coord.x + '/' + (Math.pow(2, zoom) - coord.y - 1) + '.png'
                        }
                    },
                    tileSize: new google.maps.Size(256, 256),
                    isPng: true,
                    opacity: 1
                })
            },
            // 关闭弹窗
            doDialogClose () {
                this.$store.dispatch(ns.TASKS + '/' + types.TASKS_SWITCH_VIEW_TILES_IMG_VISIBLE_SYNC, false)
            }
        }
    }
</script>
