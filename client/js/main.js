/**
   ** File name: main.js
   ** File explanation: Control main html page with javascript and Jquery	
   ** Author: luxoss
*/

//TODO: http://203.237.179.21 have to change that 'game.smuc.ac.kr' 
var serverUrl = "http://203.237.179.21";
var indexPageUrl = serverUrl + ":8000";
var socket = {
   userInit : io.connect(serverUrl + ":5001"),
   userInfo : io.connect(serverUrl + ":5005"),
   userPos : io.connect(serverUrl + ":5006"),
   planet : io.connect(serverUrl + ":5002")
};
var user = {
       name : localStorage.getItem('username'),
          x : parseInt(localStorage.getItem('x')),
          y : parseInt(localStorage.getItem('y')),
   resource : {
      mineral : parseInt(localStorage.getItem('mineral')),
          gas : parseInt(localStorage.getItem('gas')),
      unknown : parseInt(localStorage.getItem('unknown'))
   },
   state : {
        exp : parseInt(localStorage.getItem('exp')),
        hp : parseInt(localStorage.getItem('hp'))
   }
};
var lastPosX = 0, lastPosY = 0;		    
var enemyPosX = 0, enemyPosY = 0;	// Create enemy x, y position
var isKeyDown = [];		            // Create key state array to keyboard polling  
var fire = new Audio();
var discovered = new Audio();
var menuSelection = new Audio();

fire.src = serverUrl + ":8000/res/sound/effect/laser.wav";
discovered.src = serverUrl + ":8000/res/sound/effect/kkang.mp3";
menuSelection.src = serverUrl + ":8000/res/sound/effect/menu_selection.wav";

$(document).ready(function(){ // onload document 
   viewPort();
   drawAllAssets("main_layer", user, socket); 		
   keyHandler(user, socket);
   userPosUpdate(user); 
});

function viewPort() 
{	
   /*
   $(window).resize(function() {
      $("#main_layer").css({
         left: ($(window).width() - $("#main_layer").outerWidth()) / 2,
         top : ($(window).height() - $("#main_layer").outerHeight()) / 2
      });
   }).resize();
   */
   $(window).resize(function() {
      $("#view_layer").css({
         width: ($(window).width() - 200), 
         height: ($(window).height() - 100) 
      });

      $('#view_layer').css({
         left: ($(window).width() - $('#view_layer').outerWidth()) / 2,
         top: ($(window).height() - $('#view_layer').outerHeight()) / 2
      });
   }).resize();
}

function drawAllAssets(mainLayer, user, socket) 
{
   var userId = user['name'];
   var hp = user.state['hp'];
   var exp = user.state['exp'];
   var mineral = user.resource['mineral'];
   var gas = user.resource['gas'];
   var unknown = user.resource['unknown'];
   var ENTER = 13;
   var image = {
      clnt  : "url('http://203.237.179.21:8000/res/img/space_ship1_up.svg')",
      other : "url('http://203.237.179.21:8000/res/img/space_ship2_up.svg')"
   };
   
   console.log("[CLIENT LOG]", userId, "is login.");
   console.log(
      "[CLIENT LOG] username:", userId, 
      "hp:", hp, "exp:", exp, 
      "mineral:", mineral, "gas:", gas, "unknown:", unknown
   );                
/* 
   socket.userPos.emit('init_press_key', {
      'username' : user['name'],
      'location_x' : user['x'],
      'location_y' : user['y'],
      'key_val' : ENTER
   });
 
   socket.userPos.on('init_mv', function(data) {
      console.log("[Client log] At first, user position socket is received by server");

      if(data.username == user['name'])
      {
         console.log(
            "[Client log :: Code line 86] username: ", data.username,
            ",x: ", data.location_x, ",y: ", data.location_y
         );

         user['x'] = parseInt(data.location_x);
         user['y'] = parseInt(data.location_y);

         $("#main_layer").append(
            "<div id='" + user['name'] + "' style='position: absolute;'></div>"
         );

         $("#" + data['name']).css({
            "backgroundImage" : image.clnt,
            left : user['x'],
            top : user['y']
         });
      }
      else
      {
         console.log(
            "[Client log]", data.username, "'s login."
         );
         
         enemyPosX = parseInt(data.location_x);
         enemyPosY = parseInt(data.location_y);

         $("#main_layer").append(
            "<div id='" + data.username + "' style='position: absolute;'></div>"
         );

         $("#" + data.username).css({
            "backgroundImage" : image.other,
            left : enemyPosX,
            top : enemyPosy
         });
      }
   });
*/
   socket.planet.emit('planet_req', {'ready' : 'Ready to draw planets'});

   socket.planet.on('planet_res', function(data) {
      drawPlanetImg(mainLayer, data);
   });		
        
   $("#mineral").text(mineral);
   $("#gas").text(gas);
   $("#unknown").text(unknown);
   $("#position_x").text(user['x']);
   $("#position_y").text(user['y']);
   $("#hp_progress_bar").text(hp + " / 300");

   $("#user_avartar").append(
      "<div id='" + userId + "'style='position:absolute; bottom:0px; color:white;'>" 
      + user['name'] + "</div>"
   );
   $("#user_name").text(userId);
	
   $("#main_layer").append("<div id='" + userId + "' style='position:absolute;'></div>");
   $("#" + userId).append(
      "<div style='position:absolute; bottom: 0px; color: white; font-weight: bold;'>" 
      + userId + "</div>"
   );
   $("#" + userId).append(
      "<div id='" + userId + "_laser" + "' style='position:absolute;'></div>"
   );

   $("#" + userId).css({
      "backgroundImage" : image['clnt'],
      "width"  : "64px",
      "height" : "64px",
      "zIndex" : "2",
      left: user['x'], 
      top: user['y']
   });

   // Auto focus user's battleship
   var offset = $("#" + userId).offset();

   $("html, body").animate({
      scrollLeft: offset.left - ($(window).width() / 2), 
      scrollTop: offset.top - ($(window).height() / 2)  
   }, 1000);
}

// 생성된 행성들을 메인 화면 내에 뿌려주기 위한 함수
function drawPlanetImg(mainLayer, data) 
{
   var planet = {
      id : "planet" + data.p_id,
      x  : data.location_x,
      y  : data.location_y,
      grade : data.create_spd,
      mineral : data.mineral,
      gas : data.gas,
      unknown : data.unknown,
      image : { 
         1 :  "url('http://203.237.179.21:8000/res/img/planet/planet_5.png')",
         2 :  "url('http://203.237.179.21:8000/res/img/planet/planet_7.png')",
         3 :  "url('http://203.237.179.21:8000/res/img/planet/planet_9.png')",
         4 :  "url('http://203.237.179.21:8000/res/img/planet/planet_11.png')",
         5 :  "url('http://203.237.179.21:8000/res/img/planet/planet_12.png')"
      }
   };
	
   if(planet.grade == 0)
   {
      $("#" + mainLayer).append("<div id='" + planet['id'] + "' style='position: absolute;'></div>");	

      $("#" + planet['id']).css({
         "backgroundImage" : planet.image['1'],
         "width"  : "100px",
         "height" : "100px",
         left: planet['x'],
         top: planet['y']
      });
      
      $("#" + planet['id']).append(
         "<div style='position:absolute; bottom:0px; color:yellow; font-weight:bold;'>" 
         + planet['id'] + "</div>"
      );
   }
   
   if(planet.grade == 1) 
   {
      $("#" + mainLayer).append("<div id='" + planet['id'] + "' style='position: absolute;'></div>"); 

      $("#" + planet['id']).css({
         "backgroundImage" : planet.image['2'],
         "width"  : "100px",
         "height" : "100px",
         left: planet['x'],
         top: planet['y']
      });

      $("#" + planet['id']).append(
         "<div style='position:absolute; bottom:0px; color:yellow; font-weight:bold;'>" 
         + planet['id'] + "</div>"
      );
   }
   
   if(planet.grade == 2) 
   {
      $("#" + mainLayer).append("<div id='" + planet['id'] + "' style='position: absolute;'></div>"); 

      $("#" + planet['id']).css({
         "backgroundImage" : planet.image['3'],
         "width"  : "100px",
         "height" : "100px",
         left: planet['x'],
         top: planet['y']
      });

      $("#" + planet['id']).append(
         "<div style='position:absolute; bottom:0px; color:yellow; font-weight:bold;'>" 
         + planet['id'] + "</div>"
      );
   }
   
   if(planet.grade == 3)
   {
      $("#" + mainLayer).append("<div id='" + planet['id'] + "' style='position: absolute;'></div>"); 

      $("#" + planet['id']).css({
         "backgroundImage" : planet.image['4'],
         "width"  : "100px",
         "height" : "100px",
         left: planet['x'],
         top: planet['y']
      });

      $("#" + planet['id']).append(
         "<div style='position:absolute; bottom:0px; color:yellow; font-weight:bold;'>" 
         + planet['id'] + "</div>"
      );
   }
   
   if(planet.grade == 4) 
   {
      $("#" + mainLayer).append("<div id='" + planet['id'] + "' style='position: absolute;'></div>");	

      $("#" + planet['id']).css({
         "backgroundImage" : planet.image['5'],
         "width"  : "100px",
         "height" : "100px",
         left: planet['x'],
         top: planet['y']
      });

      $("#" + planet['id']).append(
         "<div style='position:absolute; bottom:0px; color:yellow; font-weight:bold;'>" 
         + planet['id'] + "</div>"
      );
   }
}

function keyHandler(user, socket) 
{
   var userId = user['name'];
   var bg = {
      x : function(divId, position) {
         if(position) 
         {
            return $("#" + divId).css("left", position);
         }
         else
         {
            return parseInt($("#" + divId).css("left"));
         }
      },
      y : function(divId, position) {
         if(position)
         {
            return $("#" + divId).css("top", position);
         }
         else
         {
            return parseInt($("#" + divId).css("top"));
         }
      }
   };

   $(document).keydown(function(ev) {  
   
      keyController(ev, user, socket);
      btnControl(ev, user, socket);
      //isKeyDown[ev.keyCode] = true;
   });

   $(document).keyup(function(ev) {
      //isKeyDown[ev.keyCode] = false;
   });
   
   $('#logout_btn').on('click', function(){	
      if(userId != null) 
      {
         logout(userId, lastPosX, lastPosY);
      }
      else 
      {
         alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
         $(location).attr('href', indexPageUrl);	
      }
   });	

   $('#planet_btn').on('click', function() {
      menuSelection.play();
      menuSelection.currentTime = 0;
      planetViewLayer(socket['planet']);
   });

   $('#battle_ship_btn').on('click', function() {
      menuSelection.play();
      menuSelection.currentTime = 0;
      battleShipViewLayer();
   });

   $('#rank_btn').on('click', function() {
      menuSelection.play();
      menuSelection.currentTime = 0;
      rankViewLayer();
   });
/*
   $('#minimap_btn').on('click', function() {      
   });
*/
}

function keyController(ev, user, socket) 
{
   var speed = 4;
   var keyState = ev.keyCode;
   var SHOOT = 83, DEVELOP_PLANET = 32;
   var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
   //var laserX = 0, laserY = 0;

   if(ev.keyCode == LEFT)
      {
         bg.x("main_layer", bg.x("main_layer") + speed);
         //bg.x("view_layer", bg.x("view_layer") - speed);

         socket.userPos.emit('press_key', {
            'username': userId, 
            'key_val' : LEFT, 
            'location_x' : user['x'],
            'location_y' : user['y']
         });
      }

      if(ev.keyCode == UP)
      {
         bg.y("main_layer", bg.y("main_layer") + speed);
         //bg.y("view_layer", bg.y("view_layer") - speed);

         socket.userPos.emit('press_key', {
            'username': userId, 
            'key_val' : UP, 
            'location_x' : user['x'],
            'location_y' : user['y']
         });
      }

      if(ev.keyCode == RIGHT)
      {
         bg.x("main_layer", bg.x("main_layer") - speed);
         //bg.x("view_layer", bg.x("view_layer") + speed);

         socket.userPos.emit('press_key', {
            'username': userId, 
            'key_val' : RIGHT, 
            'location_x' : user['x'],
            'location_y' : user['y']
         });
      }

      if(ev.keyCode == DOWN)
      {
         bg.y("main_layer", bg.y("main_layer") - speed);
         //bg.y("view_layer", bg.y("view_layer") + speed);


         socket.userPos.emit('press_key', {
            'username': userId, 
            'key_val' : DOWN, 
            'location_x' : user['x'],
            'location_y' : user['y']
         });
      }


   if(keyState == SHOOT) // press shoot key(s), iskeyDown[83]
   {
      fire.play();
      console.log('fire!');
      fire.currentTime = 0;      
      //shoot(curPosX, curPosY);	
   }

   if(keyState == DEVELOP_PLANET) // press space key, isKeyDown[32]
   {
      // 함선이 행성과 충돌하지 않을 시에는 스페이스 바를 비활성화 시킨다.
      // 함선이 행성과 충돌하였을 시에 스페이스 바를 활성화 시킨다.
      discovered.play();
      discovered.currentTime = 0;

      console.log('got a planet');

      socket.userPos.emit('collision_req', {'ready' : 'ready to develop planet!'});

      socket.userPos.on('collision_res', function(data) {
         if(data.develop == 'false')
         {
            //아래 함수 안에서 해당 뷰에 관한 컨트롤 및 개발 / 취소 버튼을 눌렀을 시의 이벤트 처리
            //planetInfoView();
            console.log(
               "planet id:", data.p_id, "x:", data.location_x, "y:", data.location_y, 
               "develop:", data.develop
            );
         }
/*
            $(window).resize(function() {
               $("#develop_planet_ui").css({
                  left: ($(window).width() - $("#develop_planet_ui").outerWidth()) / 2,
                  top: ($(window).height() - $("#develop_planet_ui").outerHeight()) / 2
               });
            }).resize();
         

         if(data.develop == 'true')
         {
            // 함선에 관한 정보와 개발할 것인지 아닌지를 묻는 창을 띄우고 개발하면
            // 그 데이터를 서버에 보내고 내 자원 정보를 갱신한다.
         }
*/
      });
   }
}

function btnControl(ev, user, socket) 
{
   var keyState = ev.keyCode;
   var SHOOT = 83, GOT_PLANET = 32, 
       BATTLESHIP_BTN = 66, MINIMAP_BTN = 77, PLANET_BTN = 80, LOGOUT_BTN = 81, RANK_BTN = 82;
   var userId = user['name'];
 
   lastPosX = user['x'];
   lastPosY = user['y'];

   if(keyState == BATTLESHIP_BTN) // press battle ship menu button, isKeyDown[66]
   {
      menuSelection.play();
      menuSelection.currentTime = 0; 	  
      battleShipViewLayer();
   }

   if(keyState == PLANET_BTN) // press planet menu button, isKeyDown[80]
   {
      menuSelection.play();
      menuSelection.currentTime = 0;
      planetViewLayer(socket['planet']);
   }

   if(keyState == RANK_BTN) // press rank menu button, isKeyDown[82]
   {
      menuSelection.play();
      menuSelection.currentTime = 0;
      rankViewLayer();
   }

   if(keyState == MINIMAP_BTN) // press minimap display button, isKeyDown[77]
   {
      drawMinimap(socket);
   }

   if(keyState == LOGOUT_BTN) // press logout(q), isKeydown[81]
   {
      if(userId != null) 
      {
         logout(userId, lastPosX, lastPosY);
      }
      else 
      {
         alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
         $(location).attr('href', 'http://203.237.179.21:8000');	
      }
   }
}

function logout(userId, lastPosX, lastPosY) 
{
   var logoutMsg = confirm('로그아웃 하시겠습니까?');
   var LOGOUT = 81;

   if(logoutMsg == true) 
   {
      socket.userInit.emit('logout_msg', { 'username': userId, 'key_val' : LOGOUT }); 

      socket.userInit.on('logout_res', function(data) {
          
         if(data.response == 'true') 
         {
            socket.userInfo.emit('lpos', {
               'username': userId, 
               'lastPosX': lastPosX, 
               'lastPosY': lastPosY
            }); 
           
            $("#" + userId).remove();

            localStorage.removeItem('username');
            localStorage.removeItem('exp');
            localStorage.removeItem('hp');
            localStorage.removeItem('mineral');
            localStorage.removeItem('gas');
            localStorage.removeItem('unknown');
            localStorage.removeItem('x');
            localStorage.removeItem('y'); 

            console.log("[Client log]", userId, "is logout!"); 

            alert(userId + '님께서 로그아웃 되셨습니다.');
            $(location).attr('href', 'http://203.237.179.21:8000');
         }
         else
         {
            console.log("[ERROR] LOGOUT.");
         }
      });
   }
}

function userPosUpdate(user)
{
   var userId = user['name'];
   var imgSprite = {
      player : { 
         LEFT : "url('http://203.237.179.21:8000/res/img/space_ship1_left.svg')",
         RIGHT: "url('http://203.237.179.21:8000/res/img/space_ship1_right.svg')",
         UP   : "url('http://203.237.179.21:8000/res/img/space_ship1_up.svg')",
         DOWN : "url('http://203.237.179.21:8000/res/img/space_ship1_down.svg')"
      },
      others : {
         LEFT : "url('http://203.237.179.21:8000/res/img/space_ship2_left.svg')",
         RIGHT: "url('http://203.237.179.21:8000/res/img/space_ship2_right.svg')",
         UP   : "url('http://203.237.179.21:8000/res/img/space_ship2_up.svg')",
         DOWN : "url('http://203.237.179.21:8000/res/img/space_ship2_down.svg')"
     } 
   }; 

   socket.userPos.on('mv', function(data) { // userStatus is 'object type'
      var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40; 
      var keyValue = data.key_val;
      
      // TODO:  여기서 실행하면 키 입력 값을 받을 때 마다 appendChild를 하므로 같은 테그들이 생겨남
      //        따라서 초기화 시에 접속한 모든 사람의 데이터를 받아 appendChild를 한 번 해주고 
      //        위치 변경 시 각각의 css style만 바꿔야 함.
      if(userId === data['username'])  
      {
         console.log(
            "[Client log] ", data['username'],
            ",x: ", data['location_x'], ",y: ", data['location_y'],
            ",key_value: ", data['key_val']
         );

         switch(keyValue)
         {
            case LEFT: 	           
               $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.LEFT,
 		            left: user['x'], 
		            top: user['y']
	            });

               user['x'] = parseInt(data.location_x);
	            user['y'] = parseInt(data.location_y);
              
               $("#position_x").text(user['x']);
               $("#position_y").text(user['y']);

               //bg.x("main_layer", bg.x("main_layer") + 10);

               if(user['x'] <= 0) 
               {
                  user['x'] = 0;
                  user['y'] = parseInt(data.location_y);
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.LEFT,
 		              left: user['x'], 
		              top: user['y']
	               }); 
               }
	            break;

 	         case RIGHT:
	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.RIGHT,
 	 	            left: user['x'], 
	               top: user['y']
	            });

	            user['x'] = parseInt(data.location_x);
	            user['y'] = parseInt(data.location_y);
               
               $("#position_x").text(user['x']);
               $("#position_y").text(user['y']);

               //bg.x("main_layer", bg.x("main_layer") - 10);

               if(user['x'] >= 3430) 
               {
                  user['x'] = 3430;
                  user['y'] = parseInt(data.location_y);
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.RIGHT,
 		              left: user['x'], 
		              top: user['y']
	               }); 
               }
	            break;
				
	         case UP:
	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.UP,
		            left: user['x'], 
		            top: user['y']
	            });

	            user['x'] = parseInt(data.location_x);
	            user['y'] = parseInt(data.location_y);

               $("#position_x").text(user['x']);
               $("#position_y").text(user['y']);

               //bg.y("main_layer", bg.y("main_layer") + 10);

               if(user['y'] <= 0) 
               {
                  user['x'] = parseInt(data.location_x);
                  user['y'] = 0
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.UP,
 		              left: user['x'], 
		              top: user['y']
	               }); 
               }
              	break;
				
	         case DOWN:
	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.DOWN,
		            left: user['x'], 
		            top: user['y']
	            });

               user['x'] = parseInt(data.location_x);
	            user['y'] = parseInt(data.location_y);

               $("#position_x").text(user['x']);
               $("#position_y").text(user['y']);

               //bg.y("main_layer", bg.y("main_layer") - 10);

               if(user['y'] >= 3430) 
               {
                  user['x'] = parseInt(data.location_x);
                  user['y'] = 3430;
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.DOWN,
 		              left: user['x'], 
		              top: user['y']
	               }); 
               }
               break;
				
            default:
	            break;
         }
      }
      else 
      {
         console.log("[CLIENT LOG]", data['username'], "is login."); 
         console.log(
               "[CLIENT LOG] ", data['username'],
               ",x: ", data['location_x'], ",y: ", data['location_y'],
               ",key_value: ", data['key_val']
         );

         $("#main_layer").append(
            "<div id='" + data['username'] + "' style='position: absolute;'></div>"
         );

         $("#" + data['username']).append(
            "<div style='position:absolute; bottom: 0px; color: white; font-weight: bold;'>" 
            + data['username'] + "</div>"
         );
         /*
         $("#" + data['username']).append(
            "<div id='" + data['username'] + "_laser" + "' style='position:absolute;'></div>"
         );
         */   
         switch(keyValue)
         {
            case LEFT:	      
	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.others.LEFT,
		            "width"  : "64px",
		            "height" : "64px",
		            "zIndex" : "2",
		            left: enemyPosX, 
		            top: enemyPosY
	            });

               enemyPosX = parseInt(data.location_x);
	            enemyPosY = parseInt(data.location_y);

               if(enemyPosX <= 0) 
               {
                  enemyPosX = 0;
                  enemyPosY = parseInt(data.location_y);
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.LEFT,
 		              left: enemyPosX, 
		              top: enemyPosY
	               }); 
               }
	            break;

	         case RIGHT:	            
		         $("#" + data.username).css({
		            "backgroundImage" : imgSprite.others.RIGHT,
		            "width"  : "64px",
		            "height" : "64px",
		            "zIndex" : "2",
		            left: enemyPosX, 
		            top: enemyPosY
		         });
               		
               enemyPosX = parseInt(data.location_x);
		         enemyPosY = parseInt(data.location_y);

               if(enemyPosX >= 4910) 
               {
                  enemyPosX = 4910;
                  enemyPosY = parseInt(data.location_y);
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.RIGHT,
 		              left: enemyPosX, 
		              top: enemyPosY
	               }); 
               }
		         break;
				
	         case UP:	
		         $("#" + data.username).css({
			         "backgroundImage" : imgSprite.others.UP,
			         "width"  : "64px",
			         "height" : "64px",
			         "zIndex" : "2",
			         left: enemyPosX, 
			         top: enemyPosY
		         });
               		
               enemyPosX = parseInt(data.location_x);
		         enemyPosY = parseInt(data.location_y);

               if(enemyPosY <= 0) 
               {
                  enemyPosX = parseInt(data.location_x);
                  enemyPosY = 0
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.UP,
 		              left: enemyPosX, 
		              top: enemyPosY
	               }); 
               }
		         break;
				
	         case DOWN:	
		         $("#" + data.username).css({
		            "backgroundImage" : imgSprite.others.DOWN,
		            "width"  : "64px",
		            "height" : "64px",
		            "zIndex" : "2",
		            left: enemyPosX, 
		            top: enemyPosY
		         });
               	
               enemyPosX = parseInt(data.location_x);
		         enemyPosY = parseInt(data.location_y);

               if(enemyPosY >= 4910) 
               {
                  enemyPosX = parseInt(data.location_x);
                  enemyPosY = 4910;
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.DOWN,
 		              left: enemyPosX, 
		              top: enemyPosY 
	               }); 
               }
		         break;
		
            default:
                break;
         }
      }
   });		
}

/*
var shoot = function(curPosX, curPosY) {
   var LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40;
   var laserId = $("#" + user['name'] + "_laser");
   var laserX = laserId.css("left");
   var laserY = laserId.css("top");
   var laserImg = {
       LEFT : "url('http://203.237.179.21:8000/res/img/missile/laser_left.svg')",
      RIGHT : "url('http://203.237.179.21:8000/res/img/missile/laser_right.svg')",
         UP : "url('http://203.237.179.21:8000/res/img/missile/laser_up.svg')",
       DOWN : "url('http://203.237.179.21:8000/res/img/missile/laser_down.svg')"
   };

   laserX = curPosX;
   laserY = curPosY;

   // If this key is pressed, save position image in user's laser division
   if(key_state == LEFT) 
   {
      // Continueous minus X position that max => 64 * 5 
      laserId.css({
         "backgroundImage" : laserImg.LEFT,
         left : laserX,
         top : leserY
      });
     // After code is executed, wrtie below to the code lines.
     // Change current position x and leave y position that current y position 
   }
     
   if(key_state == RIGHT) 
   {
      // Continueous minus X position that max => 64 * 5 
      laserId.css({
         "backgroundImage" : laserImg.LEFT,
         left : laserX,
         top : leserY
      });
   }

   if(key_state == UP) 
   {
      // Continueous minus X position that max => 64 * 5 
      laserId.css({
         "backgroundImage" : laserImg.UP,
         left : laserX,
         top : leserY
      });
   }

   if(key_state == DOWN) 
   {
      // Continueous minus X position that max => 64 * 5 
      laserId.css({
         "backgroundImage" : laserImg.DOWN,
         left : laserX,
         top : leserY
      });
   }
};
*/









