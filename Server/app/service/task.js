'use strict';
const Service = require('egg').Service;
class TaskService extends Service {
    async queryAll ({ page, pageSize, searchKey, status, uid }) {
        const { ctx, app } = this;
        const Sequelize = app.Sequelize;
        let countSql = 'select count(*) as count from task, tool_user where task.creator=tool_user.id '; // 计算总数的sql
        let dataSql = ''; // 查询数据的sql
        let sql = `select task.id as id, creator, task.status as status, aerial_date as aerialDate, img_total_size as imgTotalSize, img_total_amount as imgTotalAmount, tiles_amount as tilesAmount, tiles_path as tilesPath, min_lat as minLat, min_lng as minLng, max_lat as maxLat, max_lng as maxLng, remark, tool_user.real_name as creatorName, task.created_at as createdAt from task, tool_user where task.creator=tool_user.id `;
        let conditionSql = ''
        if (uid) {
            conditionSql += `and tool_user.id='${uid}' ` 
        }
        if (status) {
            conditionSql += `and task.status='${status}' `
        } else {
            conditionSql += `status !='5' ` 
        }
        if (searchKey) {
            conditionSql += `and (remark like '%${searchKey}%' or tool_user.real_name like '%${searchKey}%') `
        }
        countSql += conditionSql + ';';
        console.log('countSql...', countSql);
        conditionSql += `order by created_at desc limit ${(page - 1) * pageSize}, ${pageSize}`;
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
}

module.exports = TaskService;
