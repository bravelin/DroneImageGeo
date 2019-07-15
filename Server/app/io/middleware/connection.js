'use strict';
const room = 'yufengtek-default-room';
module.exports = app => {
    return async (ctx, next) => {
        const { app, socket } = ctx;
        const id = socket.id;
        console.log('socket connection................................', id, ctx.query);
        socket.uid = ctx.query.uid;
        socket.join(room);
        if (!app.sockets) {
            app.sockets = [];
        }
        app.sockets.push(socket);
        await next();
        console.log('disconnection.............................');
        for (let i = 0; i < app.sockets.length; i++) {
            if (app.sockets[i].id == socket.id) {
                app.sockets.splice(i, 1);
                break;
            }
        }
    };
};
