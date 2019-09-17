var express    = require('express');
var mysql      = require('mysql');
var dbconfig   = require('./config/database.js');
var connection = mysql.createConnection(dbconfig);
var bodyParser = require('body-parser');
var http = require('http');


var app = express();
var router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('port', process.env.PORT || 33018);

app.get('/company', function(req, res){
	res.sendFile(__dirname + '/idx.html');
	
  var sql = 'DELETE FROM user_table WHERE company=?'; 
  var id = req.query.user_id;
  var pwd = req.query.user_pwd;
  
  console.log("body : ", req.query)
    connection.query(sql,id ,function(err, rows){
      if(err) console.log(err);

      
    });

});

app.post('/main', function(req, res){
  console.log('-------main--------');
  var companyTargetId =req.body.id;
  var companyTargetPw =req.body.pw;
  
  console.log("body:",req.body);
  //서버에서 confirm = 1 이고 해당 id의 pw가 일치할 때 가져오게 처리
  connection.query('SELECT confirm from user WHERE login_id=? and login_pw=?',[companyTargetId,companyTargetPw], function(err, rows) {
    if(err) throw err;
    console.log("body:",req.body);
    console.log("rows:",rows);
    //일치하는 쿼리값이 있을때
    if(rows[0]!=null && companyTargetId && companyTargetPw){ 
    
    //res.write(rows[0].confirm+"");
    res.write(rows[0].confirm+"");
  }
    
     // 없을 때
    else{
      res.write("");
    }
      
    res.end();
    
  });

});



app.post('/info', function(req, res){
	console.log('-------get--------');
  var companyTarget =req.body.company;
  var ct = "";
  console.log('typeof : ',typeof(companyTarget));
  console.log('companyTarget : ',companyTarget);
  connection.query('SELECT * from user_table WHERE company=?',companyTarget, function(err, rows) {
    if(err) throw err;
   
    
    var jsonDatas = JSON.stringify(rows);
        //문서 자체를 json 으로 보내는 방법
        res.writeHead(200,  //정상 응답
            { "Content-Type": "application/json;characterset=utf-8" }    //문서를 json 타입으로 보냄
        );
        res.write(jsonDatas);
        console.log('The solution is: ', jsonDatas);
        res.end();
  });

  //
   //res.end();

});



app.post('/user', function(req, res){
  	console.log('-------post--------');
  	
  	
  	
  	var post2  = {login_id: req.body.login_id, login_pw: req.body.login_pw,
      phone: req.body.phone,email: req.body.email,name: req.body.name};
    
  	connection.query('INSERT INTO user SET ?', post2, function(err, rows) {
    if(err) throw err;
    
  });

   res.write("post");
   res.end();

});

app.post('/viewUser', function(req, res){
  console.log('-------viewUser--------');
  var uid =req.body.login_id;
  var ct = "";
  
  connection.query('SELECT a.id,a.name,a.email,a.phone,a.ocassion,b.company,b.up_company from user a join company b on a.company_id = b.id ', function(err, rows) {

    if(err) throw err;

    console.log('body : ',req.body);
    console.log('row : ',rows);
         var jsonDatas = JSON.stringify(rows);
        //문서 자체를 json 으로 보내는 방법
        res.writeHead(200,  //정상 응답
            { "Content-Type": "application/json;characterset=utf-8" }    //문서를 json 타입으로 보냄
        );
        res.write(jsonDatas);
        console.log('The solution is: ', jsonDatas);
        res.end();
  });

});

app.post('/detailUser', function(req, res){
  console.log('-------detailUser--------');
  
  var targetId =req.body.id;
  console.log('body: ', req.body);
  console.log('targetId: ', targetId);
  connection.query('SELECT email,name,phone,ocassion from user WHERE id=?',targetId,function(err, rows) {
    if(err) throw err;
    
    console.log('row : ',rows);
         var jsonDatas = JSON.stringify(rows);
        //문서 자체를 json 으로 보내는 방법
        res.writeHead(200,  //정상 응답
            { "Content-Type": "application/json;characterset=utf-8" }    //문서를 json 타입으로 보냄
        );
        res.write(jsonDatas);
        console.log('The solution is: ', jsonDatas);
        res.end();
  });

});

app.post('/UpdateDetailUser', function(req, res){
  console.log('-------UpdateDetailUser--------');
  var uid = req.body.id;
  var post  =   {name: req.body.name ,phone:req.body.phone,
                  email:req.body.email, ocassion: req.body.ocassion
                  ,
                   confirm:req.body.confirm,
                   company_id:req.body.company_id 
                };
  
  connection.query('UPDATE user SET ? WHERE id=?',[post,uid],function(err, rows) {
    if(err) throw err;
    
  });
    res.end();

});

app.post('/UpdateDetailUsers', function(req, res){
  console.log('-------UpdateDetailUser--------');
  var uname = req.body.standard;
  var post  =   {name: req.body.name ,phone:req.body.phone,
                  email:req.body.email, ocassion: req.body.ocassion
                  ,
                   confirm:req.body.confirm,
                   company_id:req.body.company_id 
                };
  
  connection.query('UPDATE user SET ? WHERE id=?',[post,uname],function(err, rows) {
    if(err) throw err;
    
  });
    res.end();

});

app.post('/UpdateDetailCompany', function(req, res){
  console.log('-------UpdateDetailCompany--------');
  var company = req.body.standard;
  
  var post  =   {company: req.body.company , up_company:req.body.up_company};
  console.log('body : ',req.body)
  
  connection.query('UPDATE company SET ? WHERE company=?',[post,company],function(err, rows) {
    if(err) throw err;
    
  });
    res.end();

});

app.post('/editInfo', function(req, res){
  console.log('-------editInfo--------');
  var uid =req.body.login_id;
  var ct = "";
  console.log('body : ',req.body);
  connection.query('SELECT phone,email,name,login_pw from user WHERE login_id=?',uid, function(err, rows) {
    if(err) throw err;
    console.log('body : ',req.body);
    console.log('row : ',rows);
         var jsonDatas = JSON.stringify(rows);
        //문서 자체를 json 으로 보내는 방법
        res.writeHead(200,  //정상 응답
            { "Content-Type": "application/json;characterset=utf-8" }    //문서를 json 타입으로 보냄
        );
        res.write(jsonDatas);
        console.log('The solution is: ', jsonDatas);
        res.end();
  });

});

app.post('/selectCompany', function(req, res){
  console.log('-------selectCompany--------');
  
  connection.query('SELECT * from company', function(err, rows) {
    if(err) throw err;
    console.log('row : ',rows);
         var jsonDatas = JSON.stringify(rows);
        
        //문서 자체를 json 으로 보내는 방법
        res.writeHead(200,  //정상 응답
            { "Content-Type": "application/json;characterset=utf-8" }    //문서를 json 타입으로 보냄
        );
        res.write(jsonDatas);
        console.log('The solution is: ', jsonDatas);
        res.end();
  });

});

app.post('/companyInsert', function(req, res){

    console.log('-------companyInsert--------');
    console.log('body companyInsert:',req.body);
    var post2  = {company: req.body.company, up_company: req.body.up_company};
    
    connection.query('INSERT INTO company SET ?', post2, function(err, rows) {
    if(err) throw err;
      });  
   
   res.write("post");
   res.end();

});

app.post('/companyDelete', function(req, res){ 
    
console.log('-------companyDelete--------');
    //query delete
    var delInfo = req.body.delInfo;     
    console.log('body : ',req.body.delInfo);
    var sql = 'DELETE FROM company WHERE company=?'; 
    connection.query(sql, delInfo ,function(err, rows){
      if(err) console.log(err);

      //res.redirect('/user');
    });
    res.end();
});

app.post('/upCompanyDelete', function(req, res){ 
    
console.log('-------upcompanyDelete--------');
    //query delete
    var delInfo = req.body.delInfo;     
    console.log('body : ',req.body);
    var sql = 'DELETE FROM company WHERE up_company=?'; 
    connection.query(sql, delInfo ,function(err, rows){
      console.log("rows:",rows);
      if(err) console.log(err);

      //res.redirect('/user');
    });
    res.end();
});

app.post('/company', function(req, res){
  	
  	console.log('-------post--------');

    var companyTarget =req.body.cid;
  
  //console.log('req : ',req);
  connection.query('SELECT * from company_table WHERE id=?',companyTarget, function(err, rows) {
    if(err) throw err;
   
    
    var jsonDatas = JSON.stringify(rows);
        //문서 자체를 json 으로 보내는 방법
        res.writeHead(200,  //정상 응답
            { "Content-Type": "application/json;characterset=utf-8" }    //문서를 json 타입으로 보냄
        );
        res.write(jsonDatas);
        console.log('The solution is: ', jsonDatas);
        res.end();
  });  


  	
});



app.post('/companyUpdateTemp', function(req, res){ 
    res.write("companyUpdateTemp");
    res.end();
    
console.log('-------delete--------');
    
});

app.delete('/company', function(req, res){ 
    
});


app.put('/user', function(req, res){//update
  console.log('-------put--------',req.body);
  
  	var tid  = req.body.login_id;
  	var post  = {login_pw: req.body.login_pw ,phone:req.body.phone,
                  email:req.body.email, name: req.body.name};
  	console.log('query : ',req.body)
  connection.query('UPDATE user SET ? WHERE login_id=?',[post,tid],function(err, rows) {
    if(err) throw err;
      
        
    
  });
  res.write("post");
   res.end();//쿼리를 계속 보내기 위한 코드
});

app.post('/sessionUser', function(req, res){//update
  console.log('-------sessionUser--------',req.body);
  
    var tid  = req.body.login_id;
    var post  = {loginSessionId : tid};
    console.log('query : ',req.body)
  connection.query('UPDATE user SET ? WHERE login_id=?',[post,tid],function(err, rows) {
    if(err) throw err;
      
        
    
  });
  res.write("post");
   res.end();//쿼리를 계속 보내기 위한 코드
});


app.post('/selectSession', function(req, res){
  console.log('-------selectSession--------');
  var n = "n";
  connection.query('SELECT loginSessionId from user WHERE loginSessionId != ? ',[n] ,
    function(err, rows) {
    if(err) throw err;
    console.log('row : ',rows);
         
        
        //문서 자체를 json 으로 보내는 방법
        
        res.write(rows[0].loginSessionId);
        
        res.end();
  });

});


app.post('/sessionOut', function(req, res){//update
  console.log('-------sessionOut--------',req.body);
  
    var tid  = req.body.login_id;
    var post  = {loginSessionId : "n"};
    console.log('query : ',req.body)
  connection.query('UPDATE user SET ? WHERE login_id=?',[post,tid],function(err, rows) {
    if(err) throw err;
      
        
    
  });
  res.write("post");
   res.end();//쿼리를 계속 보내기 위한 코드
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
