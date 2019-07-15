<template>
    <div class="bracket-button" :class="{ active }" @click="doClick()">
        <canvas ref="bg"></canvas>
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: 'BracketButton',
        props: {
            color: {
                type: String,
                default: '#74c0e3'
            },
            activeColor: {
                type: String,
                default: '#ffffff'
            },
            active: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            active () {
                this.drawBg()
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
                const color = that.active ? that.activeColor : that.color
                if (!w || !h) {
                    setTimeout(() => { that.drawBg() }, 300)
                } else { // 绘制开口向上的括号
                    bg.width = w
                    bg.height = h
                    const left = 3
                    const deltH = 3
                    const gap = 3
                    const ctx = bg.getContext('2d')
                    ctx.strokeStyle = color
                    ctx.lineWidth = 1
                    ctx.lineCap = 'round'
                    ctx.clearRect(0, 0, w, h)
                    ctx.beginPath()
                    ctx.moveTo(gap + left, gap + 1)
                    ctx.lineTo(gap + 0.5, gap + deltH + 1)
                    ctx.lineTo(gap + 0.5, h - gap - deltH)
                    ctx.lineTo(gap + left, h - gap)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.moveTo(w - gap - left, gap + 1)
                    ctx.lineTo(w - gap - 0.5, gap + deltH + 1)
                    ctx.lineTo(w - gap - 0.5, h - gap - deltH)
                    ctx.lineTo(w - gap - left, h - gap)
                    ctx.stroke()
                }
            },
            doClick () {
                this.$emit('click') // 由上层处理click事件
            }
        }
    }
</script>
