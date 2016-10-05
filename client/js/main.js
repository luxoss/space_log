/**
   ** File name: main.js
   ** File explanation: Control main html page with javascript	
   ** Author: luxoss
*/
var serverUrl =  "http://203.237.179.21" 					
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
        exp : parseInt(localStorage.getItem('exp'))
//        hp : parseInt(localStorage.getItem('hp')),
   }
};
var background = {
   x : function(divId, position) {
      if(position) 
      {
         return parseInt($("#" + divId).css("left", position));
      }
      else 
      {
         return parseInt($("#" + divId).css("left"));
      }
   },

   y : function(divId, position) {
      if(position) 
      {
         return parseInt($("#" + divId).css("top", position));
      }
      else 
      {
         return parseInt($("#" + divId).css("top"));
      }
   }
};
var fps = 30, speed = 2;			
var initPosX = user.x,  //Math.floor(Math.random() * mainWidth - 100),     
    initPosY = user.y   //Math.floor(Math.random() * mainHeight - 100);  
var curPosX = initPosX, curPosY = initPosY,
    lastPosX = 0, lastPosY = 0;		    
var enemyPosX, enemyPosY;	// Create enemy x, y position
var missile = new Object();		// Create missile image object 
var isKeyDown = new Array();		// Create key state array to keyboard polling  
var fire = new Audio();
var discovered = new Audio();

fire.src = serverUrl + ":8000/res/sound/effect/shoot.mp3";
discovered.src = serverUrl + ":8000/res/sound/effect/kkang.mp3";

$(function() {  // Same to $(document).ready(function()) that is 'onload' 
   //TODO: Request to server initialize value. (PROBLEM: At first, didn't displayed other spaceship image.
   initialize(user);
});

function initialize(user) 
{
   var ENTER = 13;
   var clientUserId = user['name'];
   var image = {
      me : "url('http://203.237.179.21:8000/res/img/space_ship1_up.svg')",
      enemy : "url('http://203.237.179.21:8000/res/img/space_ship2_up.svg')"
   };

   socket.userPos.emit('press_key', {
      'username' : user['name'], 
      'location_x' : user['x'], 
      'location_y' : user['y'],
      'key_val' : ENTER
   });

   socket.userPos.on('init_mv', function(data) {
      console.log("At first socket.userInit");
      if(data.username == clientUserId)
      {
         console.log("username: ", data.username, "x: ", data.location_x, "y: ", data.location_y); 
         initPosX = parseInt(data.location_x);
         initPosY = parseInt(data.location_y);

         $("#main_layer").append(
            "<div id='" + clientUserId + "' style='potiion: absolute;'></div>"
         );
         $("#" + data['username']).css({
            "backgroundImage" : image.me,           
            left: initPosX,
            top: initPosY
         });
      }
      else
      {
         console.log("Another");
         console.log("username: ", data.username, "x: ", data.location_x, "y: ", data.location_y);
         
         enemyPosX = parseInt(data.location_x);
         enemyPosY = parseInt(data.location_y);

         $("#main_layer").append(
            "<div ='" + data.username + "' style='position: absolute;'></div>"
         );
         $("#" + data.username).css({
            "backgroundImage" : image.enemy,
            left: enemyPosX,
            top: enemyPosY
         });
      }
   });
   drawAllAssets("main_layer"); 		
   drawShipInfo(initPosX, initPosY, user); 
   viewPort();
   keyHandler(socket, user);
   buttonSet(user);
   userPosUpdate(speed, background); 
}	

function drawAllAssets(mainLayer) 
{
   socket.planet.emit('planet_req', {'ready' : 'Ready to draw all assets'});

   socket.planet.on('planet_res', function(data) {
      //var mainLayer = $("#main_layer");
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
}

// 생성된 행성들을 메인 화면 내에 뿌려주기 위한 함수
function drawPlanetImg(mainLayer, divId, x, y, planetImgUrl) 
{
   $("#" + mainLayer).append(
      "<div id='" + divId + "' style='position: absolute; top: " 
      + x + "px" + "; left:" + y + "px" + ";'></div>"
   );	

   $("#" + divId).css({
      "backgroundImage" : planetImgUrl,
      "width"  : "100px",
      "height" : "100px"
   });
}

// 유저 정보(유저명, 함선 이미지)를 메인 화면에 뿌릴 함수
function drawShipInfo(initPosX, initPosY, user) 
{
   var userId = user['name'];
   var imgUrl = "url('http://203.237.179.21:8000/res/img/space_ship1_up.svg')";
   var mineral = $("#mineral");
   var gas = $("#gas");
   var unknown = $("#unknown");

   mineral.text("" + user['mineral']+ "");
   gas.text("" + user['gas'] + "");     
   unknown.text("" + user['unknown'] + "");

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

   autoFocus(userId);
}

function autoFocus(divId) 
{
   var offset = $("#" + divId).offset();

   $("html, body").animate({
      scrollLeft: offset.left - ($(window).width() / 2), 
      scrollTop: offset.top - ($(window).height() / 2)  
   }, 1000);
}
	
function keyHandler(socket, user) 
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
      //keyController(ev, mainLayer, curPosX, curPosY);
   });

   $(document).keyup(function(ev) {
      //isKeyDown[ev.keyCode] = false;
   });
}

function btnControl(ev, user, curPosX, curPosY) 
{
   var keyState = ev.keyCode;
   var SHOOT = 83, GOT_PLANET = 32, 
       BATTLESHIP_BTN = 66, PLANET_BTN = 80, RANK_BTN = 82, LOGOUT_BTN = 81;

   lastPosX = curPosX;
   lastPosY = curPosY;

   if(keyState == BATTLESHIP_BTN) // press battle ship menu button, isKeyDown[66]
   {
      battleShipViewLayer(); 	  
   }

   if(keyState == PLANET_BTN) // press planet menu button, isKeyDown[80]
   {
      planetViewLayer(socket['planet']);
   }

   if(keyState == LOGOUT_BTN) // press logout(q), isKeydown[81]
   {
      if(user['name'] != null) 
      {
         logout(user, lastPosX, lastPosY);
      }
      else 
      {
         alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
         $(location).attr('href', indexPageUrl);	
      }
   }

   if(keyState == RANK_BTN) // press rank menu button, isKeyDown[82]
   {
      rankViewLayer();
   }
}
/*
var keyController = function(ev, divId, curPosX, curPosY) {
   var keyState = ev.keyCode;
   var LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40, SHOOT = 83, GOT_PLANET = 32;
   var mainLayer = divId;
   //var user.name = divId1;

   if(keyState == LEFT)// Left, isKeyDown[37]
   {      
      posX(mainLayer, posX(mainLayer) + speed);   
   }
	
   if(keyState == RIGHT) // Right, isKeyDown[39]
   {
      posX(mainLayer, posX(mainLayer) - speed);
   }

   if(keyState == UP) // Up, iskeyDown[38]
   {
      posY(mainLayer, posY(mainLayer) + speed);
   }

   if(keyState == DOWN) // Down, isKeyDown[40]
   {
      posY(mainLayer, posY(mainLayer) - speed);
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
*/

// Move x, y coordinate position with posX and posY 
var posX = function(divId, position) {
   if(position) 
   {
      return parseInt($("#" + divId).css("left", position));
   }
   else 
   {
      return parseInt($("#" + divId).css("left"));
   }
}

var posY = function(divId, position) { 
   if(position) 
   {
      return parseInt($("#" + divId).css("top", position));
   }
   else 
   {
      return parseInt($("#" + divId).css("top"));
   }
}

function viewPort() 
{	
   $(window).resize(function() {
      $("#view_layer").css({
         width: ($(window).width() - 200), // 1368px
         height: ($(window).height() - 100) // 768px
      });

      $('#view_layer').css({
         left: ($(window).width() - $('#view_layer').outerWidth()) / 2,
         top: ($(window).height() - $('#view_layer').outerHeight()) / 2
      });

   }).resize();
}

function buttonSet(user) 
{	
   $('#logout_btn').on('click', function(){	
      if(user['name'] != null) 
      {
         logout(user, lastPosX, lastPosY);
      }
      else 
      {
         alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
         $(location).attr('href', indexPageUrl);	
      }
   });	

   $('#planet_btn').on('click', function(){
      planetViewLayer();
   });

   $('#battle_ship_btn').on('click', function(){
      battleShipViewLayer();
   });

   $('#rank_btn').on('click', function(){
      rankViewLayer();
   });
}

function logout(user, lastPosX, lastPosY) 
{
   var userId = user['name'];
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

            alert(userId + '님께서 로그아웃 되셨습니다.');

            $("#" + user['name']).remove();
            localStorage.removeItem('username');
            $(location).attr('href', indexPageUrl);
         }
         else if(data.response == 'false') 
         {
            alert('Logout error.');
         }
      });
   }
}

function userPosUpdate(speed, background)
{
   var posX = background.x;
   var posY = background.y;
   var playUserId = localStorage.getItem('username');
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

      console.log(data.username, data.location_x, data.location_y, data.key_val);
      // TODO: Remind this code line. because of overlap tagging
      $("#main_layer").append("<div id='" + data.username + "' style='position:absolute;'></div>");
      $("#" + data.username).append(
         "<div style='position:absolute; bottom: 0px; color: white;'>" + data.username + "</div>"
      );

      if(data.username == playUserId)  
      {
         switch(keyPressVal)
         {
            case LEFT:
               posX("main_layer", posX("main_layer") + speed);

	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);
               
               $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.LEFT,
 		            left: curPosX, 
		            top: curPosY
	            });
	            break;

 	         case RIGHT:
               posX("main_layer", posX("main_layer") - speed);

	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);

	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.RIGHT,
 	 	            left: curPosX, 
	               top: curPosY
	            });		
	            break;
				
	         case UP:
               posY("main_layer", posY("main_layer") + speed);

	            curPosX = parseInt(data.location_x);
	            curPosY = parseInt(data.location_y);
	
	            $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.UP,
		            left: curPosX, 
		            top: curPosY
	            });		
              	break;
				
	         case DOWN:
               posY("main_layer", posY("main_layer") - speed);

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


