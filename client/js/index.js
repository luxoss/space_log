/**
	** File-name: index.js
	** File-explanation: Contorl index html page with javascript
	** Author: luxoss 
*/
$(function() {  // Same to $(document).ready(function()) that is 'onload' 
   var userInfoSocket = io.connect('http://203.237.179.21:5001');  

   $(window).resize(function(){
      $('#main_container').css({position:'absolute'}).css({
	      left: ($(window).width() - $('#main_container').outerWidth()) / 2, 
	      top: ($(window).height() - $('#main_container').outerHeight()) / 2
      });
   }).resize();		

   $("#join_btn").on('click', function(){
      var user = {};

      user['name'] = $.trim($("#username").val());
      user['password'] = $.trim($("#password").val());

      if((user.name == '' ) || (user.password == '')) 
      {
         alert("아이디와 비밀번호를 입력해주세요.");
         window.location.reload();
      }
      else 
      {
         userInfoSocket.emit('join_msg', {    
            username: user.name, 
            password: user.password
         }); 

	      userInfoSocket.on('join_res', function(data){		
	         if(data.response == 'true') 
            {
               alert('회원가입이 완료 되었습니다.');
	            window.location.reload();
	         }
            else 
            {
               alert('해당 아이디가 이미 있습니다.');
               window.location.reload();
	         }
	      });
      }
   });

   $("#login_btn").on('click', function(userInfoSocket){ 
      var user = {};
      var mainPageUrl = './main.html';

      user.name = $.trim($('#username').val());
      user.password = $.trim($('#password').val());
 
      userInfoSocket.emit('login_msg', {
         username: user.name, 
         password: user.password
      });

      userInfoSocket.on('login_res', function(data){
         
         if(data.response == "true") 
         {
            alert(user['username'] + "님 space_log 세계에 오신 것을 환영합니다.");
            getUserItems(UserInfoSocket, user);		
            $(location).attr('href', mainPageUrl);
	      } 
         else 
         {
            alert("해당 아이디가 이미 있거나 비밀번호가 틀립니다. 다시 시도해 주세요.");
            window.location.reload();
         }
      });
   });

   $(document).keydown(function(ev){

      var keyCode = ev.keyCode;
			
      if(keyCode == 13) 
      {
         var user = {}; 		
         var mainPageUrl = './main.html';
        
		   user.name = $.trim($("#username").val());
	      user.password = $.trim($("#password").val());
			
	      alert('loading...');

	      userInfoSocket.emit('login_msg', {
            username: user['username'], 
            password: user['password']
         });
         
         userInfoSocket.on('login_res', function(data){                       
            if(data.response == "true") 
            {
               alert(user.username + "님 space_log 세계에 오신 것을 환영합니다!!");	       
               getUserItems(userInfoSocket, user);
               $(location).attr('href', mainPageUrl);
	         }
            else 
            {
	            alert("해당 아이디가 이미 있거나 비밀번호가 틀립니다. 다시 시도해 주세요.");
	            window.location.reload();
	         }
	      });
      }	
   });
});

function getUserItems(userInfoSocket, user) 
{
   if(!localStorage) 
   {
      alert("This browser isn't support localStorage.");
   }
   else 
   {	
      userInfoSocket.on('user_info', function(data) {
	      		
         if(data.username == user['username'])
         {
            user['username'] = data.username;
            user['exp'] = data.exp;
            user['hp'] = data.hp;
            user['mineral'] = data.mineral;
            user['gas'] = data.gas;
            user['unknown'] = data.unknown;
            user['x'] = data.location_x;
            user['y'] = data.location_y;

            localStorage.setItem('username', user['username']); 
            localStorage.setItem('exp', user['exp']);
            localStorage.setItem('hp', user['hp']);
            localStorage.setItem('mineral', user['mineral']);
            localStorage.setItem('gas', user['gas']);
            localStorage.setItem('unknown', user['unknown']);
            localStorage.setItem('x', user['x']);
            localStorage.setItem('y', user['y']);
         }
         else
         {
            console.log("[Client log] UserInfoSocket isn't available.");
         }
      });
   }
}

//TODO: Check 'join form '
function pwdCheck() 
{
	var pwd = $.trim($('#password').val());
	var check_pwd = $.trim($('#check_password').val());

	if(pwd === check_pwd) 
   {
		alert("회원가입이 완료되었습니다.");
      return true;
	}
   else 
   {
		alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return false;
	}
}



	
