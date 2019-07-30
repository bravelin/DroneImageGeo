<!--设置baseurl的弹窗-->
<template>
    <Dialog title="设置" class="setting-dialog" :show="settingDialogVisible" @close="doDialogClose()">
        <div class="input-wrap">
            <label>远程服务地址：</label>
            <input ref="baseUrl" v-model="baseUrl" type="text" placeholder="请输入远程服务地址" maxlength="200"/>
        </div>
        <div class="dialog-ope-buttons">
            <div @click="doDialogClose()">取消</div>
            <div @click="doCommit()">确定</div>
        </div>
    </Dialog>  
</template>
<script>
    import types from '@/store/constants/types'
    import tags from '@/lib/tags'
    import config from '@/lib/config'
    import axios from 'axios'

    const prop = `$store.state.global.settingDialogStatus`
    export default {
        name: 'SettingDialog',
        computed: {
            settingDialogVisible () {
                return this.$store.state.global.settingDialogStatus
            }
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    this.baseUrl = config.storeBaseUrl || config.baseUrl
                }
            }
        },
        data () {
            return {
                baseUrl: ''
            }
        },
        methods: {
            doDialogClose () {
                this.$store.dispatch(types.SWITCH_SETTING_DIALOG_STATUS_SYNC, false)
            },
            doCommit () {
                const that = this
                const store = that.$store
                if (that.baseUrl != config.baseUrl) {
                    config.storeBaseUrl = that.baseUrl
                    localStorage.setItem(tags.baseUrl, that.baseUrl)
                } else {
                    config.storeBaseUrl = ''
                    localStorage.setItem(tags.baseUrl, '')
                }
                axios.defaults.baseURL = config.storeBaseUrl || config.baseUrl
                store.dispatch(types.SWITCH_MESSAGE_TIP_SYNC, { show: true, tip: '修改成功！' })
                setTimeout(() => {
                    store.dispatch(types.SWITCH_SETTING_DIALOG_STATUS_SYNC, false)
                }, 500)
            }
        }
    }
</script>

