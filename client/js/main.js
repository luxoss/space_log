/**
   ** File name: main.js
   ** File explanation: Control main html page with javascript and Jquery	
   ** Author: luxoss
*/

//TODO: http://203.237.179.21 have to change that 'game.smuc.ac.kr' 
var serverUrl = "http://game.smuc.ac.kr" 					
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
var initPosX = user.x, initPosY = user.y,
    curPosX = initPosX, curPosY = initPosY,
    lastPosX = 0, lastPosY = 0;		    
var enemyPosX = 0, enemyPosY = 0;	// Create enemy x, y position
var isKeyDown = [];		            // Create key state array to keyboard polling  
var fire = new Audio();
var discovered = new Audio();
var menuSelection = new Audio();

fire.src = serverUrl + ":8000/res/sound/effect/laser.wav";
discovered.src = serverUrl + ":8000/res/sound/effect/kkang.mp3";
menuSelection.src = serverUrl + ":8000/res/sound/effect/menu_selection.wav";

$(document).ready(function(){ // onload document 
    initialize();
});

function initialize() 
{
   drawAllAssets("main_layer", user, socket); 		
   viewPort();
   keyHandler(user, socket);
   userPosUpdate(user); 
}	

function drawAllAssets(mainLayer, user, socket) 
{
   var userId = user['name'];
   var imgUrl = "url('http://game.smuc.ac.kr:8000/res/img/space_ship1_up.svg')";
   var hp = user.state['hp'];
   var exp = user.state['exp'];
   var mineral = user.resource['mineral'];
   var gas = user.resource['gas'];
   var unknown = user.resource['unknown'];
   var ENTER = 13;
   var image = {
      curClientImg : "url(http://game.smuc.ac.kr:8000/res/img/space_ship1_up.svg')",
      enemy : "url('http://game.smuc.ac.kr:8000/res/img/space_ship2_up.svg')"
   };
/*
   socket.userPos.emit('init_press_key', {
      'username' : user['name'],
      'location_x' : curPosX,
      'location_y' : curPosY
   });
   socket.userPos.on('init_mv', function(data) {
      console.log("[Client log] At first, user position socket is received by server");

      if(data.username == user['name'])
         console.log(
            "[Client log :: Code line 86] username: ", data.username,
            ",x: ", data.location_x, ",y: ", data.location_y
         );

         initPosX = parseInt(data.location_x);
         initPosY = parseInt(data.location_y);

         $("#main_layer").append(
            "<div id='" + user['name'] + "' style='position: absolute;'></div>"
         );

         $("#" + data['name']).css({
            "backgroundImage" : image.curClientImg,
            left : initPosX,
            top : initPosY
         });
      }
      else
      {
         console.log(
            "[Client log]", data.username, "'s position socket is received by server taht mongoDB"
         );
         
         enemyPosX = parseInt(data.location_x);
         enemyPosy = parseInt(data.location_y);

         $("#main_layer").append(
            "<div id='" + data.username + "' style='position: absolute;'></div>
         );

         $("#" + data.username).css({
            "backgroundImage" : image.enemy,
            left : enemyPosX,
            top : enemyPosy
         });
      }
   });
*/

   socket.planet.emit('planet_req', {'ready' : 'Ready to draw planets'});

   socket.planet.on('planet_res', function(data) {
      var planetInfo = {
         id : data._id,
         x  : data.location_x,
         y  : data.location_y,
         grade : data.create_spd,
         image : { 
            1 :  "url('http://game.smuc.ac.kr:8000/res/img/planet/planet_5.png')",
            2 :  "url('http://game.smuc.ac.kr:8000/res/img/planet/planet_7.png')",
            3 :  "url('http://game.smuc.ac.kr:8000/res/img/planet/planet_9.png')",
            4 :  "url('http://game.smuc.ac.kr:8000/res/img/planet/planet_11.png')",
            5 :  "url('http://game.smuc.ac.kr:8000/res/img/planet/planet_12.png')"
         }
      };
	
      if(planetInfo.grade == 1) 
         drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['1']);
      
      if(planetInfo.grade == 2) 
         drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['2']);
      
      if(planetInfo.grade == 3) 
         drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['3']);
      
      if(planetInfo.grade == 4) 
         drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['4']);
      
      if(planetInfo.grade == 5) 
         drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['5']);
   });		
        

   $("#mineral").text(mineral);
   $("#gas").text(gas);
   $("#unknown").text(unknown);
   //$("#hp_progress_bar").text(hp);

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
      "backgroundImage" : imgUrl,
      "width"  : "64px",
      "height" : "64px",
      "zIndex" : "2",
      left: initPosX, 
      top: initPosY
   });

   // Auto focus user's battleship
   var offset = $("#" + userId).offset();

   $("html, body").animate({
      scrollLeft: offset.left - ($(window).width() / 2), 
      scrollTop: offset.top - ($(window).height() / 2)  
   }, 1000);

   localStorage.removeItem('username');
   localStorage.removeItem('exp');
   localStorage.removeItem('hp');
   localStorage.removeItem('mineral');
   localStorage.removeItem('gas');
   localStorage.removeItem('unknown');
   localStorage.removeItem('x');
   localStorage.removeItem('y'); 
}

// 생성된 행성들을 메인 화면 내에 뿌려주기 위한 함수
function drawPlanetImg(mainLayer, divId, x, y, planetImgUrl) 
{
   $("#" + mainLayer).append(
      "<div id='" + divId + "' style='position: absolute; top:" + x + "px" + "; left:" + y + "px" + ";'></div>"
   );	

   $("#" + divId).css({
      "backgroundImage" : planetImgUrl,
      "width"  : "100px",
      "height" : "100px"
   });
}

function viewPort() 
{	
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

function keyHandler(user, socket) 
{
   var userId = user['name'];
   var LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40; 
   var backgroundSpeed = 5;

   $(document).keydown(function(ev) {  
      socket.userPos.emit('press_key', {
         'username': userId, 
         'key_val' : ev.keyCode, 
         'location_x' : curPosX,
         'location_y' : curPosY
      });

      if(ev.keyCode == LEFT)// Left, isKeyDown[37]
      {      
         $("#main_layer").css("left") + backgroundSpeed;
      }
	
      if(ev.keyCode == RIGHT) // Right, isKeyDown[39]
      {
         $("#main_layer").css("left") - backgroundSpeed;
      }

      if(ev.keyCode == UP) // Up, iskeyDown[38]
      {
         $("#main_layer").css("top") + backgroundSpeed;
      }

      if(ev.keyCode == DOWN) // Down, isKeyDown[40]
      {
         $("#main_layer").css("top") - backgroundSpeed;
      }

      keyController(ev, user);
      btnControl(ev, user, curPosX, curPosY);
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

   $('#planet_btn').on('click', function(){
      menuSelection.play();
      menuSelection.currentTime = 0;
      planetViewLayer(socket['planet']);
   });

   $('#battle_ship_btn').on('click', function(){
      menuSelection.play();
      menuSelection.currentTime = 0;
      battleShipViewLayer();
   });

   $('#rank_btn').on('click', function(){
      menuSelection.play();
      menuSelection.currentTime = 0;
      rankViewLayer();
   });
}

function keyController(ev, divId, user) 
{
   var keyState = ev.keyCode;
   var background = divId;
   var SHOOT = 83, GOT_PLANET = 32;
//   var laserX = 0, laserY = 0;

   if(keyState == SHOOT) // press shoot key(s), iskeyDown[83]
   {
      fire.play();
      console.log('fire!');
      fire.currentTime = 0;
      //shoot(curPosX, curPosY);	
   }

   if(keyState == GOT_PLANET) // press space key, isKeyDown[32]
   {
      discovered.play();
      console.log('got a planet');
      discovered.currentTime = 0;
   }
}
/*
var shoot = function(curPosX, curPosY) {
   var LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40;
   var laserId = $("#" + user['name'] + "_laser");
   var laserX = laserId.css("left");
   var laserY = laserId.css("top");
   var laserImg = {
       LEFT : "url('http://game.smuc.ac.kr:8000/res/img/missile/laser_left.svg')",
      RIGHT : "url('http://game.smuc.ac.kr:8000/res/img/missile/laser_right.svg')",
         UP : "url('http://game.smuc.ac.kr:8000/res/img/missile/laser_up.svg')",
       DOWN : "url('http://game.smuc.ac.kr:8000/res/img/missile/laser_down.svg')"
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
function btnControl(ev, user, curPosX, curPosY) 
{
   var keyState = ev.keyCode;
   var SHOOT = 83, GOT_PLANET = 32, 
       BATTLESHIP_BTN = 66, PLANET_BTN = 80, LOGOUT_BTN = 81, RANK_BTN = 82;
   var userId = user['name'];
 
   lastPosX = curPosX;
   lastPosY = curPosY;

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

   if(keyState == LOGOUT_BTN) // press logout(q), isKeydown[81]
   {
      if(userId != null) 
      {
         logout(userId, lastPosX, lastPosY);
      }
      else 
      {
         alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
         $(location).attr('href', 'http://game.smuc.ac.kr:8000');	
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
            console.log("[Client log]", userId, "is logout!"); 

            alert(userId + '님께서 로그아웃 되셨습니다.');
            $(location).attr('href', 'http://game.smuc.ac.kr:8000');
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
         LEFT : "url('http://game.smuc.ac.kr:8000/res/img/space_ship1_left.svg')",
         RIGHT: "url('http://game.smuc.ac.kr:8000/res/img/space_ship1_right.svg')",
         UP   : "url('http://game.smuc.ac.kr:8000/res/img/space_ship1_up.svg')",
         DOWN : "url('http://game.smuc.ac.kr:8000/res/img/space_ship1_down.svg')"
      },
      others : {
         LEFT : "url('http://game.smuc.ac.kr:8000/res/img/space_ship2_left.svg')",
         RIGHT: "url('http://game.smuc.ac.kr:8000/res/img/space_ship2_right.svg')",
         UP   : "url('http://game.smuc.ac.kr:8000/res/img/space_ship2_up.svg')",
         DOWN : "url('http://game.smuc.ac.kr:8000/res/img/space_ship2_down.svg')"
     } 
   }; 

   socket.userPos.on('mv', function(data) { // userStatus is 'object type'
      var LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40; 
      var swapX = 0, swapY = 0;
      var keyValue = data.key_val;
     
      if(data.username == userId)  
      {
         console.log(
            "[Client log :: code line 496] ", data['username'],
            ",x: ", data['location_x'], ",y: ", data['location_y'],
            ",key_value: ", data['key_val']
         );

         switch(keyValue)
         {
            case LEFT: 
	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);
               
               $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.LEFT,
 		            left: curPosX, 
		            top: curPosY
	            });
               /*
               if(curPosX < 0) 
               {
                  curPosX = 0;
                  curPosY = parseInt(data.location_y);
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.LEFT,
 		              left: curPosX, 
		              top: curPosY
	               }); 
               }
               */
	            break;

 	         case RIGHT:
	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);

	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.RIGHT,
 	 	            left: curPosX, 
	               top: curPosY
	            });
               /*		
               if(curPosX > 5000) 
               {
                  curPosX = 5000;
                  curPosY = parseInt(data.location_y);
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.RIGHT,
 		              left: curPosX, 
		              top: curPosY
	               }); 
               }
               */
	            break;
				
	         case UP:
	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);
	
	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.UP,
		            left: curPosX, 
		            top: curPosY
	            });
               /*		
               if(curPosY < 0) 
               {
                  curPosX = parseInt(data.location_x);
                  curPosY = 0
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.UP,
 		              left: curPosX, 
		              top: curPosY
	               }); 
               }
               */
              	break;
				
	         case DOWN:
	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);
	
	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.DOWN,
		            left: curPosX, 
		            top: curPosY
	            });
               /*	
               if(curPosY > 5000) 
               {
                  curPosX = parseInt(data.location_x);
                  curPosY = 5000;
                  $("#" + data.username).css({
	                 "backgroundImage" : imgSprite.player.DOWN,
 		              left: curPosX, 
		              top: curPosY
	               }); 
               }
               */
               break;
				
            default:
	            break;
         }
      }
      else 
      {
         console.log(
               "[Client log :: Code line 602] ", data['username'],
               ",x: ", data['location_x'], ",y: ", data['location_y'],
               ",key_value: ", data['key_val']
         );

         switch(keyValue)
         {
            case LEFT:
	            enemyPosX = parseInt(data.location_x);
	            enemyPosY = parseInt(data.location_y);
	
	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.others.LEFT,
		            "width"  : "64px",
		            "height" : "64px",
		            "zIndex" : "2",
		            left: enemyPosX, 
		            top: enemyPosY
	            });
	            break;

	         case RIGHT:
	            enemyPosX = parseInt(data.location_x);
		         enemyPosY = parseInt(data.location_y);

		         $("#" + data.username).css({
		            "backgroundImage" : imgSprite.others.RIGHT,
		            "width"  : "64px",
		            "height" : "64px",
		            "zIndex" : "2",
		            left: enemyPosX, 
		            top: enemyPosY
		         });		
		         break;
				
	        case UP:
               enemyPosX = parseInt(data.location_x);
		         enemyPosY = parseInt(data.location_y);
	
		         $("#" + data.username).css({
			         "backgroundImage" : imgSprite.others.UP,
			         "width"  : "64px",
			         "height" : "64px",
			         "zIndex" : "2",
			         left: enemyPosX, 
			         top: enemyPosY
		         });		
		         break;
				
	        case DOWN:
		         enemyPosX = parseInt(data.location_x);
		         enemyPosY = parseInt(data.location_y);
	
		         $("#" + data.username).css({
		            "backgroundImage" : imgSprite.others.DOWN,
		            "width"  : "64px",
		            "height" : "64px",
		            "zIndex" : "2",
		            left: enemyPosX, 
		            top: enemyPosY
		         });	
		         break;
		
         default:
                break;
         }
      }
   });		
}

/*
function Missile(x, y, img) 
{
   this.x = x;
   this.y = y;
   this.img = img;

   this.LEFT = function() {
   };

   this.RIGHT = function() {
   };

   this.UP = function() {
   };

   this.DOWN = function() {
   };
}

var laser = new Missile(curPosX, curPosY, img);
laser.prototype.left = function() {
      
*/




