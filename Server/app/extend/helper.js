// 处理成功响应
exports.success = (ctx, result = null, message = "success", code = 200, status = 200) => {
    ctx.body = {
        code: code,
        message: message,
        data: result
    };
    ctx.status = status;
};
// 处理失败响应
exports.error = (ctx, code, message) => {
    ctx.body = {
        code: code,
        message: message
    };
    ctx.status = code;
};

exports.formatTime = (date, format = 'yyyy-MM-dd hh:mm:ss') => {
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
};

// GPS纠偏算法
const PI = Math.PI
const EARTH_RADIUS = 6378245.0
const EE = 0.00669342162296594323

function isOutOfChina (lat, lng) {
    if (lng < 72.004 || lng > 137.8347) {
        return true
    }
    if (lat < 0.8293 || lat > 55.8271) {
        return true
    }
    return false
}

function transformLat (x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
    return ret
}

function transformLng (x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
    return ret
}

exports.correctGeo = function (lat, lng) {
    lat = parseFloat(lat)
    lng = parseFloat(lng)
    if (isOutOfChina(lat, lng)) {
        return { lat, lng }
    } else {
        let dLat = transformLat(lng - 105.0, lat - 35.0)
        let dLng = transformLng(lng - 105.0, lat - 35.0)
        let radLat = lat / 180.0 * PI
        let magic = Math.sin(radLat)
        magic = 1 - EE * magic * magic
        let sqrtMagic = Math.sqrt(magic)
        dLat = (dLat * 180.0) / ((EARTH_RADIUS * (1 - EE)) / (magic * sqrtMagic) * PI)
        dLng = (dLng * 180.0) / (EARTH_RADIUS / sqrtMagic * Math.cos(radLat) * PI)
        return { lat: lat + dLat, lng: lng + dLng }
    }
}

// 将经纬度小数形式转成度分秒
exports.convertGeoNum = function (num) {
    const deg = parseInt(num)
    const min = parseInt((num - deg) * 60)
    const sec = parseInt(((num - deg) * 60 - min) * 60 * 10000)
    return { deg, min, sec }
} 
