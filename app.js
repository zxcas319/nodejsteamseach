var express = require('express');
var app = express();
var morgan = require('morgan');
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

 var connection = mysql.createConnection ({
    host : 'localhost',
    port : '3306',
    user : 'sichan',
    password : '123456',
    database : 'hrsystem'

  });

  app.use(morgan('combined'))

  app.post('/login', function(req, res){
 // console.log('-------login--------');

  var user_number =req.body.user_number;
  var user_pw =req.body.user_pw;
  var tempconfirm;
  var admin;


  
 
  //서버에서 confirm = 1 이고 해당 id의 pw가 일치할 때 가져오게 처리
   connection.query('SELECT confirm from user WHERE user_number=? and user_pw=?',[user_number, user_pw], function(err, rows) {
    if(err) throw err;
    
    console.log("body:",req.body);
    console.log("rows:",rows);
    //일치하는 쿼리값이 있을때
    tempconfirm = rows[0].confirm;

});

      //tempconfirm = rows[0].confirm;
      console.log("tempconfirm:",tempconfirm);

        if(tempconfirm==0){
        res.write("로그인을 다시 해주세요")

        }    

         if(tempconfirm==1){
          var post1  = {admin: 0 
          };
          connection.query('UPDATE user SET ? WHERE id=?',[post1,user_number],function(err, rows) {
          if(err) throw err;
          console.log("rows tempconfirm=1 ping1");
          res.write("등록되지 않은 정보입니다. ")
          
        });
        } 
        if(tempconfirm==2){
          var post1  = {admin: 1 
          };
          connection.query('UPDATE user SET ? WHERE id=?',[post1,user_number],function(err, rows) {
         console.log("rows tempconfirm=2 ping2"); 
         if(err) throw err;
          
         });
        }
        
       
    
    res.end();
  })

app.listen(3000, () => {
  console.log(" Server is listening on 3000")
})
