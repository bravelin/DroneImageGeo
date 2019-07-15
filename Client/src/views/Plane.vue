<!--主页左侧的面板-->
<template>
    <div class="left-plane-container">
        <!--头部tabs-->
        <MainTabs></MainTabs>
        <!--果林信息-->
        <GardenInfo v-show="leftPlaneTab==tabTypes.GardenInfo"></GardenInfo>
        <!--数据管理-->
        <DataManage v-show="leftPlaneTab==tabTypes.DataManage"></DataManage>
        <!--搜索-->
        <Search v-show="leftPlaneTab==tabTypes.Search || leftPlaneTab==''"></Search>
        <!--底部比例尺和当前经纬度-->
        <GeoInfo></GeoInfo>
        <!--切换plane展开或者收起-->
        <SwitchButton></SwitchButton>
    </div>
</template>
<script>
    import MainTabs from '@/views/plane/MainTabs'
    import GardenInfo from '@/views/gardenInfo/Main'
    import DataManage from '@/views/dataManage/Main'
    import Search from '@/views/search/Main'
    import SwitchButton from '@/views/plane/SwitchButton'
    import GeoInfo from '@/views/plane/GeoInfo'
    import { mapState } from 'vuex'
    import TabTypes from '@/views/tabs'

    export default {
        name: 'LeftPlaneContainer',
        components: {
            MainTabs, GardenInfo, GeoInfo, SwitchButton, DataManage, Search
        },
        computed: {
            ...mapState(['leftPlaneTab'])
        },
        data () {
            return {
                tabTypes: TabTypes
            }
        }
    }
</script>
