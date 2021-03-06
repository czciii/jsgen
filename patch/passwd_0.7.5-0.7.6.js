'use strict';
/*global require, module, Buffer, jsGen*/
// v0.7.5升级至v0.7.6 更新账号密码
var then = jsGen.module.then,
    HmacSHA256 = jsGen.lib.tools.HmacSHA256;

module.exports = function () {
    var count = 0, users = [], userDao = jsGen.dao.user;
    return then(function (cont) {
        var userDao = jsGen.dao.user;
        userDao.getFullUsersIndex(function (err, doc) {
            if (err) {
                cont(err);
            } else if (doc) {
                users.push(doc);
            } else {
                console.log(users.length + ' users need to update!');
                cont(null, users);
            }
        });
    }).each(null, function (cont, user) {
        var passwd = HmacSHA256(user.passwd, 'jsGen'),
            data = {
                _id: user._id,
                passwd: passwd
            };
        userDao.setUserInfo(data, function (error, user) {
            count += 1;
            console.log(count + ' : ' + user.name + ' updated.');
            cont(null, user);
        });
    }).then(function (cont, list) {
        console.log('Total ' + users.length + ' users, ' + list.length + ' users updated.');
        cont();
    });
};