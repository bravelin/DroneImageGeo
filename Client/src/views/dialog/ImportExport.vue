<!--导入导出弹窗-->
<template>
    <Dialog title="导入导出" class="import-export-dialog" :show="importExportDialogShow" @close="doDialogClose()">
        <div class="dialog-condition-bar">
            <span>镇：</span>
            <DataSelector></DataSelector>
            <span>村：</span>
            <DataSelector></DataSelector>
            <input type="text" placeholder="请输入种植户名" maxlength="50"/>
            <div class="search-button">检索</div>
            <div class="import-button"></div>
        </div>
        <div class="dialog-table">
            <ul>
                <li>种植户名称</li>
                <li>手机</li>
                <li>镇</li>
                <li>村</li>
                <li>地址</li>
                <li>株数</li>
                <li>面积</li>
                <li>品种</li>
                <li>树龄</li>
                <li><YearSelector></YearSelector>产量</li>
            </ul>
            <ul v-for="(item, index) in dataList" :key="index">
                <li>{{ item.name }}</li>
                <li>{{ item.tel }}</li>
                <li>{{ item.town }}</li>
                <li>{{ item.village }}</li>
                <li>{{ item.address }}</li>
                <li>{{ item.plantCount }}</li>
                <li>{{ item.area }}</li>
                <li>{{ item.varities }}</li>
                <li>{{ item.age }}</li>
                <li>{{ item.product2015 }}</li>
            </ul>
        </div>
        <Pagination :total="totalPage" :curr="currPage"></Pagination>
    </Dialog>
</template>
<script>
    import { createNamespacedHelpers, mapState } from 'vuex'
    import ns from '@/store/constants/ns'
    import types from '@/store/constants/types'
    import YearSelector from '@/components/YearSelector'
    import Pagination from '@/components/Pagination'

    const moduleNameSpace = ns.DATA_MANAGE
    const thisMapState = createNamespacedHelpers(moduleNameSpace).mapState
    const showProp = 'importExportDialogShow'
    export default {
        name: 'ImportExport',
        components: {
            YearSelector, Pagination
        },
        computed: {
            ...thisMapState([showProp])
        },
        data () {
            return {
                totalPage: 19,
                currPage: 4,
                dataList: [
                    { name: '某某某', tel: '13025655220', town: '新星镇', village: '黄村', address: '', plantCount: '2258', area: '2255', varities: '高山', age: '10年', product2015: 2200, product2016: 3300, product2017: 4400 },
                    { name: '某某某', tel: '13025655220', town: '新星镇', village: '黄村', address: '', plantCount: '2258', area: '2255', varities: '高山', age: '10年', product2015: 2200, product2016: 3300, product2017: 4400 },
                    { name: '某某某', tel: '13025655220', town: '新星镇', village: '黄村', address: '', plantCount: '2258', area: '2255', varities: '高山', age: '10年', product2015: 2200, product2016: 3300, product2017: 4400 },
                    { name: '某某某', tel: '13025655220', town: '新星镇', village: '黄村', address: '', plantCount: '2258', area: '2255', varities: '高山', age: '10年', product2015: 2200, product2016: 3300, product2017: 4400 },
                    { name: '某某某', tel: '13025655220', town: '新星镇', village: '黄村', address: '', plantCount: '2258', area: '2255', varities: '高山', age: '10年', product2015: 2200, product2016: 3300, product2017: 4400 },
                    { name: '某某某', tel: '13025655220', town: '新星镇', village: '黄村', address: '', plantCount: '2258', area: '2255', varities: '高山', age: '10年', product2015: 2200, product2016: 3300, product2017: 4400 },
                    { name: '某某某', tel: '13025655220', town: '新星镇', village: '黄村', address: '', plantCount: '2258', area: '2255', varities: '高山', age: '10年', product2015: 2200, product2016: 3300, product2017: 4400 },
                    { name: '某某某', tel: '13025655220', town: '新星镇', village: '黄村', address: '', plantCount: '2258', area: '2255', varities: '高山', age: '10年', product2015: 2200, product2016: 3300, product2017: 4400 }
                ]
            }
        },
        methods: {
            doDialogClose () {
                this.$store.commit(moduleNameSpace + '/' + types.SWITCH_IMPORT_EXPORT_DIALOG_STATUS, false)
            }
        }
    }
</script>
