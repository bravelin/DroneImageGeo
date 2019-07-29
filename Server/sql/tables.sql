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
drop table if exists tool_user;
create table tool_user (
    id int auto_increment,
    login_name varchar(50) not null,
    login_password varchar(200) not null,
    real_name varchar(50) not null,
    last_login_time datetime,
    role char(1) not null, /* 角色， 0-超级管理员 1-管理员 */
    status char(1) not null, /* 账号状态， 0-账号已删除 1-正常 */
    created_at datetime,
    updated_at datetime,
    primary key(id)
);

/*** 增加超级管理员账号 yfgeo@123***/
insert into tool_user (id, login_name, login_password, real_name, role, status, created_at)
values (1, 'SuperAdmin', 'e3bc93a61c3709ecf848df6d38f7ec97ec8d90d9', '超级管理员', '0', '1', '2019-07-15 08:59:19');

/*** 任务表 ***/
drop table if exists task;
create table task (
    id int auto_increment,
    creator int not null, /* 任务创建者ID */
    status char(1) not null, /* 0-初始状态，等待上传原图，1-此时已上传原图  2-正射图，已生成谷歌瓦片图，tilesPath字段存放了瓦片图目录，待AI程序处理   3-AI程序处理中状态  4-AI程序处理完状态  5-已删除临时瓦片图目录状态  6-任务已删除状态 */
    aerial_date datetime, /* 航测日期 YYYY-MM-DD 可以从图片的拍摄日期字段取值 */
    img_total_size int default 0, /* 图片总体大小 */
    img_total_amount int default 0, /* 图片总体数量 */
    tiles_amount int default 0, /* 瓦片数目 */
    tiles_path varchar(500), /* 瓦片图临时目录 */
    min_lat double, /* 区域边距minLat */
    min_lng double, /* 区域边距minLng */
    max_lat double, /* 区域边距maxLat */
    max_lng double, /* 区域边距maxLng */
    remark varchar(500), /* 备注 */
    created_at datetime,
    updated_at datetime,
    primary key(id)
);

alter table task add column tiles_size int;

/*** image_data表添加列 img_width img_height ***/
alter table image_data add column img_width int;
alter table image_data add column img_height int;


/*** tile_image表添加列 任务ID、图片文件大小 ***/
alter table tile_image add column batch_id int;
alter table tile_image add column tile_size int;
