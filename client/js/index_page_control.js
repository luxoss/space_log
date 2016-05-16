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

<<<<<<< HEAD
  $('form').submit(function(){
    socket.connect('http://52.79.132.7:8888/login', {
      socket.emit('ip', {'username' : user_info['username'], 'password' : user_info['password']});
      location.href('../client/main.html');
    });
    /*
    socket.on('connect', function(){
=======
  socket.on('connect', function(data){
    $('login').click(function(){
        timeout: 3000;
        socket.emit('login_msg', {username : "user_info['username']", password : "user_info['password']"});
        location.href('../client/main.html');
>>>>>>> 78517eab7650bcf2d35cd4408d365e634bcf8af9
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
