/**
	**File-name: index.js
	**Writer: luxoss 
	**File-explanation: Contorl index html page with javascript
*/
$(function() {  // Same to $(document).ready(function()) that is 'onload' 
   var userInfoSocket = io.connect('http://203.237.179.21:5001');  
   var userInitInfo = {
      username : null,
      password : null, 
   };

   mainDisplayResize();
   //audioControl();

   $("#join_btn").on('click', function(userInitInfo){

      userInitInfo.username = $("#username").val();
      userInitInfo.password = $("#password").val();
			
      alert("Loading...");

      if((userInitInfo['username'] == "" ) || (userInitInfo['password'] == "")) 
      {
         alert("아이디와 비밀번호를 입력해주세요.");
         window.location.reload();
      }
      else 
      {
         userInfoSocket.emit('join_msg', {    
            username: userInitInfo.username, 
            password: userInitInfo.password 
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

   $("#login_btn").on('click', function(userInitInfo){ 
      var mainPageUrl = "./main.html";

      userInitInfo.username = $('#username').val();
      userInitInfo.password = $('#password').val();
      			
      alert('loading...');

      userInfoSocket.emit('login_msg', {
         username: userInitInfo.username, 
         password: userInitInfo.password
      });

      userInfoSocket.on('login_res', function(data){
         
         if(data.response == "true") 
         {
            alert(userInitInfo.username + "님 space_log 세계에 오신 것을 환영합니다.");
            getUserItems(userInitInfo);
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
         var username = $('#username').val();
         var password = $('#password').val();
         var mainPageUrl = "./main.html";
         var userInitInfo = {}; // Create user information obj		

		   userInitInfo.username = username;
	      userInitInfo.password = password;
			
	      alert('loading...');

	      userInfoSocket.emit('login_msg', {
            username: userInitInfo.username, 
            password: userInitInfo.password
         });
         
         userInfoSocket.on('login_res', function(data){
                       
            if(data.response == "true") 
            {
               alert(userInitInfo.username + "님 space_log 세계에 오신 것을 환영합니다.");
               getUserItems(userInitInfo);
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

function mainDisplayResize() 
{
   $(window).resize(function(){
      $('#main_container').css({position:'absolute'}).css({
	      left: ($(window).width() - $('#main_container').outerWidth()) / 2, 
	      top: ($(window).height() - $('#main_container').outerHeight()) / 2
      });
   }).resize();		
}

function getUserItems(userInitInfo) 
{
   if(!localStorage) 
   {
      alert("This browser isn't support localStorage.");
   }
   else 
   {	
      var getUserInfo = io.connect('http://203.237.179.21:8000:5001');

      getUserInfo.emit('user_info', {'ready' : "ready to get user status"});
      getUserInfo.on('user_info', function(data) {

         if(data.username == userInitInfo['name'])
         {
               userInitInfo.name = data.username
         //    userInitInfo.level = data.level;
               userInitInfo.exp = data.exp;
         //    userInitInfo.hp = data.hp;
               userInitInfo.mineral = data.mineral;
               userInitInfo.gas = data.gas;
               userInitInfo.unknown = data.unknown;
               userInitInfo.x = data.location_x;
               userInitInfo.y = data.location_y;

               localStorage.setItem('username', userInitInfo.name); 
               localStorage.setItem('exp', userInitInfo.exp);
               localStorage.setItem('mineral', userInitInfo.mineral);
               localStorage.setItem('gas', userInitInfo.gas);
               localStorage.setItem('unknown', userInitInfo.unknown);
               localStorage.setItem('x', userInitInfo.x);
               localStorage.setItem('y', userInitInfo.y);
         }
         else
         {
            alert('Not received data');
         }
      });
   }
}

//TODO: Check 'join form '
function pwdCheck() 
{
	var pwd = $('#password').val();
	var check_pwd = $('#check_password').val();

	if(pwd == check_pwd) 
   {
		alert("회원가입이 완료되었습니다.");
	}
   else 
   {
		alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
	}
}

function audioControl() 
{
   var audioSelector = $("#audio_control");
   var backgroundSound = new audio();
   
   audioSelector.click(function(audioSelector) {
      audioSelector.val();
   });
}


	
