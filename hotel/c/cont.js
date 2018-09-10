var formidable = require("formidable");
var crypto = require('crypto');
var url = require("url");
var user = require("../m/user.js");
var leibie = require("../m/leibie.js");
var yuding = require("../m/Kyuding.js");
var fangjian = require("../m/fangjian.js");
var ruzhu = require("../m/ruzhu.js");
<!--     进入首页    -->
exports.showIndex=function(req,res){
   res.render("index.ejs");
};
<!--     进入客户页面   -->
exports.showKehu=function(req,res){
    res.render("kehu.ejs")
};
//渲染房间类别
exports.Kehuleibie=function(req,res){
    leibie.find({},function(err,doc){
        res.json({"leibie":doc})
    })
};
//渲染剩余数量与价钱
exports.Kehushuliang=function(req,res){
    var str=req.params.id;
    // console.log(str)
    leibie.find({"mingcheng":str},function(err,data){
        // console.log(data)
        res.json({"s":data})
    })
};
//保存用户在预定房间的信息
exports.Adddingdan=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        yuding.addYuding(fields, function (result) {
            res.json({"result": result});
        });
    });
};
//预定成功后修改数据库里的
exports.updataDingdan=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        // console.log(fields)
        leibie.find({"mingcheng":fields.leixing},function (err,data) {
            if (data.length==0){
                res.json({"s":-1});
            }
            var result = data[0];
            var num=result.shengyu-fields.yudingshu;
            result.leibie = result.leibie;
            result.mingcheng =  result.mingcheng;
            result.mianji =  result.mianji;
            result.shengyu = num;
            result.chuangwei = result.chuangwei;
            result.zaocan = result.zaocan;
            result.wangluo = result.wangluo;
            result.dianshi = result.dianshi;
            result.jiage = result.jiage;
            result.shuliang = result.shuliang;
            // console.log(result.shengyu)
            var s=new leibie(result);
            s.save(function (err,data) {
                if (err){
                    res.json({"s":-1});
                    return;
                }
                res.json({"s":1});
                return;
            })
        })
    })
};
// 修改预定的信息
exports.xiugaiyuding=function(req,res){
  var  dianhua=req.params.dianhua;
  yuding.find({"dianhua":dianhua},function(err,doc){
      res.render("kehuxiugai.ejs",{
         "data":doc
      })
  })
};
//提交修改后的数据
exports.Updataxiugaiyuding=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        // console.log(fields)
        yuding.find({"dianhua":fields.dianhua},function (err,data) {
            if (data.length==0){
                res.json({"s":-1});

            }
            // console.log(data);
            var result = data[0];
            result.ruzhu = fields.ruzhu;
            result.lidian = fields.lidian;
            result.leixing = fields.leixing;
            result.shengyu = fields.shengyu;
            result.jiaiqian = fields.jiaqian;
            result.yudingshu = fields.yudingshu;
            result.xingming = fields.xingming;
            result.lianxiren = fields.lianxiren;
            result.dianhua = fields.dianhua;
            result.liuyan = fields.liuyan;
            // var result=new leibie(result);
            result.save(function (err,data) {
                if (err){
                    res.json({"s":-1})
                    return;
                }
                res.json({"s":1})
                return;
            })
        })
    })
};

<!--     进入管理员登陆页     -->
exports.Inlogin = function (req, res) {
    res.render("login.ejs");
};
// 检测是否登录成功
exports.checklogin = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
// console.log(fields)
        var yonghuming = fields.yonghuming;
        var mima = fields.mima;
        user.allUser(yonghuming, function (err, doc) {
            // console.log(doc)
            if (doc.length == 0) {
                res.json({"result": -1});
                return;
            };
            if (crypto.createHash("sha256").update(mima).digest("hex") === doc[0].mima) {

                req.session.login = 1;
                req.session.yonghuming = yonghuming;
                res.json({"result": 1});
                return;
            } else {
                res.json({"result": -2});
                return;
            }
        })
    })
};
// 管理员登录进入的首页
exports.showGindex=function(req,res){
  res.render("Gindex.ejs",{
      "result": req.session.yonghuming
  });
};


// 《！---  大堂入住  --》
//渲染房间信息
exports.xuanranfangjianxinxi = function (req, res) {
    var id = req.params.leibie;
    // console.log(id)
    leibie.find({"mingcheng": id}, function (err, results) {
        // console.log(results)
        if (err || results.length == 0) {
            res.json({"s": -1});
            return;
        }
        res.json({"s": results[0]})
    })
};


// 《！-- 订单入住页  --》
//渲染订单入住页面的房间号
exports.DingdanFanghao=function(req,res){
    var leibie=req.params.leibie;
     fangjian.find({"leibie":leibie},function(err,doc){
         res.json({"data":doc})
     })
};
//订单入住客户预定的数据渲染
exports.DingdanYuding=function(req,res){
    var name=req.params.name;
    yuding.find({"xingming":name},function(err,doc){
        // console.log(doc)
        if(doc.length==0){
           res.json({"data":-1})
            return
        }
      res.json({"data":doc})
    })
};
//订单入住办理入住成功后保存数据
exports.doDingdanRuzhu=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        // console.log(fields)
        ruzhu.addYuangong(fields, function (result) {
            res.json({"result": result});
            // console.log(result)
        });
    });
};
//办理入住之后改变房间管理的入住状态
exports.changeZhuangtai=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        // console.log(fields)
        fangjian.find({"fanghao":fields.fanghao},function (err,data) {
            if (data.length==0){
                res.json({"s":-1});
            }
            // console.log(data);
            var result = data[0];
            result.fanghao = result.fanghao;
            result.leibie = result.leibie;
            result.weizhi = result.weizhi;
            result.miaoshu =  result.miaoshu;
            result.zhuangtai = 1;
            // var result=new leibie(result)
            // console.log(result)
            result.save(function (err,data) {
                if (err){
                    res.json({"s":-1})
                    return;
                }
                res.json({"s":1})
                return;
            })
        })
    })
};
//点击入住后在预订中删除
exports.DelectDingdanxinxi=function(req,res){
    //拿到学号
    var id = req.params.dianhua;
    // console.log(id)
    //寻找这个学号的学生
    yuding.find({"dianhua": id}, function (err, results) {
        if (err || results.length == 0) {
            res.json({"result": -1});
            return;
        }
        //删除
        results[0].remove(function (err) {
            if (err) {
                res.json({"result": -1});
                return;
            }
            res.json({"result": 1});
        });
    });
};


// 《！----退房管理----！》
//查询房号数据渲染
exports.RuzhuchaxunFH=function(req,res){
    var txt=req.params.fanghao;
    // console.log(txt);
    ruzhu.find({"fanghao":txt},function(err,data){
        // console.log(data)
        if(data.length==0){
            res.json({"result":-1});
            return;
        }
        res.json({"result":data});
    })
};
//点击退房后改变状态值
exports.changeTzhuangtai=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        fangjian.find({"fanghao":fields.fanghao},function (err,data) {
            if (data.length==0){
                res.json({"s":-1});
            }
            var result = data[0];
            result.fanghao = result.fanghao;
            result.leibie = result.leibie;
            result.weizhi = result.weizhi;
            result.miaoshu =  result.miaoshu;
            result.zhuangtai = 0;
            result.save(function (err,data) {
                if (err){
                    res.json({"s":-2})
                    return;
                }
                res.json({"s":1})
                return;
            })
        })
    })
}
//点击退房后在入住记录中删除
exports.DelectRuzhujilu=function(req,res){
    //拿到学号
    var id = req.params.fanghao;
    // console.log(id)
    //寻找这个学号的学生
    ruzhu.find({"fanghao": id}, function (err, results) {
        if (err || results.length == 0) {
            res.json({"result": -1});
            return;
        }
        //删除
        results[0].remove(function (err) {
            if (err) {
                res.json({"result": -1});
                return;
            }
            res.json({"result": 1});
        });
    });
};
//退房成功后修改数据库里房间的剩余数量
exports.addShengyushu=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        // console.log(fields)
        leibie.find({"mingcheng":fields.leixing},function (err,data) {
            if (data.length==0){
                res.json({"s":-1});
            }
            var result = data[0];
            var num=result.shengyu+1;
            result.leibie = result.leibie;
            result.mingcheng =  result.mingcheng;
            result.mianji =  result.mianji;
            result.shengyu = num;
            result.chuangwei = result.chuangwei;
            result.zaocan = result.zaocan;
            result.wangluo = result.wangluo;
            result.dianshi = result.dianshi;
            result.jiage = result.jiage;
            result.shuliang = result.shuliang;
            // console.log(result.shengyu)
            var s=new leibie(result);
            s.save(function (err,data) {
                if (err){
                    res.json({"s":-1});
                    return;
                }
                res.json({"s":1});
                return;
            })
        })
    })
};



//《!--     入住记录查询      --》
//渲染所有的入住信息
exports.Ruzhuxuanran=function(req,res){
    var page = url.parse(req.url, true).query.page - 1 || 0;
    var pagesize = 5;
    fangjian.count({}, function (err, count) {
        ruzhu.find({}).limit(pagesize).skip(pagesize * page).exec(function (err, result) {
            res.json({
                "pageAmount": Math.ceil(count / pagesize),
                "result": result
            })
        })
    })
};
//查询联系人数据渲染
exports.Ruzhuchaxun=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        // console.log(fields);
        ruzhu.find({"xingming":fields.xingming,"ruzhu":fields.rz,"lidian":fields.ld},function(err,data){
            if(data.length==0){
                res.json({"result":-1});
                return
            }
            res.json({"result":data});
        })
    });
};


//《!--     房间管理      --》
// 得到所有房间
exports.Allfangjian= function (req, res) {
    var page = url.parse(req.url, true).query.page - 1 || 0;
    var pagesize = 5;
    fangjian.count({}, function (err, count) {
        fangjian.find({}).limit(pagesize).skip(pagesize * page).exec(function (err, result) {
            res.json({
                "pageAmount": Math.ceil(count / pagesize),
                "result": result
            })
        })
    })
};
//检测是否有改房间号
exports.checkfanghao=function(req,res){
    var id = req.params.id;
    fangjian.checkId(id, function (torf) {
        res.json({"result": torf});
    })
}
//添加房间
exports.doAddfangjian = function (req, res) {
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        fangjian.addYuangong(fields, function (result) {
            res.json({"result": result});
        });
    });
};
//修改房间
exports.updatefangjian=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        // console.log(fields)
        fangjian.find({"fanghao":fields.fanghao},function (err,data) {
            if (data.length==0){
                res.json({"s":-1});

            }
            // console.log(data);
            var result = data[0];
            result.fanghao = fields.fanghao;
            result.leibie = fields.leibie;
            result.weizhi = fields.weizhi;
            result.miaoshu = fields.miaoshu;
            result.zhuangtai = fields.zhuangtai;
            var result=new leibie(result)
            result.save(function (err,data) {
                if (err){
                    res.json({"s":-1})
                    return;
                }
                res.json({"s":1})
                return;
            })
        })
    })
};
//通过id找要修改的数据
exports.findFanghao = function (req, res) {
    var id = req.params.fanghao;
    fangjian.find({"fanghao": id}, function (err, results) {
        if (err || results.length == 0) {
            res.json({"s": -1});
            return;
        }
        res.json({"s": results[0]})
    })
};
//删除房间
exports.deletefangjian = function (req, res) {
    //拿到学号
    var id = req.params.fanghao;
    //寻找这个学号的学生
    fangjian.find({"leibie": id}, function (err, results) {

        if (err || results.length == 0) {
            res.json({"result": -1});
            return;
        }
        //删除
        results[0].remove(function (err) {
            if (err) {
                res.json({"result": -1});
                return;
            }
            res.json({"result": 1});
        });
    });
};
// 寻找所有的房号
exports.findAllFanghao=function(req,res){
   fangjian.find({},function(err,doc){
       res.json({"data":doc})
   })
};




<!--      房间类别       -->
exports.showGleibie=function(req,res){
    res.render("Gleibie.ejs",{
        "result": req.session.yonghuming
    });
};
//检测是否有该类别号
exports.checkleibie=function(req,res){
    var id = req.params.id;
    leibie.checkId(id, function (torf) {
        res.json({"result": torf});
    })
}
// 得到所有房类
exports.getAllleibie= function (req, res) {
    var page = url.parse(req.url, true).query.page - 1 || 0;
    var pagesize = 5;
    leibie.count({}, function (err, count) {
        leibie.find({}).limit(pagesize).skip(pagesize * page).exec(function (err, result) {
            res.json({
                "pageAmount": Math.ceil(count / pagesize),
                "result": result
            })
        })
    })
};
//添加房类
exports.doAddleibie = function (req, res) {
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        fields.shengyu=fields.shuliang;
        leibie.addYuangong(fields, function (result) {
            res.json({"result": result});
        });
    });
};
//修改房类
exports.updateYuangong=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        // console.log(fields)
        leibie.find({"leibie":fields.leibie},function (err,data) {
            if (data.length==0){
                res.json({"s":-1});

            }
            // console.log(data);
            var result = data[0];
            result.leibie = fields.leibie;
            result.mingcheng = fields.mingcheng;
            result.mianji = fields.mianji;
            result.chuangwei = fields.chuangwei;
            result.zaocan = fields.zaocan;
            result.wangluo = fields.wangluo;
            result.dianshi = fields.dianshi;
            result.jiage = fields.jiage;
            result.shuliang = fields.shuliang;
            result.shengyu = fields.shuliang;
            var result=new leibie(result)
            // console.log(result)
            result.save(function (err,data) {
                if (err){
                    res.json({"s":-1})
                    return;
                }
                res.json({"s":1})
                return;
            })
        })
    })
};
//通过id找要修改的数据
exports.detailed = function (req, res) {
    var id = req.params.leibie;
    // console.log(id)
    leibie.find({"leibie": id}, function (err, results) {
        // console.log(results)
        if (err || results.length == 0) {
            res.json({"s": -1});
            return;
        }
        res.json({"s": results[0]})
    })
};
//删除房类
exports.deleteYuangong = function (req, res) {
    //拿到学号
    var id = req.params.leibie;
    //寻找这个学号的学生
    leibie.find({"leibie": id}, function (err, results) {

        if (err || results.length == 0) {
            res.json({"result": -1});
            return;
        }
        //删除
        results[0].remove(function (err) {
            if (err) {
                res.json({"result": -1});
                return;
            }
            res.json({"result": 1});
        });
    });
};


//《！--  修改密码  --》
exports.changepw = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        // console.log(fields)
        user.changepw(fields.guanliyuan, fields.mima,function(info){
            //将回调函数显示的信息，原封不动呈递给Ajax接口，会被jQuery alert出来。
            res.end(info);
        });
    });
}


//显示404
exports.show404 = function(req,res){
    res.status(404).send("没有这个页面，请检查网址！");
};