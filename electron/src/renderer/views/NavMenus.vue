<!--菜单-->
<template>
    <div class="nav-menus">
        <ul>
            <li><div class="menu-item home-menu" @click="doClickMenu('guide')"><i class="iconfont">&#xe673;</i>引导说明</div></li>
            <li><div class="menu-item active tasks-menu" @click="doClickMenu('tasks')"><i class="iconfont">&#xe673;</i>任务列表</div></li>
            <li class="mutil-menu active" ref="tool">
                <div class="menu-item tool-menu" @click="doSwitchMenu('tool')"><i class="iconfont">&#xe627;</i>图片工具</div>
                <ul>
                    <li><div class="menu-item sub-item addGeo-menu" @click="doClickMenu('addGeo')">图片添加经纬度</div></li>
                    <li><div class="menu-item sub-item rectifyGeo-menu" @click="doClickMenu('rectifyGeo')">图片经纬度纠偏</div></li>
                    <li><div class="menu-item sub-item previewTiles-menu" @click="doClickMenu('previewTiles')">谷歌瓦片图预览</div></li>
                </ul>
            </li>
            <li v-show="isSuperAdmin"><div class="menu-item accounts-menu" @click="doClickMenu('accounts')"><i class="iconfont">&#xe633;</i>账号管理</div></li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'NavMenus',
        computed: {
            isSuperAdmin () {
                return this.$store.state.global.userRole == '0'
            }
        },
        mounted () {
            const that = this
            that.$nextTick(() => {
                const pos = location.href.lastIndexOf('#/')
                const currRouterName = location.href.substr(pos + 2)
                if (currRouterName) {
                    that.doClickMenu(currRouterName)
                }
            })
        },
        methods: {
            doClickMenu (menuName) {
                const menus = document.querySelectorAll('div.menu-item')
                let cls = null
                for (let i = 0; i < menus.length; i++) {
                    cls = menus[i].classList
                    if (cls.contains(menuName + '-menu')) {
                        cls.add('active')
                    } else {
                        cls.remove('active')
                    }
                }
                this.$router.push({ name: menuName })
            },
            doSwitchMenu (dom) {
                const that = this
                const el = that.$refs[dom]
                if (el.classList.contains('active')) {
                    el.classList.remove('active')
                } else {
                    el.classList.add('active')
                }
            }
        }
    }
</script>
