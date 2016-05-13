/* Check some user information and enter the 'main page'*/
function connect_main_display()
{
  var socket = io(); // Create socket
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var user_info = new Object();

  // Create user_info obj and property that 'username and password'
  user_info.username = username;
  user_info.password = password;

  $('form').submit(function(){
    socket.connect('http://52.79.132.7:8888/login', {
      timeout: 3000;
      socket.emit('message', {'username' : user_info['username'], 'password' : user_info['password']});
      location.href('../client/main.html');
    });
    /*
    socket.on('connect', function(){
    });
    */
  });


  // If dissconn this page, u can see the msg 'dissconnected'
  socket.on('disconnect', function(){
    alert('Dissconnected!');
  });

  // Error handling
  socket.on('connect_error', function(err){
    alert('connect error!!!', err);
  });

  return ;
}

// If u click 'join' button, use this function that 'push_user_info'
function push_user_info()
{
  location.reload();

  return ;
}
