/**
	** File name: minimap_ui.js
	** File explanation: Control minimap canvas
   ** Author: luxoss
*/

// 각각의 유저 요소와 행성요소를 그려주기위한 함수  
function drawMinimap(socket)
{
   // background width: 3500px, height: 3500px
   // canvas width: 300px = 3500px / x, height: 250px = 3500px / y
   var state = $('.minimap_ui').css('display');
   var menuSelectSound = new Audio();
   //var minimap = document.getElementById('minimap_canvas');

   menuSelectSound.src = "http://game.smuc.ac.kr:8000/res/sound/effect/menu_selection.wav";

   if(state == 'none')
   {
      // 만약 행성이라면, 빨간색 원 모양으로 그리기
	   // 만약 함선이라면, 노란색 또는 하얀색으로 그리기  
      menuSelectSound.play();
      menuSelectSound.currentTime = 0;
      $('.minimap_ui').show();

      var assets = {
         planet : { // { width : 64px, height: 64px }
            x : 0, 
            y : 0
         },
         player : { // { width : 100px, height: 100px; }
            x : 0, 
            y : 0
         }, 
         enemy : {
            x : 0, 
            y : 0
         }
      };
      
      // Initialized div tags
      //$("#minimap_" + user['name']).detach();
      $(".minimap_ui").empty();

      $(".minimap_ui").append("<div id='minimap_" + user['name'] + "' style='position:absolute; width: 5px; height: 5px; background-color: rgba(255, 255, 0, 0.7);'></div>");

      $("#minimap_" + user['name']).css({
         'left' : Math.floor((user['x'] * 300) / 3500),
         'top'  : Math.floor((user['y'] * 300) / 3500) 
      });

      socket.planet.emit('planet_req', {'ready' : 'ready to draw minimap'});

      socket.planet.on('planet_res', function(data) {
         console.log(data.location_x, data.location_y);
         assets.planet.x = data.location_x;
         assets.planet.y = data.location_y;

         // Not a received by the same tags.
         $(".minimap_ui").append("<div style='position: absolute; width: 3px; height: 3px; background-color: rgba(255, 255, 255, 0.7); left:" + Math.floor((assets.planet['x'] * 300) / 3500) + "px; top:" + Math.floor((assets.planet['y'] * 300) / 3500) + "px;'></div>");
     
      });

      socket.userPos.on('mv', function(data) {

         if(user['name'] == data['username'])
         {
            assets.player.x = data.location_x;
            assets.player.y = data.location_y;
            
            $("#minimap_" + user['name']).css({
               'left' : Math.floor((assets.player.x * 300) / 3500),
               'top'  : Math.floor((assets.player.y * 300) / 3500)
            });
            // overlab append  => Not a catch tail game.
            //$(".minimap_ui").append("<div id='minimap_" + user['name'] + "' style='position: absolute; width: 2px; height: 2px; background-color: rgba(255, 255, 0, 0.7); left:" + Math.floor((assets.player['x'] * 300) / 3500) + "px; top:" + Math.floor((assets.player['y'] * 300) / 3500) + "px;'></div>");    
         }
         else
         {
            //TODO: 1. 서버에서 값이 들어온다면, 그 값을 확인하여 기존의 값과 같은지 판별한다.
            //      2. 값이 같으면 추가 태깅을 하지 않고, 다르다면 해당 값만 변경해주는 것으로 끝낸다.
            $(".minimap_ui").append("<div id='minimap_" + data['username'] + "' style='position:absolute; width: 5px; height: 5px; background-color: rgba(0, 255, 0, 0.7);'></div>");
      
            assets.enemy.x = data.location_x;
            assets.enemy.y = data.location_y;
            
            $("minimap_" + data['username']).css({
               'left' : Math.floor((assets.enemy.x * 300) / 3500),
               'top'  : Math.floor((assets.enemy.y * 300) / 3500)
            });
         }         
      });
   }
   else
   {
      menuSelectSound.play();
      menuSelectSound.currentTime = 0;
      $('.minimap_ui').hide();
   }
}


/* 
if(minimap.getContext) 
{
      var ctx = minimap.getContext('2d');

      //TODO: Create planet with canvas.
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(Math.floor((assets.planet['x'] * 300) / 3500), Math.floor((assets.planet['y'] * 300) / 3500), 2, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();

      //TODO: Create player with canvas. 
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.arc(parseInt((assets.player['x'] / 12)), parseInt((assets.player['y'] / 12)), 2, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();

      //TODO: Create enemy with canvas.
      ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
      ctx.arc(parseInt((assets.enemy['x'] / 12)), parseInt((assets.enemy['y'] / 12)), 2, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
}      
*/

