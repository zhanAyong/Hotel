var mongoose = require('mongoose');
var crypto = require("crypto");

var usert= new mongoose.Schema({
    yonghuming:String,
    mima:String,
});

var user=mongoose.model("user",usert);

exports.allUser=function(yonghuming,callback){
    user.find({"yonghuming":yonghuming},function(err,doc){

        callback(err,doc);
    });
};
//更改学生密码
exports.changepw = function(sid,pw,callback){
    user.find({"yonghuming" : sid},function(err,results){
        if(err){
            callback("服务器错误！请检查输入的内容！");
            return;
        }
        if(results.length == 0){
            //-1表示你要更改的学生学号，我没有找到
            callback("没有找到这个学号");
        }else{
            thestudent  = results[0];
            //加密字符串，digest表示进一步处理为hex十六进制
            thestudent.mima = crypto.createHash("sha256").update(pw).digest("hex");
            // console.log(thestudent.mima)
            thestudent.save();
            callback("成功修改！请重新登录");
        }
    });
};



