var express=require("express");
var cont=require("./c/cont.js");
var session = require('express-session');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Hotel');
var app=express();
app.set("view engine","ejs");
app.use(express.static("public"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
//首页
app.get("/",cont.showIndex);//首页展示

//客户页面
app.get("/kehu",cont.showKehu)//客户页面展示
app.get("/Kehuleibie",cont.Kehuleibie)//客户页面房间类别渲染
app.get("/Kehushuliang/:id",cont.Kehushuliang)//客户页面剩余房间数量与价钱的渲染
app.post("/Adddingdan",cont.Adddingdan);//保存客人预订的房间的信息
app.post("/updataDingdan/",cont.updataDingdan);//客户预定成功后修改剩余数量
app.get("/kuhufind",function(req,res){
    res.render("kehuFind.ejs")
});//打开客户查询页面
app.get("/xiugaiyuding:dianhua",cont.xiugaiyuding);//打开客户修改预订信息页面
app.post('/xiugaiyuding/', cont.Updataxiugaiyuding);///修改完预订信息后提交

// 管理员登录页面
app.get("/Inlogin",cont.Inlogin);//进入登录页
app.post("/checklogin",cont.checklogin);//检测登录
app.get("/Gindex",cont.showGindex);//管理员登录进入的首页

//《！---   进入订单入住页面   ---》
app.get("/showDingdanRuzhu",function(req,res){
    res.render("DingdanRuzhu.ejs",{
        "result": req.session.yonghuming
    })
});
app.get("/DingdanRuzhu:leibie",cont.DingdanFanghao);//渲染订单入住的房号
app.get("/DingdanYuding:name",cont.DingdanYuding);//渲染订单入住页面提前预定的数据
app.post("/doDingdanRuzhu",cont.doDingdanRuzhu)//点击办理入住，保存数据
app.post("/changeZhuangtai",cont.changeZhuangtai)//点击办理入住，改变状态值
app.delete('/DelectDingdanxinxi/:dianhua', cont.DelectDingdanxinxi);//删除预订的数据


//《！---   进入大堂入住页面   ---》
app.get("/showDatangRuzhu",function(req,res){
    res.render("DatangRuzhu.ejs",{
        "result": req.session.yonghuming
    })
});
app.get("/xuanranfangjianxinxi/:leibie",cont.xuanranfangjianxinxi)//渲染房间信息


//《！--   进入退房页面   --》
app.get("/showTuifang",function(req,res){
    res.render("Tuifang.ejs",{
        "result": req.session.yonghuming
    })
});
app.get("/RuzhuchaxunFH:fanghao",cont.RuzhuchaxunFH); //退房页面入住消息查询;
app.post("/changeTzhuangtai",cont.changeTzhuangtai); //点击退房后改变状态;
app.delete('/DelectRuzhujilu/:fanghao', cont.DelectRuzhujilu);//删除退出房间的数据
app.post("/addShengyushu",cont.addShengyushu)//退出成功后剩余数加加


//《！---  /进入入住记录查询页面 ---》
app.get("/showRuzhu",function(req,res){
    res.render("Ruzhu.ejs",{
        "result": req.session.yonghuming
    })
});
app.get("/Ruzhuxuanran",cont.Ruzhuxuanran); //渲染所有的入住记录;
app.post("/Ruzhuchaxun",cont.Ruzhuchaxun); //入住消息查询;


//《！---  进入房间管理页面 ---》
app.get("/showFangjian",function(req,res){
    res.render("Fangjian.ejs",{
        "result": req.session.yonghuming
    })
});
app.propfind('/checkfanghao/:id', cont.checkfanghao);//检测是否有该用户
app.get("/Allfangjian",cont.Allfangjian);//得到房间所有数据
app.post("/Allfangjian",cont.doAddfangjian);//添加房间
app.delete('/Fangjian/:fanghao', cont.deletefangjian);//删除房间
app.post('/fj/', cont.updatefangjian);///房间修改
app.get('/Fangjian/:fanghao', cont.findFanghao);//通过id找要修改的数据
app.get("/findAllFanghao",cont.findAllFanghao);//寻找所有的房号

//《！---    进入房间类别管理   ---》
app.get("/Gleibie",cont.showGleibie);
app.propfind('/checkleibie/:id', cont.checkleibie);//检测是否有该用户
app.get("/Allleibie",cont.getAllleibie);//得到房间类别所有数据
app.post("/Allleibie",cont.doAddleibie);//添加房间类别管理
app.delete('/Gleibie/:leibie', cont.deleteYuangong);//删除类别
app.post('/gfdh/', cont.updateYuangong);///类别修改
app.get('/Gleibie/:leibie', cont.detailed);//通过id找要修改的数据



//《！---  进入修改密码页 ---》
app.get("/showchangepw",function(req,res){
      res.render("changpw.ejs",{
    "result": req.session.yonghuming
    })
})
app.post("/changepw",cont.changepw)//修改密码

app.get ("/*",cont.show404);            //404页面

app.listen(3000);
console.log("当前端口号为3000!");