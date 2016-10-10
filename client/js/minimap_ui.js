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
   var state = $('.minimap_ui').css('display');
   var minimap = document.getElementById('minimap_canvas');

   if(state == 'none')
   {
      // 만약 행성이라면, 빨간색 원 모양으로 그리기
	   // 만약 함선이라면, 노란색 또는 하얀색으로 그리기  
      $('.minimap_ui').show();
/*
      socket.planet.emit('ready', {'ready to draw minimap'});

      socket.planet.on('planet_res', function(data) {
         var planetPos = []; 
         var playerPos = [];
      });
*/
   }
   else
   {
      $('.minimap_ui').hide();
   }
}



