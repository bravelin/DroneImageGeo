'use strict';
const Service = require('egg').Service;
const crypto = require('crypto');
class UserService extends Service {
    // 分页查询所有账号
    async queryAll ({ searchKey, page, pageSize }) {
        const { ctx, app } = this;
        const Sequelize = app.Sequelize;
        let countSql = 'select count(*) as count from tool_user '; // 计算总数的sql
        let dataSql = ''; // 查询数据的sql
        let sql = `select id, login_name as loginName, real_name as realName, last_login_time as lastLoginTime, role, created_at as createdAt from tool_user `;
        let conditionSql = `where status !='0' `
        if (searchKey) {
            conditionSql += `and (login_name like '%${searchKey}%' or real_name like '%${searchKey}%') `
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

    // 查找正常状态的账号，依据loginName和loginPassword
    async find (loginName, loginPassword) {
        const ctx = this.ctx;
        const resData = await ctx.model.User.findOne({
            attributes: { exclude: ['loginPassword'] },
            where: { loginName, loginPassword, status: '1' }
        });
        return resData;
    }

    // 查找账号，通过realName
    async getManagerIdByRealName (realName) {
        const ctx = this.ctx;
        const res = await ctx.model.User.findOne({
            where: { realName }
        });
        if (res) {
            return res.id;
        } else {
            return null;
        }
    }

    // 查找账号，通过id
    async findById (id) {
        const ctx = this.ctx;
        return await ctx.model.User.findById(id, {
            attributes: { exclude: ['loginPassword'] }
        });
    }

    // 判定是否是超管账号
    async isSuperAdministrator (id) {
        const ctx = this.ctx;
        const res = await ctx.model.User.findOne({
            where: { id, role: '0' }
        });
        return !!res;
    }

    async getDetail (id) {
        const manager = await this.findById(id);
        if (manager) {
            return { message: '账号查询成功！', data: manager, code: 200 };
        } else {
            return { message: '未能查询到账号！', data: null, code: 201 };
        }
    }

    // 记录登录时间
    async saveLoginTime (manager) {
        await manager.update({ lastLoginTime: new Date() });
    }

    // 更新账号
    async updateRealName (id, realName) {
        const manager = await this.findById(id);
        if (manager) {
            await manager.update({ realName, updatedAt: new Date() });
            return { code: 200, message: '账号修改成功！' };
        } else {
            return { code: 201, message: '未能查询到账号！' };
        }
    }

    // 修改账号密码
    async updatePassword (id, password) {
        const ctx = this.ctx;
        const manager = await this.findById(id);
        if (manager) {
            const plainPassword = ctx.helper.aesDecrypt(password);
            const hash = crypto.createHash('sha1');
            hash.update(plainPassword);
            hash.update(plainPassword);
            await manager.update({ loginPassword: hash.digest('hex'), updatedAt: new Date() });
            return { code: 200, message: '账号密码修改成功！' };
        } else {
            return { code: 201, message: '未能查询到账号！' };
        }
    }

    async updateRealNameAndPassword (id, realName, oldPassword, password) {
        const ctx = this.ctx;
        const manager = await ctx.model.User.findById(id);
        if (manager) {
            const oldPw = ctx.helper.aesDecrypt(oldPassword);
            const oldHash = crypto.createHash('sha1');
            oldHash.update(oldPw);
            oldHash.update(oldPw);
            if (oldHash.digest('hex') != manager.loginPassword) {
                return { code: 201, message: '旧密码不正确！' };
            }
            const plainPassword = ctx.helper.aesDecrypt(password);
            const hash = crypto.createHash('sha1');
            hash.update(plainPassword);
            hash.update(plainPassword);
            await manager.update({ loginPassword: hash.digest('hex'), realName, updatedAt: new Date() });
            return { code: 200, message: '账号信息修改成功！' };
        } else {
            return { code: 201, message: '未能查询到账号！' };
        }
    }

    // 创建账号
    async create (loginName, realName, password, role = '1') {
        const ctx = this.ctx;
        const resData = await ctx.model.User.findOne({
            where: { loginName }
        });
        if (resData) {
            return { message: '已存在相同账号的用户！', code: 201 };
        } else {
            const plainPassword = ctx.helper.aesDecrypt(password);
            const hash = crypto.createHash('sha1');
            hash.update(plainPassword);
            hash.update(plainPassword);
            const loginPassword = hash.digest('hex');
            await ctx.model.User.create({ loginName, realName, loginPassword, role, status: '1', createdAt: new Date() });
            return { message: '账号创建成功！', code: 200 };
        }
    }

    // 删除账号
    async del (id) {
        const manager = await this.findById(id);
        if (!manager) {
            return { message: '未能查询到账号！', code: 201 }
        }
        await manager.update({ status: '0', updatedAt: new Date() });
        return { message: '账号删除成功！', code: 200 }
    }
}

module.exports = UserService;
