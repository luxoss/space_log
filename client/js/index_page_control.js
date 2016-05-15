/* Check some user information and enter the 'main page'*/
var socket = io.connect('http://52.79.132.7:8888/login'); // Create global obj io() in socket.io

function connect_main_display()
{
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var user_info = new Object();

  // Create user_info obj and property that 'username and password'
  user_info.username = username;
  user_info.password = password;

  socket.on('connect', function(data){
    $('login').submit(function(){
        timeout: 3000;
        socket.emit('login_msg', {'username' : user_info['username'], 'password' : user_info['password']});
        location.href('../client/main.html');
    });
  });

  // If dissconn this page, u can see the msg 'dissconnected'
  socket.on('disconnect', function(){
    alert('Dissconnected!');
  });

  // Error handling
  socket.on('connect_error', function(err){
    alert('connect error!!!', err);
  });
}

// If u click 'join' button, use this function that 'push_user_info'
function push_user_info()
{
  location.reload();

  return ;
}
