/**
	**File-name: index.js
	**Writer: luxoss 
	**File-explanation: Contorl index html page with javascript
*/
(function(){ // Create Immediately-invoked function expression
	$(document).ready(function(){ 						// Jquery ready to document
		var socket = io.connect('http://203.237.179.21:5001'); 		// Create join and login socket
		var userInfoSocket = io.connect('http://203.237.179.21:5003'); 	// Create user information socket
//		mainAudioControl();
		mainDisplayResize();

		$("#join_btn").on('click', function(){
				var username = $('#username').val(); 
				var password = $('#password').val();
				var userInfo0 = {};

				userInfo0.username = username;
				userInfo0.password = password;
			
				alert("Loading...");

				if((userInfo0.username == " " ) && (userInfo0.password == " "))
				{
					alert("아이디와 비밀번호를 입력해주세요.");
					window.location.reload();
				}
				else
				{
					socket.emit('join_msg', {username: userInfo0.username, password: userInfo0.password }); // Send to server
					socket.on('join_res', function(data){ // Receive to server
				
						if(data['response'] == 'true')
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

		$(document).keydown(function(ev){

			var keyCode = ev.keyCode;
			
			if(keyCode == 13)
			{
				var username = $('#username').val();
				var password = $('#password').val();
				var mainPageUrl = "./main.html";
				var userInfo = {}; // Create user information obj		
		
				userInfo.username = username;
				userInfo.password = password;
			
				alert('loading...');

				socket.emit('login_msg', {username: userInfo.username, password: userInfo.password});
				
				socket.on('login_res', function(data){
					
					var userId = userInfo.username;

					if(data['response'] == "true")
					{
						alert(userId + "님 space_log 세계에 오신 것을 환영합니다.");
						usernameValue(userId);
						$(location).attr('href', mainPageUrl);
					}
					else
					{
						alert("해당 아이디가 이미 있거나 비밀번호가 틀립니다. 다시 시도해 주세요.");
						$(location).reload();
					}
				});
			}
		});

		$("#login_btn").on('click', function(){ 

			var username = $('#username').val();
			var password = $('#password').val();
			var mainPageUrl = "./main.html";
			var userInfo = {}; // Create user information obj		
		
			userInfo.username = username;
			userInfo.password = password;
			
			alert('loading...');

			socket.emit('login_msg', {username: userInfo.username, password: userInfo.password});
				
			socket.on('login_res', function(data){
					
				var userId = userInfo.username;

				if(data['response'] == "true")
				{
					alert(userId + "님 space_log 세계에 오신 것을 환영합니다.");

					usernameValue(userId);

					$(location).attr('href', mainPageUrl);
				}
				else
				{
					alert("해당 아이디가 이미 있거나 비밀번호가 틀립니다. 다시 시도해 주세요.");
					$(location).reload();
				}
			});
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
		
		return ;
	}

	function usernameValue(userValue)
	{
		if(!localStorage)
		{
			alert("This browser isn'y support localStorage.");
		}
		else
		{	
/*	
			// TODO: { Code line explanation } User information received to server
			// (Resource, Initialize postion, Level, and so on)' to server
			userInfoSocket.on('myinfo', function(data){

				var userInitInfo = {};

				userInitInfo.level = data.level;
				userInitInfo.exp = data.exp;
				userInitInfo.mineral = data.mineral;
				userInitInfo.gas = data.gas;
				userInitInfo.unknown = data.unknown;
				userInitInfo.pos_x = data.location_x;
				userInitInfo.pos_y = data.location_y;
			
				console.log('level: ' + userInitInfo.level);
				console.log('exp: ' + userInitInfo.exp);
				console.log('mineral: ' + userInitInfo.mineral);
				console.log('gas: ' + userInitInfo.gas);
				console.log('unknown: ' + userInitInfo.unknown);
				console.log('x: ' + userInitInfo.posX);
				console.log('y: ' + userInitInfo.posY);

			});
*/			
			localStorage.setItem('username', userValue);
/*			
			// TODO: { Code line explanation } Some user initialize information saved by localstorage
			localStorage.setItem('level', userInitInfo.level);
			localStorage.setItem('exp', userInitInfo.exp);
			localStorage.setItem('mineral', userInitInfo.mineral);
			localStorage.setItem('gas', userInitInfo.gas);
			localStorage.setItem('unknown', userInitInfo.unknown);
 			localStorage.setItem('posX', userInitInfo.posX);
			localStorage.setItem('posY', userInitInfo.posY);
*/
		}	
	}
/*	
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
		return ;
	}
*/
})();			
