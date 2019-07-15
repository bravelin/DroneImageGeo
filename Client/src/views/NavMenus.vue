<!--菜单-->
<template>
    <div class="nav-menus">
        <ul>
            <li><div class="menu-item active" @click="doClickMenu('tasks')"><i class="iconfont">&#xe673;</i>任务列表</div></li>
            <li class="mutil-menu active">
                <div class="menu-item" @click="doSwitchMenu($event)"><i class="iconfont">&#xe627;</i>图片工具</div>
                <ul>
                    <li><div class="menu-item sub-item">图片添加经纬度</div></li>
                    <li><div class="menu-item sub-item">图片经纬度纠偏</div></li>
                </ul>
            </li>
            <li><div class="menu-item" @click="doClickMenu('accounts')"><i class="iconfont">&#xe633;</i>账号管理</div></li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'NavMenus',
        methods: {
            doClickMenu (menuName) {
                this.$router.push({ name: menuName })
            },
            doSwitchMenu (e) {
                console.log(e)
            }
        }
    }
</script>
