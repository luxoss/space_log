/**
	*File-name: index.js
	*Writer: luxoss 
	*Modified date: 07/16/2016  
*/
(function(){ // Create Immediately-invoked function expression
	$(document).ready(function(){ // Jquery ready to document
		var socket = io.connect('http://203.237.179.21:5001');
	
		mainDisplayResize();


//		$(".input_text").focus().css('background', "rgb('255, 255, 255')");
//		$(".input_text").blur().css('background', "rgb('23, 25, 25')");

		$("#join_btn").on('click', function(){
				var username = $('#username').val(); 
				var password = $('#password').val();
				var user_info0 = {};

				user_info0.username = username;
				user_info0.password = password;
			
				alert("Loading...");

				if((user_info0.username == " " ) && (user_info0.password == " ") && (user_info0.email == " "))
				{
					alert("아이디와 비밀번호를 입력해주세요.");
					window.location.reload();
				}
				else
				{
					socket.emit('join_msg', {username: user_info0.username, password: user_info0.password }); // Send to server
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
			var key_code = ev.keyCode;
			
			if(key_code == 13){
				var username = $('#username').val();
				var password = $('#password').val();
				var main_page_url = "./main.html";
				var user_info = {}; // Create user information obj		
		
				user_info.username = username;
				user_info.password = password;
			
				alert('loading...');

				socket.emit('login_msg', {username: user_info.username, password: user_info.password});
				
				socket.on('login_res', function(data){
					
					var user_id = user_info.username;

					if(data['response'] == "true")
					{
						alert(user_id + "님 space_log 세계에 오신 것을 환영합니다.");
						usernameValue(user_id);
						$(location).attr('href', main_page_url);
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
				var main_page_url = "./main.html";
				var user_info = {}; // Create user information obj		
		
				user_info.username = username;
				user_info.password = password;
			
				alert('loading...');

				socket.emit('login_msg', {username: user_info.username, password: user_info.password});
				
				socket.on('login_res', function(data){
					
					var user_id = user_info.username;

					if(data['response'] == "true")
					{
						alert(user_id + "님 space_log 세계에 오신 것을 환영합니다.");
						usernameValue(user_id);
						$(location).attr('href', main_page_url);
					}
					else
					{
						alert("해당 아이디가 이미 있거나 비밀번호가 틀립니다. 다시 시도해 주세요.");
						$(location).reload();
					}
				});
		});
	
		/*
			socket.on('myinfo', function(data){
				data.username;
				user_info.exp = data.exp;
				user_info.mineral = data.mineral;
				user_info.gas = data.gas;
				user_info.unknown = data.unknown;
				user_info.pos_x = data.location_x;
				user_info.pos_y = data.location_y;
				console.log('exp: ' + user_info.exp + '\n');
				console.log('mineral: ' + user_info.mineral + '\n');
				console.log('gas: ' + user_info.gas + '\n');
				console.log('unknown: ' + user_info.unknown + '\n');
				console.log('x: ' + user_info.pos_x + '\n');
				console.log('y: ' + user_info.pos_y + '\n');
			});
		*/
	
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

	function usernameValue(user_value)
	{
		if(!localStorage)
		{
			alert("This browser isn'y support localStorage.");
		}
		else
		{	
			localStorage.setItem('username', user_value);
		}	
		return ; 
	}
/*	
	function pwdCheck() // 회원가입 폼 따로 나뉘어야 할 때 그 페이지에서 쓸 함수 미리 작성 
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
