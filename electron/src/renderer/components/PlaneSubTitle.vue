<template>
    <div class="plane-sub-title">
        <canvas ref="bg"></canvas>
        <h3>{{ title }}</h3>
    </div>
</template>
<script>
    export default {
        name: 'PlaneSubTitle',
        props: {
            title: {
                type: String
            }
        },
        mounted () {
            const that = this
            that.$nextTick(() => {
                that.drawBg()
            })
        },
        methods: {
            drawBg () {
                const that = this
                const bg = that.$refs.bg
                if (!bg) {
                    return
                }
                const styles = window.getComputedStyle(that.$el, null)
                const w = parseInt(styles['width'])
                const h = parseInt(styles['height'])
                // const color = that.active ? that.activeColor : that.color
                if (!w || !h) {
                    setTimeout(() => { that.drawBg() }, 300)
                } else { // 绘制开口向上的括号
                    bg.width = w
                    bg.height = h
                    const left = 20
                    const ctx = bg.getContext('2d')
                    ctx.strokeStyle = '#74e3cf'
                    ctx.lineWidth = 1
                    ctx.lineCap = 'round'
                    ctx.clearRect(0, 0, w, h)
                    ctx.beginPath()
                    ctx.moveTo(left, h)
                    ctx.lineTo(10 + left, h)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.moveTo(16 + left, h)
                    ctx.lineTo(40 + left, h)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.moveTo(46 + left, h)
                    ctx.lineTo(54 + left, h)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.moveTo(60 + left, h)
                    ctx.lineTo(74 + left, h)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.strokeStyle = '#355360'
                    ctx.moveTo(90 + left, h)
                    ctx.lineTo(w - 61, h)
                    ctx.lineTo(w - 45, h - 15.5)
                    ctx.lineTo(w, h - 15.5)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.moveTo(w - 69, h - 5)
                    ctx.lineTo(w - 59, h - 16)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.moveTo(w - 63, h - 5)
                    ctx.lineTo(w - 52, h - 16)
                    ctx.stroke()
                    ctx.strokeStyle = '#74e3cf'
                    ctx.beginPath()
                    const center = (w - left) / 2 + 10
                    ctx.moveTo(center - 5, h)
                    ctx.lineTo(center + 5, h)
                    ctx.stroke()
                }
            }
        }
    }
</script>
