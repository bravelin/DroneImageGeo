<!--果园数据编辑弹窗-->
<template>
    <Dialog title="果园信息" class="garden-info-dialog" :show="gardenInfoDialogShow" @close="doDialogClose()">
        <div class="input-wrap">
            <div class="input-item">
                <label>镇：</label>
                <DataSelector></DataSelector>
            </div>
            <div class="input-item">
                <label>村：</label>
                <DataSelector></DataSelector>
            </div>
            <div class="input-item">
                <label>树龄：</label>
                <input type="text" placeholder="果树种植年限，格式如：2017" maxlength="5"/>
            </div>
            <div class="input-item">
                <label>地址：</label>
                <input type="text" maxlength="200"/>
            </div>
            <div class="input-item">
                <label>品种：</label>
                <input type="text" maxlength="50"/>
            </div>
            <div class="input-item">
                <label>株数：</label>
                <input type="text" maxlength="10"/>
            </div>
            <div class="input-item">
                <label>种植户名称：</label>
                <input type="text" maxlength="50"/>
            </div>
            <div class="input-item">
                <label>种植户电话：</label>
                <input type="text" maxlength="11"/>
            </div>
            <div class="input-item">
                <label>果技员：</label>
                <input type="text" maxlength="50"/>
            </div>
            <div class="input-item">
                <label>管理情况：</label>
                <input type="text" maxlength="500"/>
            </div>
            <div class="input-item">
                <label>果业局统计株数：</label>
                <input type="text" maxlength="10"/>
            </div>
            <div class="input-item">
                <label>2015年产量：</label>
                <input type="text" maxlength="10"/>
            </div>
            <div class="input-item">
                <label>2016年产量：</label>
                <input type="text" maxlength="10"/>
            </div>
            <div class="input-item">
                <label>2017年产量：</label>
                <input type="text" maxlength="10"/>
            </div>
        </div>
        <div class="dialog-ope-buttons">
            <div @click="doDialogClose()">取消</div>
            <div>保存</div>
        </div>
    </Dialog>
</template>
<script>
    import { createNamespacedHelpers, mapState } from 'vuex'
    import ns from '@/store/constants/ns'
    import types from '@/store/constants/types'

    const moduleNameSpace = ns.DATA_MANAGE
    const thisMapState = createNamespacedHelpers(moduleNameSpace).mapState
    const showProp = 'gardenInfoDialogShow'
    export default {
        name: 'ImportExport',
        computed: {
            ...thisMapState([showProp])
        },
        data () {
            return {
            }
        },
        methods: {
            doDialogClose () {
                this.$store.commit(moduleNameSpace + '/' + types.SWITCH_GARDEN_INFO_DIALOG_STATUS, false)
            }
        }
    }
</script>
