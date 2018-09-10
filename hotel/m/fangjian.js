var mongoose = require('mongoose');

var yuangongSchema = new mongoose.Schema({
    fanghao: Number ,
    leibie: String,
    weizhi:String,
    miaoshu:String,
    zhuangtai:String,
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

var Yuangong = mongoose.model("fangjian",yuangongSchema);
module.exports = Yuangong;