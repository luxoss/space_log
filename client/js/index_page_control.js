/* Check some user information and enter the 'main page'*/
function connect_main_display()
{
  var socket = io();

  socket.on('emmit msg', function(data){
    addMessage(data.mssage);

    socket.emit('client', {data: 'grouping', id: data.id, password: data.password});
  });

  socket.on('time', function(data){
    addMessage(data.time);
  });

  socket.on('error', console.error.bind(console));
  socket.on('message', console.log.bind(console));


  return ;
}


function push_user_info()
{

}
