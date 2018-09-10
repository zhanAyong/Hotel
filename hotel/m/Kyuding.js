var mongoose = require('mongoose');

var yuangongSchema = new mongoose.Schema({
    ruzhu: String ,
    lidian: String,
    leixing:String,
    shengyu:Number,
    jiaqian:Number,
    yudingshu:Number,
    xingming:String,
    lianxiren:String,
    dianhua:Number,
    liuyan:String,
});

yuangongSchema.statics.checkId=function(leibie,callback){
    // console.log(leibie)
    this.find({"leibie":leibie},function(err,result){
        // console.log(result)
        callback(result.length==0);
    });
}
yuangongSchema.statics.addYuding=function(json,callback){
    Yuangong.checkId(json.leixing,function(torf){
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

var Yuangong = mongoose.model("yuding",yuangongSchema);
module.exports = Yuangong;