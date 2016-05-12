/* Check some user information and enter the 'main page'*/
function connect_main_display()
{
  var socket = new io.Socket(); // Create socket
  var username = document.getElementById('username');
  var password = document.getElementById('password');
  var user_info = new Object();

  // Create user_info obj and property that 'username and password'
  user_info.username = username.value;
  user_info.password = password.value;

  // Connect socket 'http://52.79.132.7:8888'
  socket.connect('http://52.79.132.7:8888', {
    timeout: 3000
  });

  // Send to msg 'user_info'
  socket.on('connect', function(){
    socket.emit('message', user_info);
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

}
