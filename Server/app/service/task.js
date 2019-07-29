'use strict';
const Service = require('egg').Service;
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
const uuidv1 = require('uuid/v1');

function generateUUID () {
    return uuidv1().replace(/-/g, '');
}

// fastDFS客户端实例
const fdfs = require('fdfs')
const fdfsClient = new fdfs({
    trackers: [
        {
            host: '0.0.0.0',
            port: 22122
        }
    ],
    timeout: 10000,
    charset: 'utf8'
})


class TaskService extends Service {
    // 查询任务列表
    async queryAll ({ page, pageSize, searchKey, status, uid }) {
        const { ctx, app } = this;
        const Sequelize = app.Sequelize;
        let countSql = 'select count(*) as count from task, tool_user where task.creator=tool_user.id '; // 计算总数的sql
        let dataSql = ''; // 查询数据的sql
        let sql = `select task.id as id, creator, task.status as status, aerial_date as aerialDate, img_total_size as imgTotalSize, img_total_amount as imgTotalAmount, tiles_amount as tilesAmount, tiles_path as tilesPath, tiles_size as tilesSize, min_lat as minLat, min_lng as minLng, max_lat as maxLat, max_lng as maxLng, remark, tool_user.real_name as creatorName, task.created_at as createdAt from task, tool_user where task.creator=tool_user.id `;
        let conditionSql = ''
        if (uid) {
            conditionSql += `and tool_user.id=${uid} `
        }
        if (status) {
            conditionSql += `and task.status='${status}' `
        } else {
            conditionSql += `and task.status !='6' `
        }
        if (searchKey) {
            conditionSql += `and (remark like '%${searchKey}%' or tool_user.real_name like '%${searchKey}%') `
        }
        countSql += conditionSql + ';';
        console.log('countSql...', countSql);
        conditionSql += `order by task.created_at desc limit ${(page - 1) * pageSize}, ${pageSize}`;
        dataSql = sql + conditionSql + ';';
        console.log('dataSql...', dataSql);

        const resData = { page, totalPage: 0, dataList: [], total: 0 };
        const queryRes = await ctx.model.query(dataSql, { type: Sequelize.QueryTypes.SELECT });
        const countRes = await ctx.model.query(countSql, { type: Sequelize.QueryTypes.SELECT });
        resData.dataList = queryRes;
        resData.total = countRes[0].count;
        resData.totalPage = Math.ceil(resData.total / pageSize);
        return resData;
    }
    // 查询任务详情
    async getDetail (id) {
        const { ctx, app } = this;
        const Sequelize = app.Sequelize;
        const sql = `select task.id as id, creator, task.status as status, aerial_date as aerialDate, img_total_size as imgTotalSize, img_total_amount as imgTotalAmount, tiles_amount as tilesAmount, tiles_path as tilesPath, tiles_size as tilesSize, min_lat as minLat, min_lng as minLng, max_lat as maxLat, max_lng as maxLng, remark, tool_user.real_name as creatorName, task.created_at as createdAt from task, tool_user where task.creator=tool_user.id and task.id=${id}`;
        const queryRes = await ctx.model.query(sql, { type: Sequelize.QueryTypes.SELECT });
        if (queryRes[0]) {
            return { message: '查询成功！', data: queryRes[0], code: 200 };
        } else {
            return { message: '未能查询到任务！', code: 201 };
        }
    }
    // 查询任务原图列表
    async getOriginImgList (taskId) {
        const { ctx, app } = this;
        const Sequelize = app.Sequelize;
        const sql = `select id, concat('${app.config.picHost}', img_url) as imgUrl, img_name as imgName, img_date as imgDate, img_size as imgSize,
                    batch_id as taskId, img_width as imgWidth, img_height as imgHeight, longitude, latitude, altitude,
                    create_time as createdAt from image_data where batch_id='${taskId}'`;
        const queryRes = await ctx.model.query(sql, { type: Sequelize.QueryTypes.SELECT });
        return { message: '查询成功！', code: 200, data: queryRes };
    }
    // 创建任务
    async create (uid, remark) {
        const { ctx } = this;
        await ctx.model.Task.create({ creator: uid, remark, status: '0', createdAt: new Date() });
        return { message: '任务创建成功！', code: 200 };
    }
    // 删除任务
    async del (id) {
        const { ctx } = this;
        const task = await ctx.model.Task.findById(id);
        if (!task) {
            return { message: '未能查询到任务！', code: 201 };
        }
        await task.update({ status: '6', updatedAt: new Date() });
        return { message: '任务删除成功！', code: 200 };
    }
    // 更改任务状态为1
    async updateOriginImg ({ id, aerialDate, imgTotalSize, imgTotalAmount }) {
        const { ctx } = this;
        const task = await ctx.model.Task.findById(id);
        if (!task) {
            return { message: '未能查询到任务！', code: 201 };
        }
        await task.update({ status: '1', imgTotalSize: imgTotalSize - 0, imgTotalAmount: imgTotalAmount - 0, aerialDate: new Date(aerialDate), updatedAt: new Date() });
        return { message: '更新成功！', code: 200 };
    }
    // 上传图片
    async uploadOriginImg ({ lng, lat, alt, photo, size, task, w, h }) {
        const { ctx, app } = this;
        const stream = await ctx.getFileStream();
        const originalName = path.basename(stream.filename); // 原文件名
        const fileType = stream.mimeType;
        const fileExt = (fileType && fileType.indexOf('/') > 0) ? fileType.split('/')[1] : (fileType || ''); // 文件后缀
        const tempFileName = generateUUID() + '.' + fileExt;
        const exists = fs.existsSync(app.config.uploadDir);
        if (!exists) {
            fs.mkdirSync(app.config.uploadDir);
            console.log('创建目录...', app.config.uploadDir);
        }
        const tempFilePath = path.join(app.config.uploadDir, tempFileName);
        const writeStream = fs.createWriteStream(tempFilePath);
        try {
            await awaitWriteStream(stream.pipe(writeStream));
            const fileId = await fdfsClient.upload(tempFilePath);
            const generateName = fileId.substr(fileId.lastIndexOf('/') + 1);
            photo = decodeURIComponent(photo);
            const resData = {
                originalName,
                name: generateName,
                type: fileType,
                url: app.config.picHost + fileId,
                size, lng, lat, alt, photo, task, w, h, state: 'SUCCESS'
            }
            console.log('res...', resData);
            fs.unlinkSync(tempFilePath); // 删除临时文件
            // 写入数据库
            await ctx.model.ImageData.create({
                imgUrl: fileId,
                imgName: originalName,
                imgDate: new Date(photo),
                imgSize: size,
                taskId: task,
                createdAt: new Date(),
                longitude: lng + '',
                latitude: lat + '',
                altitude: alt + '',
                imgWidth: w - 0,
                imgHeight: h - 0
            });
            return { message: '上传成功！', code: 200, data: resData };
        } catch (err) {
            await sendToWormhole(stream); // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
            throw err;
        }
    }
    // 上传瓦片
    async uploadTileImg ({ x, y, z, size, task, w, h }) {
        const { ctx, app } = this;
        const stream = await ctx.getFileStream();
        const originalName = path.basename(stream.filename); // 原文件名
        const fileType = stream.mimeType;
        const fileExt = (fileType && fileType.indexOf('/') > 0) ? fileType.split('/')[1] : (fileType || ''); // 文件后缀
        const tempFileName = generateUUID() + '.' + fileExt;
        const exists = fs.existsSync(app.config.uploadDir);
        if (!exists) {
            fs.mkdirSync(app.config.uploadDir);
            console.log('创建目录...', app.config.uploadDir);
        }
        const tempFilePath = path.join(app.config.uploadDir, tempFileName);
        const writeStream = fs.createWriteStream(tempFilePath);
        try {
            await awaitWriteStream(stream.pipe(writeStream));
            const fileId = await fdfsClient.upload(tempFilePath);
            const generateName = fileId.substr(fileId.lastIndexOf('/') + 1);
            const resData = {
                originalName,
                name: generateName,
                type: fileType,
                url: app.config.picHost + fileId,
                size, x, y, z, task, w, h, state: 'SUCCESS'
            }
            console.log('res...', resData);
            fs.unlinkSync(tempFilePath); // 删除临时文件
            // 写入数据库
            await ctx.model.TileImage.create({
                tileX: x,
                tileY: y,
                tileZ: z,
                tileSize: size - 0,
                fdfsPath: fileId,
                taskId: task,
                createdAt: new Date()
            });
            return { message: '上传成功！', code: 200, data: resData };
        } catch (err) {
            await sendToWormhole(stream); // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
            throw err;
        }
    }
    // 更改任务状态为2
    async updateTileImg ({ id, tilesAmount, tilesSize, tilesPath, minLat, minLng, maxLat, maxLng }) {
        const { ctx } = this;
        const task = await ctx.model.Task.findById(id);
        if (!task) {
            return { message: '未能查询到任务！', code: 201 };
        }
        await task.update({ status: '2', tilesAmount: tilesAmount - 0, tilesSize: tilesSize - 0, tilesPath, updatedAt: new Date(), minLat: minLat - 0, minLng: minLng - 0, maxLat: maxLat - 0, maxLng: maxLng - 0 });
        return { message: '更新成功！', code: 200 };
    }
}

module.exports = TaskService;
