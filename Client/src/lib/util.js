const crypto = require('crypto')
const aesKey = '20190715081720Qm'
const aesIv = [...aesKey].reverse().join('')

// AES加密
export function aesEncrypt (data) {
    const cipher = crypto.createCipheriv('aes-128-cbc', aesKey, aesIv)
    let crypted = cipher.update(data, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}

// cookie操作
export function cookie (name, value, expireDay) {
    if (!name) {
        return
    }
    let arr
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (value == null) { // 获取cookie
        arr = document.cookie.match(reg)
        if (arr) {
            return decodeURIComponent(arr[2])
        }
        return null
    } else { // 设置cookie
        if (!expireDay) {
            expireDay = 10
        }
        const exp = new Date()
        exp.setTime(exp.getTime() + expireDay * 24 * 60 * 60 * 1000)
        document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toGMTString()
    }
}

// 时间格式化
export function formatTime (date, format = 'yyyy-MM-dd hh:mm:ss') {
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return format
}
