<!--修改密码-->
<template>
    <Dialog title="修改个人信息" class="change-password-dialog" :show="changePwDialogStatus" @close="doDialogClose()">
        <input type="text" style="display:none" name="userName"/>
        <input type="password" style="display:none" name="password"/>
        <input type="password" style="display:none" name="confirmPassword"/>
        <div class="input-wrap user-name-input-wrap">
            <input autocomplete="off" name="userName" v-model="userName" type="text" placeholder="请输入中文名" maxlength="30"/>
        </div>
        <div class="input-wrap password-input-wrap">
            <input autocomplete="new-password" name="password" v-model="password" type="password" placeholder="请输入新密码" maxlength="50"/>
        </div>
        <div class="input-wrap password-input-wrap">
            <input autocomplete="new-password" name="confirmPassword" v-model="confirmPassword" type="password" placeholder="请再次输入新密码" maxlength="50"/>
        </div>
        <div class="dialog-ope-buttons">
            <div @click="doDialogClose()">返回</div>
            <div>保存</div>
        </div>
    </Dialog>
</template>
<script>
    import { mapState } from 'vuex'
    import types from '@/store/constants/types'

    const prop = `$store.state.changePwDialogStatus`
    export default {
        name: 'ChangePassword',
        computed: {
            ...mapState(['changePwDialogStatus'])
        },
        watch: {
            [prop] (newVal) {
                if (newVal) {
                    const that = this
                    that.userName = ''
                    that.password = ''
                    that.confirmPassword = ''
                }
            }
        },
        data () {
            return {
                userName: '',
                password: '',
                confirmPassword: ''
            }
        },
        methods: {
            doDialogClose () {
                this.$store.commit(types.SWITCH_CHANGE_PW_DIALOG_STATUS, false)
            }
        }
    }
</script>