'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const piexif = require('piexifjs');
const Xlsx = require('node-xlsx');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
const uuidv1 = require("uuid/v1");

function generateUUID() {
    return uuidv1().replace(/-/g, "");
}

class AdminService extends Service {
    async importOffset () {
        const { ctx, app } = this;
        const stream = await ctx.getFileStream();
        const originalName = path.basename(stream.filename);
        const fileName = generateUUID() + originalName.substr(originalName.lastIndexOf('.'));
        const target = path.join(app.config.uploadDir, fileName);
        const writeStream = fs.createWriteStream(target);
        try {
            await awaitWriteStream(stream.pipe(writeStream));
        } catch (err) {
            await sendToWormhole(stream);
        }
        ctx.body = '<h1>upload success!!!</h1>'
        console.log('response message.....')
        process.nextTick(async () => {
            console.log('continue process....')
            try {
                const xlsxContent = Xlsx.parse(target);
                const xlsxData = xlsxContent[0].data; // 二维数组
                let row = null;
                if (xlsxData && xlsxData.length > 2) {
                    for (let i = 1; i < xlsxData.length; i++) {
                        row = xlsxData[i];
                        if (row.length && row.length > 3) {
                            console.log('insert...', row)
                            await app.mysql.insert('offset', {
                                lat: row[1] - 0,
                                lng: row[0] - 0,
                                lat_offset: row[3] - 0,
                                lng_offset: row[2] - 0
                            });
                        }
                    }
                    console.log('over....')
                }
                return true;
            } catch (err) {
                throw err;
            }
        })
    }
    async getGoogleOffset () {
        const { ctx, app } = this;
        ctx.body = '<h1>process...!!!</h1>'
        process.nextTick(async () => {
            const minLng = 113.117
            const minLat = 24.000
            const maxLng = 113.500
            const maxLat = 28
            let lng = minLng
            let lat = minLat
            let count = 0
            let result = null
            let offsetLng = 0
            let offsetLat = 0
            for (; lng < maxLng; lng = lng + 0.001) {
                lat = count == 0 ? 24.103 : minLat
                for (; lat < maxLat; lat = lat + 0.001) {
                    result = await ctx.curl(`http://map.yanue.net/gpsapi.php?lat=${lat}&lng=${lng}`, {
                        dataType: 'json', timeout: 30000
                    })
                    if (result.data.error == 0) {
                        const googleGeo = result.data.google
                        offsetLng = googleGeo.lng - lng
                        offsetLat = googleGeo.lat - lat
                        await app.mysql.insert('offset', {
                            lat: lat.toFixed(3) - 0,
                            lng: lng.toFixed(3) - 0,
                            lat_offset: offsetLat,
                            lng_offset: offsetLng
                        });
                        console.log(++count, lng.toFixed(3), lat.toFixed(3), offsetLng, offsetLat)
                        // for (let i = 0; i < 100; i++) {}
                    } else {
                        console.log('出错了....', lng, lat)
                    }
                }
            }
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

module.exports = AdminService;
