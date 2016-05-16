/* Check some user information and enter the 'main page'*/
var username = document.getElementById('username').value;
var password = document.getElementById('password').value;
var user_info = new Object();

  // Create user_info obj and property that 'username and password'
user_info.username = username;
user_info.password = password;

$(document).ready(function(){
	$('#login')
		.on('click', function(){
			var socket = io('http://52.79.132.7:8888/login'); // Create obj io() in socket.io
			alert('click');
			socket.on('user_info', function(data){
				socket.emit('login_msg', {username : "user_info['username']", password : "user_info['password']"});
        			location.href('../client/main.html');
      			});
    		});
  });

// If u click 'join' button, use this function that 'push_user_info'
function push_user_info()
{
  location.reload();

  return ;
}
