/* 
	index.js 
	>>> control index page
*/

/*
url = "http://code.jquery.com/jquery-2.1.0.min.js";

function load_script(url, callback){
	var script = document.createElement('script');
	script.src = url;
	script.onload = callback;
	document.getElementByTagName('head')[0].appendChild(script);
}

(function(){
	var script = document.createElement('script');
	script.type = "text/javascript";
	script.charset = "utf-8";
	script.src = "http://code.jquery.com/jquery-2-1.0.min.js";
	document.getElementByTagName("head")[0].appendChild(script);
});
*/
$(document).ready(function(){
	var socket = io.connect('http://52.79.132.7:3000');

	$('#join_btn')
		.on('click', function(){
			var username = $('#username0').val(); 
			var password = $('#password0').val();
			var email = $('#email').val();
	
			var user_info0 = new Object();

			user_info0.username = username;
			user_info0.password = password;
			user_info0.email = email;

			alert("Loading...");

			socket.emit('join_msg', {username: user_info0.username, password: user_info0.password, email: user_info0.email});

			socket.on('join_res', function(data){
				
				if(data['response'] == 'true'){
					alert('회원가입이 완료 되었습니다.');
					$(location).reload();
				}else{
					alert('해당 아이디가 이미 있습니다.');
					$(location).reload();
				}
			});
		});

	$('#login_btn').on('click', function(){
			var username = $('#username').val();
			var password = $('#password').val();
			var main_page_url = "./main.html";
			
			var user_info = new Object();
		
			user_info.username = username;
			user_info.password = password;
			
			alert('loading...');

			socket.emit('login_msg', {username: user_info.username, password: user_info.password});
				
			socket.on('login_res', function(data){
					
				var user_id = user_info.username;

				if(data['response'] == "true"){
					alert(user_id + "님 space_log 세계에 오신 것을 환영합니다.");
					trans_username_value(user_id);
					$(location).attr('href', main_page_url);
				}else{
					alert("해당 아이디가 이미 있거나 비밀번호가 틀립니다. 다시 시도해 주세요.");
					$(location).reload();
				}
			});
		});
});

function trans_username_value(index_page_user_id){
	window.location.href = "main.html?username=" + index_page_user_id;
}

			
