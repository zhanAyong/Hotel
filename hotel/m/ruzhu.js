var mongoose = require('mongoose');

var yuangongSchema = new mongoose.Schema({
    dingdanhao: Number ,
    ruzhu: String,
    lidian:String,
    leixing:String,
    yudingshu:Number,
    shengyu:Number,
    xingming:String,
    xingbie:String,
    lianxiren:String,
    dianhua:Number,
    liuyan:String,
    jiaqian:Number,
    fanghao:Number,
    zhengjian:String,
    zhengjianhao:Number,
});
yuangongSchema.statics.findName=function(callback){
    this.find({},function(err,result){
        callback(err,result);
    });
}
yuangongSchema.statics.checkId=function(leibie,callback){
    // console.log(leibie)
    this.find({"fanghao":leibie},function(err,result){
        // console.log(result)
        callback(result.length==0);
    });
}
yuangongSchema.statics.addYuangong=function(json,callback){
    Yuangong.checkId(json.fanghao,function(torf){
        if(torf){
            var s=new Yuangong(json);
            s.save(function(err){
                if(err){
                    callback(-2);
                    return;
                }
                callback(1);
            })
        }else{
            callback(-1);
        }
    })
};

var Yuangong = mongoose.model("ruzhu",yuangongSchema);
module.exports = Yuangong;