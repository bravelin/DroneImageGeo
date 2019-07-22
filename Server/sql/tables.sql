use gis;

/*** 经纬度偏差表 ***/
drop table if exists offset;
create table offset (
    id int auto_increment,
    lat float not null,
    lng float not null,
    lat_offset double not null,
    lng_offset double not null,
    primary key(id)
);

/*** 管理人员表 ***/
drop table if exists user;
create table user (
    id char(32),
    loginName varchar(50) not null,
    loginPassword varchar(200) not null,
    realName varchar(50) not null,
    lastLoginTime datetime,
    role char(1) not null, /* 0-超级管理员 1-管理员 */
    status char(1) not null, /* 0-账号已删除 1-正常 */
    createdAt datetime,
    updatedAt datetime,
    primary key(id)
);

/*** 增加超级管理员账号 ***/
insert into user (id, loginName, loginPassword, realName, role, status, createdAt)
values ('6c84fb9012c411e1840d7b25c5ee775a', 'SuperAdmin', '05471d5926bb87ec3431d9797e5140d1fc1e0d2b', '超级管理员', '0', '1', '2019-07-15 08:59:19');

/*** 任务表 ***/
drop table if exists task;
create table user (
    id char(32),
    creator char(32) not null, /* 任务创建者 */
    status char(1) not null, /* 0-初始状态，待处理，此时已上传原图  1-正射图，已生成谷歌瓦片图，tiles字段存放了瓦片图目录，待AI程序处理  2-AI程序处理中状态  3-AI程序处理完状态  4-已删除临时瓦片图目录状态 */
    tiles varchar(500), /* 瓦片图临时目录 */
    remark varchar(500), /* 备注 */
    createdAt datetime,
    updatedAt datetime,
    primary key(id)
);