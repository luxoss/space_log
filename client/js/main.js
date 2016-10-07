/**
   ** File name: main.js
   ** File explanation: Control main html page with javascript and Jquery	
   ** Author: luxoss
*/

//TODO: http://203.237.179.21 have to change that 'game.smuc.ac.kr' 
var serverUrl = "http://203.237.179.21" 					
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
var fps = 30, speed = 2;			
var initPosX = user.x, // Math.floor(Math.random() * mainWidth - 100),     
    initPosY = user.y  // Math.floor(Math.random() * mainHeight - 100);  
var curPosX = initPosX, curPosY = initPosY,
    lastPosX = undefined, lastPosY = undefined;		    
var enemyPosX, enemyPosY;	      // Create enemy x, y position
var missile = {};		            // Create missile image object 
var isKeyDown = [];		         // Create key state array to keyboard polling  
var fire = new Audio();
var discovered = new Audio();
var menuSelection = new Audio();

fire.src = serverUrl + ":8000/res/sound/effect/laser.wav";
discovered.src = serverUrl + ":8000/res/sound/effect/kkang.mp3";
menuSelection.src = serverUrl + ":8000/res/sound/effect/menu_selection.wav";

$(function() {  // Same to $(document).ready(function()) that is 'onload' 
   var ENTER = 13;
   var image = {
      curClientImg : "url(http://203.237.179.21:8000/res/img/space_ship1_up.svg')",
      enemy : "url('http://203.237.179.21:8000/res/img/space_ship2_up.svg')"
   };

   socket.userPos.emit('init_press_key', {
      'username' : user['name'],
      'location_x' : user['x'],
      'location_y' : user['y']
   });
/*
   socket.userPos.on('init_mv', function(data) {
      console.log("[Client log] At first, user position socket is received by server");

      if(data.username == user['name'])
      {
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
            "[Client log] Another user's position socket is received by server taht mongoDB"
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
   initialize();
});

function initialize() 
{
   drawAllAssets("main_layer", user, socket); 		
   viewPort();
   keyHandler(user, socket);
   userPosUpdate(user, speed); 
}	

function drawAllAssets(mainLayer, user, socket) 
{
   var userId = user['name'];
   var imgUrl = "url('http://203.237.179.21:8000/res/img/space_ship1_up.svg')";
   var hp = user.state['hp'];
   var exp = user.state['exp'];
   var mineral = user.resource['mineral'];
   var gas = user.resource['gas'];
   var unknown = user.resource['unknown'];
/*
   // Remove all localStorage items in client 
   localStorage.removeItem('username');
   localStorage.removeItem('exp');
   localStorage.removeItem('mineral');
   localStorage.removeItem('gas');
   localStorage.removeItem('unknown');
   localStorage.removeItem('x');
   localStorage.removeItem('y'); 
*/   
   socket.planet.emit('planet_req', {'ready' : 'Ready to draw all assets'});

   socket.planet.on('planet_res', function(data) {
      var planetInfo = {
         id : data._id,
         x  : data.location_x,
         y  : data.location_y,
         grade : data.create_spd,
         image : { 
            1 :  "url('http://203.237.179.21:8000/res/img/planet/planet_5.png')",
            2 :  "url('http://203.237.179.21:8000/res/img/planet/planet_7.png')",
            3 :  "url('http://203.237.179.21:8000/res/img/planet/planet_9.png')",
            4 :  "url('http://203.237.179.21:8000/res/img/planet/planet_11.png')",
            5 :  "url('http://203.237.179.21:8000/res/img/planet/planet_12.png')"
         }
      };
	
      if(planetInfo.grade == 1) 
      {
         drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['1']);
      }
      else if(planetInfo.grade == 2) 
      {
         drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['2']);
      }
      else if(planetInfo.grade == 3) 
      {
         drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['3']);
      }
      else if(planetInfo.grade == 4) 
      {
         drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['4']);
      }
      else 
      {
         drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['5']);
      }
   });		
        
/*
   $("input #mineral").val(toString(mineral));
   $("input #gas").val(toString(gas));     
   $("input #unknown").val(toString(unknown));
*/
   $("#user_avartar").append(
      "<div id='" + userId + "'style='position:absolute; bottom:0px; color:white;'>" 
      + user['name'] + "</div>"
   );
   $("#user_name").text("" + userId + "");
	
   $("#main_layer").append("<div id='" + userId + "' style='position:absolute;'></div>");
   $("#" + userId).append(
      "<div style='position:absolute; bottom: 0px; color: white; font-weight: bold;'>" 
      + userId + "</div>"
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
}

// 생성된 행성들을 메인 화면 내에 뿌려주기 위한 함수
function drawPlanetImg(mainLayer, divId, x, y, planetImgUrl) 
{
   $("#" + mainLayer).append(
      "<div id='" + divId + "' style='position: absolute; top:" 
      + x + "px" + "; left:" + y + "px" + ";'></div>"
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

   $(document).keydown(function(ev) {  
      socket.userPos.emit('press_key', {
         'username': userId, 
         'key_val' : ev.keyCode, 
         'location_x' : curPosX,
         'location_y' : curPosY
      });
      btnControl(ev, user, curPosX, curPosY);
      //isKeyDown[ev.keyCode] = true;
      keyController(ev, "main_layer", curPosX, curPosY);
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
      planetViewLayer(socket['planet']);
   });

   $('#battle_ship_btn').on('click', function(){
      battleShipViewLayer();
   });

   $('#rank_btn').on('click', function(){
      rankViewLayer();
   });
}

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
         $(location).attr('href', indexPageUrl);	
      }
   }
}

function logout(userId, lastPosX, lastPosY) 
{
   var logoutMsg = confirm('로그아웃 하시겠습니까?');
   var indexPageUrl = serverUrl + ":8000";
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
            console.log(userId, "is logout!"); 

            alert(userId + '님께서 로그아웃 되셨습니다.');
            $(location).attr('href', indexPageUrl);
         }
         else
         {
            alert('Logout error.');
         }
      });
   }
}

function userPosUpdate(user, speed)
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
      var LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40; 
      var keyPressVal = data.key_val;

      console.log(
         "[client log] ", data['username'],
         ",x: ", data['location_x'], ",y: ", data['location_y'],
         ",key_value: ", data['key_val']
      );

      /*
      $("#main_layer").append("<div id='" + data.username + "' style='position:absolute;'></div>");
      $("#" + data.username).append(
         "<div style='position:absolute; bottom: 0px; color: white;'>" + data.username + "</div>"
      );
      */
     
      if(data.username == userId)  
      {
         switch(keyPressVal)
         {
            case LEFT:
	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);
               
               $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.LEFT,
 		            left: curPosX, 
		            top: curPosY
	            });
	            break;

 	         case RIGHT:
	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);

	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.RIGHT,
 	 	            left: curPosX, 
	               top: curPosY
	            });		
	            break;
				
	         case UP:
	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);
	
	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.UP,
		            left: curPosX, 
		            top: curPosY
	            });		
              	break;
				
	         case DOWN:
	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);
	
	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.DOWN,
		            left: curPosX, 
		            top: curPosY
	            });	
               break;
				
            default:
	            break;
         }
      }
      else 
      {
         switch(keyPressVal)
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

var keyController = function(ev, divId, curPosX, curPosY) {
   var keyState = ev.keyCode;
   var LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40, SHOOT = 83, GOT_PLANET = 32;
   var background = divId;

   if(keyState == LEFT)// Left, isKeyDown[37]
   {      
      posX(background) + speed;   
   }
	
   if(keyState == RIGHT) // Right, isKeyDown[39]
   {
      posX(background) - speed;
   }

   if(keyState == UP) // Up, iskeyDown[38]
   {
      posY(background) + speed;
   }

   if(keyState == DOWN) // Down, isKeyDown[40]
   {
      posY(background) - speed;
   }

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

// Move x, y coordinate position with posX and posY 
var posX = function(divId) {
      return parseInt($("#" + divId).css("left"));
}

var posY = function(divId, position) { 
      return parseInt($("#" + divId).css("top"));
}





