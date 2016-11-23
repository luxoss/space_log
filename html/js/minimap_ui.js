/**
	** File name: minimap_ui.js
	** File explanation: Control minimap canvas
   ** Author: luxoss
*/

// 각각의 유저 요소와 행성요소를 그려주기위한 함수  
function drawMinimap(user, enemy, socket)
{
   // background width: 3500px, height: 3500px
   // canvas width: 300px = 3500px / x, height: 250px = 3500px / y
   var state = $('#minimap_ui').css('display');
   var menuSelectSound = new Audio();
   var minimapEnemy = {};
   var assets = {
      planet : { // { width : 64px, height: 64px }
         x : 0, 
         y : 0
      },
      player : { // { width : 100px, height: 100px; }
         x : 0, 
         y : 0
      }, 
   };
   // Caching the jquery selector 
   var minimapBtn = $("#minimap_btn");
   var mainDisplayWidth = 5000, mainDisplayHeight = 5000;

   minimapEnemy = enemy;

   menuSelectSound.src = "http://game.smuc.ac.kr/res/sound/effect/menu_selection.wav";
   
   if(state === 'none')
   {
      socket.planet.connect();

      menuSelectSound.play();
      menuSelectSound.currentTime = 0;

      $("#minimap_btn").css('background-color', 'rgba(255, 47, 77, 0.7)');
      $("#minimap_ui").show();

      // Initialized div tags
      //$("#minimap_assets").detach();

      $("#minimap_assets").append("<div id='minimap_" + user['name'] + "'></div>");

      $("#minimap_" + user['name']).css({
         'background-color' : 'rgba(255, 255, 0, 1)',
         'position' : 'absolute',
         'width'    : '5px',
         'height'   : '5px',
         'left' : Math.floor((user['x'] * 300) / mainDisplayWidth),
         'top'  : Math.floor((user['y'] * 300) / mainDisplayHeight) 
      });

      socket.planet.emit('planet_req', {'ready' : 'ready to draw minimap'});

      socket.planet.on('planet_res', function(data) {

         assets.planet.x = parseInt(data.location_x, 10);
         assets.planet.y = parseInt(data.location_y, 10);
         // Not a received by the same tags.
         $("#minimap_assets").append("<div id='minimap_" + data.p_id + "' style='position: absolute; width: 3px; height: 3px; background-color: rgba(255, 255, 255, 0.7); left:" +  ((assets.planet['x'] * 300) / mainDisplayWidth) + "px; top:" + ((assets.planet['y'] * 300) / mainDisplayHeight) + "px;'></div>");
        
      });

      socket.userPos.on('mv', function(data) {

         if(user['name'] === data['username'])
         {   
            assets.player.x = data.location_x;
            assets.player.y = data.location_y;
            
            $("#minimap_" + user['name']).css({
               'left' : Math.floor((assets.player.x * 300) / mainDisplayWidth),
               'top'  : Math.floor((assets.player.y * 300) / mainDisplayHeight)
            });
         }         
         else if(minimapEnemy[data.username] !== user['name'])
         {
            minimapEnemy[data.username + "X"] = data.location_x;
            minimapEnemy[data.username + "Y"] = data.location_y;

            $("#minimap_ui").append("<div id='minimap_" + minimapEnemy[data.username] + "'></div>");

            minimapEnemy[data.username + "X"] = data.location_x;
            minimapEnemy[data.username + "Y"] = data.location_y;

            $("#minimap_" + enemy[data.username]).css({
               'background-color' : 'rgba(0, 255, 0, 0.7)',
               'position'         : 'absolute',
               'width'            : '5px',
               'height'           : '5px',
               'left' : Math.floor(((minimapEnemy[data.username + "X"]) * 300) / mainDisplayWidth),
               'top'  : Math.floor(((minimapEnemy[data.username + "Y"]) * 300) / mainDisplayHeight)
            });
         }
         else
         {
            console.log(data);
         }
      });

      socket.userInit.on('logout_all', function(data) {
         if(minimapEnemy[data.username] !== user['name'])
         {
            delete minimapEnemy[data.username];
            delete minimapEnemy[data.username + "X"];
            delete minimapEnemy[data.username + "Y"];
            $("#minimap_" + user['name']).remove();
         }
      });
   }
   else
   {
      menuSelectSound.play();
      menuSelectSound.currentTime = 0;

      $("#minimap_btn").css('background-color', 'rgba(0, 0, 0, 0.7)');
      $("#minimap_ui").hide();
      
      socket.planet.disconnect();
   }
}
