'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const piexif = require('piexifjs');

class SysService extends Service {
    // 校验token的有效性
    async verifyToken (data) {
        const { app } = this
        return new Promise((resolve, reject) => {
            app.jwt.verify(data, app.config.jwt.secret, (err, decoded) => {
                const res = {}
                if (err) {
                    res.verify = false;
                    res.message = err.message;
                } else {
                    res.verify = true;
                    res.message = decoded;
                }
                resolve(res)
            })
        })
    }
    async rectify (imageDir) {
        const { ctx, app } = this;
        ctx.body = '<h1>process...!!!</h1>'
        const convertGeoNum = ctx.helper.convertGeoNum
        process.nextTick(async () => {
            imageDir = imageDir || 'D:\\drone-images'
            // 遍历文件夹
            fs.readdir(imageDir, async (err, files) => {
                if (err) {
                    console.log('AdminService rectify error...', err)
                    return 'error'
                } else {
                    let fileName = ''
                    for (let i = 0; i < files.length; i++) {
                        fileName = files[i]
                        if (/(jpeg|jpg)/i.test(fileName)) {
                            const fileDir = path.join(imageDir, fileName)
                            const jpeg = fs.readFileSync(fileDir)
                            const imageData = jpeg.toString('binary')
                            const exifObj = piexif.load(imageData)
                            const geoData = exifObj['GPS']
                            if (geoData) {
                                // console.log('geoData...', geoData)
                                const latArr = geoData['2']
                                const lngArr = geoData['4']
                                const lat = (latArr[0][0] / latArr[0][1]) + (latArr[1][0] / latArr[1][1]) / 60 + (latArr[2][0] / latArr[2][1]) / 3600
                                const lng = (lngArr[0][0] / lngArr[0][1]) + (lngArr[1][0] / lngArr[1][1]) / 60 + (lngArr[2][0] / lngArr[2][1]) / 3600
                                const result = await ctx.curl(`http://map.yanue.net/gpsapi.php?lat=${lat}&lng=${lng}`, {
                                    dataType: 'json', timeout: 30000
                                })
                                if (result.data.error == 0) {
                                    const googleGeo = result.data.google
                                    console.log(fileName, ' origin...', lat, lng, 'dist...', googleGeo.lat, googleGeo.lng)
                                    console.log(convertGeoNum(googleGeo.lat), convertGeoNum(googleGeo.lng))
                                    const convertLatObj = convertGeoNum(googleGeo.lat)
                                    const convertLngObj = convertGeoNum(googleGeo.lng)
                                    // 修正经纬度GeoData
                                    geoData['2'][0][0] = convertLatObj.deg
                                    geoData['2'][1][0] = convertLatObj.min
                                    geoData['2'][2][0] = convertLatObj.sec

                                    geoData['4'][0][0] = convertLngObj.deg
                                    geoData['4'][1][0] = convertLngObj.min
                                    geoData['4'][2][0] = convertLngObj.sec
                                    // 写入新文件中
                                    const exifBytes = piexif.dump(exifObj)
                                    const newData = piexif.insert(exifBytes, imageData)
                                    const newJpeg = new Buffer(newData, 'binary')
                                    fs.writeFileSync(app.config.distDir + fileName, newJpeg)
                                    console.log('new image...', app.config.distDir + fileName)
                                } else {
                                    console.log(fileName, ' origin...', lat, lng)
                                }
                            }
                        }
                    }
                }
            })
        })
    }
}

module.exports = SysService;
