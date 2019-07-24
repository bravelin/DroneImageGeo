'use strict';
const Service = require('egg').Service;
class TaskService extends Service {
    // 查询任务列表
    async queryAll ({ page, pageSize, searchKey, status, uid }) {
        const { ctx, app } = this;
        const Sequelize = app.Sequelize;
        let countSql = 'select count(*) as count from task, tool_user where task.creator=tool_user.id '; // 计算总数的sql
        let dataSql = ''; // 查询数据的sql
        let sql = `select task.id as id, creator, task.status as status, aerial_date as aerialDate, img_total_size as imgTotalSize, img_total_amount as imgTotalAmount, tiles_amount as tilesAmount, tiles_path as tilesPath, min_lat as minLat, min_lng as minLng, max_lat as maxLat, max_lng as maxLng, remark, tool_user.real_name as creatorName, task.created_at as createdAt from task, tool_user where task.creator=tool_user.id `;
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
    // 创建任务
    async create (uid, remark) {
        const { ctx } = this;
        await ctx.model.Task.create({ creator: uid, remark, status: '0' });
        return { message: '任务创建成功！', code: 200 };
    }
    // 删除任务
    async del (id) {
        const { ctx } = this;
        const task = await ctx.model.Task.findById(id);
        if (!task) {
            return { message: '未能查询到任务！', code: 201 };
        }
        await task.update({ status: '6' });
        return { message: '任务删除成功！', code: 200 };
    }
}

module.exports = TaskService;
