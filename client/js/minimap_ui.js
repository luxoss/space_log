/**
	** File name: minimap_ui.js
	** File explanation: Control minimap canvas
   ** Author: luxoss
*/

// 행성 위치에 관한 목록을 소캣으로 받는다.
// 유저 위치에 관한 목록을 소캣으로 받는다. 

// 각각의 유저 요소와 행성요소를 그려주기위한 함수  
function drawMinimap(socket)
{
   // background width: 3500px, height: 3500px
   // canvas width: 250px = 3500 / x = 12, height: 250px = 3500 / y = 12
   var state = $('.minimap_ui').css('display');
   var menuSelectSound = new Audio();
   var minimap = document.getElementById('minimap_canvas');

   menuSelectSound.src = "http://game.smuc.ac.kr:8000/res/sound/effect/menu_selection.wav";

   if(state == 'none')
   {
      // 만약 행성이라면, 빨간색 원 모양으로 그리기
	   // 만약 함선이라면, 노란색 또는 하얀색으로 그리기  
      menuSelectSound.play();
      menuSelectSound.currentTime = 0;
      $('.minimap_ui').show();
  
      if(minimap.getContext) 
      {
         var ctx = minimap.getContext('2d');
         var planet = {  // width: 64px, height: 64px
            x : 0,
            y : 0
         };
         var player = {  // width: 100px, height: 100px;
            x : 0,
            y : 0
         };
         socket.planet.emit('planet_req', {'ready' : 'ready to draw minimap'});

         socket.planet.on('planet_res', function(data) {
            planet.x = data.location_x;
            planet.y = data.location_y;

            ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
            ctx.beginPath();
            //TODO: Diff result that between minimap planet arc and main_display
            ctx.arc(parseInt((planet['x']/12)), parseInt((planet['y']/12)), 2, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
         });
        /* 
         socket.userPos.on('mv', function(data) {
            if(user['name'] == data['username'])
            {
               ctx.fillStyle = "rgb(255, 255, 0)";
               ctx.fillRect(user['x'], user['y'], width, height);
            }
            else
            {
               ctx.fillStyle = "rgb(0, 0, 0)";
               ctx.fillRect(data['location_x'], data['location_y'], width, height); 
            }
         });
         */
      }    
   }
   else
   {
      menuSelectSound.play();
      menuSelectSound.currentTime = 0;
      $('.minimap_ui').hide();
   }
}



