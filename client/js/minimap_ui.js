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

   minimapEnemy = enemy;
   console.log(minimapEnemy);

   menuSelectSound.src = "http://game.smuc.ac.kr:8000/res/sound/effect/menu_selection.wav";
   
   if(state === 'none')
   {
      menuSelectSound.play();
      menuSelectSound.currentTime = 0;

      $('#minimap_btn').css('background-color', 'rgba(255, 47, 77, 0.7)');
      $('#minimap_ui').show();

      // Initialized div tags

      $("#minimap_assets").append("<div id='minimap_" + user['name'] + "' style='position:absolute; width: 5px; height: 5px; background-color: rgba(255, 255, 0, 1);'></div>");

      $("#minimap_" + user['name']).css({
         'left' : Math.floor((user['x'] * 300) / 3500),
         'top'  : Math.floor((user['y'] * 300) / 3500) 
      });
/*      
      socket.userPos.on('login_all', function(data) {
       
         console.log("[CLIENT LOG] MINIMAP:", data.username, data.location_x, data.location_y);

         if(minimapEnemy[data.username] !== user['name']) 
         {
            $("#minimap_ui").append("<div id='minimap_" + minimapEnemy[data.username] + "' style='position:absolute; width: 5px; height: 5px; background-color: rgba(255, 255, 0, 0.7);'></div>");

            $("#minimap_" + minimapEnemy[data.username]).css({
                'left' : Math.floor((minimapEnemy[data.uesrname + "X"] * 300) / 3500),
                'top'  : Math.floor((minimapEnemy[data.username + "Y"] * 300) / 3500)
             });
         }
      });
*/
      socket.planet.emit('planet_req', {'ready' : 'ready to draw minimap'});

      socket.planet.on('planet_res', function(data) {
         assets.planet.x = data.location_x;
         assets.planet.y = data.location_y;

         // Not a received by the same tags.
         $("#minimap_assets").append("<div id='" + data.p_id + "' style='position: absolute; width: 3px; height: 3px; background-color: rgba(255, 255, 255, 0.7); left:" + Math.floor((assets.planet['x'] * 300) / 3500) + "px; top:" + Math.floor((assets.planet['y'] * 300) / 3500) + "px;'></div>");
      });


      socket.userPos.on('mv', function(data) {
          if(user['name'] === data['username'])
         {   
            assets.player.x = data.location_x;
            assets.player.y = data.location_y;
            
            $("#minimap_" + user['name']).css({
               'left' : Math.floor((assets.player.x * 300) / 3500),
               'top'  : Math.floor((assets.player.y * 300) / 3500)
            });
         }
         else if(minimapEnemy[data.username] !== user['name'])
         {
            $("#minimap_ui").append("<div id='minimap_" + minimapEnemy[data.username] + "' style='position:absolute; width: 5px; height: 5px; background-color: rgba(255, 255, 0, 0.7);'></div>");

            minimapEnemy[data.username + "X"] = data.location_x;
            minimapEnemy[data.username + "Y"] = data.location_y;

            $("#minimap_" + minimapEnemy[data.username]).css({
               'left' : Math.floor(((minimapEnemy[data.username + "X"]) * 300) / 3500),
               'top'  : Math.floor(((minimapEnemy[data.username + "Y"]) * 300) / 3500)
            });
            //$("#minimap_" + minimapEnemy[data.username]).detach();
         }
         else
         {
            console.log('[CLIENT LOG] MINIMAP:', data);
         }
      });

      socket.userInit.on('logout_all', function(data) {
         if(minimapEnemy[data.username] !== user['name'])
         {
            delete minimapEnemy[data.username];
            delete minimapEnemy[data.username + "X"];
            delete minimapEnemy[data.username + "Y"];
            //$("#minimap_" + minimapEnemy[data.username]).remove();
            $("#minimap_" + data['username']).remove();
         }
      });
   }
   else
   {
      menuSelectSound.play();
      menuSelectSound.currentTime = 0;
      $('#minimap_btn').css('background-color', 'rgba(0, 0, 0, 0.7)');
      $('#minimap_ui').hide();
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

