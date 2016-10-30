/**
   ** File name: main.js
   ** File explanation: Control main html page with javascript and Jquery	
   ** Author: luxoss
*/

//TODO: http://203.237.179.21 have to change that 'game.smuc.ac.kr' 
var serverUrl = "http://game.smuc.ac.kr";
var indexPageUrl = serverUrl + ":8000";

var socket = {
   userInit : io.connect(serverUrl + ":5001"),
   userInfo : io.connect(serverUrl + ":5005"),
   userPos  : io.connect(serverUrl + ":5006"),
   develop  : io.connect(serverUrl + ":5003"),
   planet   : io.connect(serverUrl + ":5002"),
   rank     : io.connect(serverUrl + ":5008")
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
   }
};
var enemy = {};                     // Create enemy json object
var devMineral = parseInt(localStorage.getItem('mineral'));
var devGas = parseInt(localStorage.getItem('gas'));
var devUnknown = parseInt(localStorage.getItem('unknown'));
var discovered = new Audio();
var menuSelection = new Audio();
var eventCount = 0;
var fps = 15;

//var isKeyDown = [];		         // Create key state array to keyboard polling  
//var enemyPosX = 0, enemyPosY = 0;	// Create enemy x, y position
//var fire = new Audio();
//fire.src = serverUrl + ":8000/res/sound/effect/laser.wav";
//discovered.src = serverUrl + ":8000/res/sound/effect/kkang.mp3";
menuSelection.src = serverUrl + ":8000/res/sound/effect/menu_selection.wav";


$(document).ready(function(){ // After onload document, execute inner functions
/*
   $(window).on("beforeunload", function(){
      return "정말 나가시겠습니까?";
   });
*/
   $(window).on('unload', function(user){ logout(user); });

   backgroundSoundControl();

   for(var i = 0; i <= 1000; i++)
   {
      if(i % 1 === 0)
      {
         $('body #star_boxes').append(
            "<div id='star_" + i + "' style='position:absolute; width: 10px; height: 10px;'></div>"
         );

         $("#star_" + i).css({
            'background-color' : 'rgba(255, 255, 0, 1)',
            'left'             : Math.floor(Math.random() * 14000 - 1),
            'top'              : Math.floor(Math.random() * 14000 - 1),
            'border'           : '0px',
            'border-radius'    : '5px'
         });
      }
      
      if(i % 2 === 0)
      {
         $('#main_star_boxes').append(
            "<div id='star_" + i + "' style='position:absolute; width: 15px; height: 15px;'></div>"
         );

         $("#star_" + i).css({
            'background-color' : 'rgba(255, 255, 255, 0.8)',
            'left'             : Math.floor(Math.random() * 14000 - 1),
            'top'              : Math.floor(Math.random() * 14000 - 1),
            'border'           : '0px',
            'border-radius'    : '15px'
         });
      } 
   }

   $('#main_pop_up_view').css({
      'left' : ($(window).width() - $('#main_pop_up_view').outerWidth()) / 2,
      'top'  : ($(window).height() - $('#main_pop_up_view').outerHeight()) / 2
   });

   popUpMsg(user.name + "님 SPACE LOG 세계에 오신 것을 환영합니다.");

   drawAllAssets("planets", user, socket); 		
 
   setInterval(loginAll(user, enemy, socket), 60000);

   keyHandler(user, socket);
   userPosUpdate(user, enemy); 

   socket.userInit.on('logout_all', function(data) {
      console.log("[CLIENT LOG] logout_all: ", data);

      if(data['username'] !== user['name']) 
      {
         console.log("[CLIENT LOG]", data.username, "is logout!");
         console.log("[CLIENT LOG] enemyObj:", enemy[data.username], "is logout!");

         delete enemy[data.username];
         delete enemy[data.username + "X"];
         delete enemy[data.username + "Y"];

         $("#" + enemy[data.username]).remove();
         $("#" + data.username).remove(); 
      } 
   });
/*
   setInterval(function(){
      socket.develop.emit('add_p', {'username' : user['name']});
       
      socket.develop.on('chng_info', function(data){
         console.log("receive resource");

         devMineral += parseInt(data.mineral);
         devGas += parseInt(data.gas);
         devUnknown += parseInt(data.unknown);

         $("#mineral").text(parseInt(devMineral));
         $("#gas").text(parseInt(devGas));
         $("#unknown").text(parseInt(devUnknown));
      });
   }, 1000/fps);
*/
});

function backgroundSoundControl()
{
   $("#bg_sound_control").on('click.bg_sound_control', function() {
      var bgSound = document.getElementById('main_bg_sound');

      if(bgSound.paused)
      {
         $("#bg_sound_control").css('color', 'rgba(255, 255, 255, 0.7)');
         $("#bg_sound_control").text("[SOUND | ON]");
         bgSound.play();
      }
      else
      {
         $("#bg_sound_control").css('color', 'rgba(255, 255, 255, 0.7)');
         $("#bg_sound_control").text("[SOUND | OFF]");
         bgSound.pause();
         bgSound.currentTime = 0;
      }
   });
}
         
function loginAll(user, enemy, socket)
{
  socket.userPos.on('login_all', function(data) {
      console.log("[CLIENT LOG] me: ", user['name']);

      if(data['username'] !== user['name']) 
      {
         enemy[data.username] = data.username;
         enemy[data.username + "X"] = parseInt(data['location_x']);
         enemy[data.username + "Y"] = parseInt(data['location_y']); 

         console.log("[CLIENT LOG] enemyObj(all): ", enemy);
         console.log(
            "[CLIENT LOG] enemyObj(inner):", enemy[data.username], 
            'x: ', enemy[data.username + "X"], 'y: ', enemy[data.username + "Y"]
         );
/*        
         $("#space_ship").append("<div id ='" + enemy[data.username] + "' style='position:absolute;'></div>");
         $("#" + enemy[data.username]).append(
            "<div style='position:absolute; bottom: 0px; color: white; font-weight: bold;'>" 
            + enemy[data.username] + "</div>"
         );
*/
         $("#" + enemy[data.username]).css({ 
            "backgroundImage" : "url('http://game.smuc.ac.kr:8000/res/img/space_ship2_right.svg')",
            "width"  : "64px",
            "height" : "64px",
            "zIndex" : "2",
            left: parseInt(enemy[data.username + "X"]), 
            top: parseInt(enemy[data.username + "Y"])
         });
      }
   });
}

function drawAllAssets(mainLayer, user, socket) 
{
   var score = user.state['exp'];
   var mineral = user.resource['mineral'];
   var gas = user.resource['gas'];
   var unknown = user.resource['unknown'];
   var ENTER = 13;
   var image = { clnt  : "url('http://game.smuc.ac.kr:8000/res/img/space_ship1_up.svg')" };
   
 
   $(window).resize(function() {
      $("#main_layer").css({
         left: ($(window).width() - $("#main_layer").outerWidth()) / 2,
         top : ($(window).height() - $("#main_layer").outerHeight()) / 2
      });

      $("#view_layer").css({
         width: ($(window).width() - 200), 
         height: ($(window).height() - 100) 
      });
      
      $('#view_layer').css({
         left: ($(window).width() - $('#view_layer').outerWidth()) / 2,
         top: ($(window).height() - $('#view_layer').outerHeight()) / 2
      });
      
   }).resize();

   socket.planet.emit('planet_req', {'ready' : 'Ready to receive' });

   socket.planet.on('planet_res', function(data) {
      var planet = {
         id : "planet" + data.p_id,
         x  : data.location_x,
         y  : data.location_y,
         grade : data.create_spd,
         mineral : data.mineral,
         gas : data.gas,
         unknown : data.unknown,
         image : { 
            1 :  "url('http://game.smuc.ac.kr:8000/res/img/planet/planet_5.png')",
            2 :  "url('http://game.smuc.ac.kr:8000/res/img/planet/planet_7.png')",
            3 :  "url('http://game.smuc.ac.kr:8000/res/img/planet/planet_9.png')",
            4 :  "url('http://game.smuc.ac.kr:8000/res/img/planet/planet_11.png')",
            5 :  "url('http://game.smuc.ac.kr:8000/res/img/planet/planet_12.png')"
         }
      };
      
      if(planet.grade == 0)
      {
         $("#" + mainLayer).append("<div id='" + planet['id'] + "' style='position: absolute;'></div>");	

         $("#" + planet['id']).css({
            "backgroundImage" : planet.image['1'],
            "width"  : "100px",
            "height" : "100px",
            "border" : "1px solid rgba(255, 255, 0, 0.3)",
            left: planet['x'],
            top: planet['y']
         });
         
         $("#" + planet['id']).append(
            "<div style='position:absolute; width: 100px; left:0px; top:100px; color:yellow; font-weight:bold; text-align: center;'>" 
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
            "border" : "1px solid rgba(255, 255, 0, 0.3)",
            left: planet['x'],
            top: planet['y']
         });

         $("#" + planet['id']).append(
            "<div style='position:absolute; width: 100px; left:0px; top:100px; color:yellow; font-weight:bold; text-align: center;'>" 
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
            "border" : "1px solid rgba(255, 255, 0, 0.3)",
            left: planet['x'],
            top: planet['y']
         });

         $("#" + planet['id']).append(
            "<div style='position:absolute; width: 100px; left:0px; top:100px; color:yellow; font-weight:bold; text-align: center;'>" 
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
            "border" : "1px solid rgba(255, 255, 0, 0.3)",
            left: planet['x'],
            top: planet['y']
         });

         $("#" + planet['id']).append(
            "<div style='position:absolute; width: 100px; left:0px; top:100px; color:yellow; font-weight:bold; text-align:center;'>" 
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
            "border" : "1px solid rgba(255, 255, 0, 0.3)",
            left: planet['x'],
            top: planet['y']
         });

         $("#" + planet['id']).append(
            "<div style='position:absolute; width: 100px; left:0px; top:100px; color:yellow; font-weight:bold; text-align: center;'>" 
            + planet['id'] + "</div>"
         );
      }
   });		
        
   $("#mineral").text(mineral);
   $("#gas").text(gas);
   $("#unknown").text(unknown);
   $("#position_x").text(user['x']);
   $("#position_y").text(user['y']);
   $("#score_point").text(score);

   $("#user_avartar").append(
      "<div id='" + user['name'] + "'style='position:absolute; bottom:0px; color:white;'>" 
      + user['name'] + "</div>"
   );
   $("#user_name").text(user['name']);
	
   $("#space_ship").append("<div id='" + user['name'] + "' style='position:absolute;'></div>");

   $("#" + user['name']).append(
      "<div style='position:absolute; bottom: 0px; color: white; font-weight: bold; text-align: center;'>" 
      + user['name'] + "</div>"
   );

   $("#" + user['name']).css({
      "backgroundImage" : image['clnt'],
      "width"  : "64px",
      "height" : "64px",
      "border" : "1px solid rgba(255, 255, 0, 0.3)",
      "zIndex" : "2",
      left: user['x'], 
      top: user['y']
   });

   // TODO: Test auto focus user's battleship. 화면을 벗어날 때만 auto focus?
   var offset = $("#" + user['name']).offset();

   $("html, body").animate({
      scrollLeft: offset.left - ($(window).width() / 2), 
      scrollTop: offset.top - ($(window).height() / 2)  
   }, 1000);

   localStorage.removeItem('username');
   localStorage.removeItem('x');
   localStorage.removeItem('y'); 
   localStorage.removeItem('mineral');
   localStorage.removeItem('gas');
   localStorage.removeItem('unknown');
   localStorage.removeItem('exp');
   localStorage.removeItem('hp');

}

function keyHandler(user, socket) 
{
   console.log("[CLIENT LOG] KeyHandler is called.");
   
   var userId = user['name'];
   var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
   var BATTLESHIP_BTN = 66, MINIMAP_BTN = 77, PLANET_BTN = 80, LOGOUT_BTN = 81, RANK_BTN = 82, KEYSET_BTN = 73;
   var DEVELOP_PLANET = 32, FOCUS = 83;
   var speed = 4;
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
   
   $('body').off('keydown').on('keydown', function(ev) {  
      
      var keyState = ev.keyCode;

      ev.stopImmediatePropagation();
          
      if(keyState == LEFT)
      {
         bg.x("main_layer", bg.x("main_layer") + speed);

         socket.userPos.emit('press_key', {
            'username': user['name'], 
            'key_val' : LEFT, 
            'location_x' : user['x'],
            'location_y' : user['y']
         });
      }

      if(keyState == UP)
      {
         bg.y("main_layer", bg.y("main_layer") + speed);

         socket.userPos.emit('press_key', {
            'username': user['name'], 
            'key_val' : UP, 
            'location_x' : user['x'],
            'location_y' : user['y']
         });

      }

      if(keyState == RIGHT)
      {
         bg.x("main_layer", bg.x("main_layer") - speed);

         socket.userPos.emit('press_key', {
            'username': user['name'], 
            'key_val' : RIGHT, 
            'location_x' : user['x'],
            'location_y' : user['y']
         });
      }

      if(keyState == DOWN)
      {
         bg.y("main_layer", bg.y("main_layer") - speed);

         socket.userPos.emit('press_key', {
            'username': user['name'], 
            'key_val' : DOWN, 
            'location_x' : user['x'],
            'location_y' : user['y']
         });

      }

      if(keyState == FOCUS) 
      {
         var offset = $("#" + user['name']).offset();

         $("html, body").animate({
            scrollLeft: offset.left - ($(window).width() / 2), 
            scrollTop: offset.top - ($(window).height() / 2)  
         }, 1000);
      }

      if(keyState == PLANET_BTN) // press planet menu button, isKeyDown[80]
      {
         menuSelection.play();
         menuSelection.currentTime = 0;
         planetViewLayer(user, socket);
      }

      if(keyState == RANK_BTN) // press rank menu button, isKeyDown[82]
      {
         menuSelection.play();
         menuSelection.currentTime = 0;
         rankViewLayer(socket);
      }

      if(keyState == MINIMAP_BTN) // press minimap display button, isKeyDown[77]
      {
         drawMinimap(user, enemy, socket);
      }

      if(keyState == LOGOUT_BTN) // press logout(q), isKeydown[81]
      {
         if(user['name'] != null) 
         {
            logout(user);
         }
         else 
         {
            popUpMsg('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
            $(location).attr('href', 'http://game.smuc.ac.kr:8000');	
         }
      }
      
      // command line R key is 'redo' and r key is 'undo'
      if(keyState == DEVELOP_PLANET) 
      {        
         console.log('Space key down');

         socket.userPos.emit('collision_req', {
            'username' : user['name'], 
            'location_x' : user['x'],
            'location_y' : user['y'],
         });

         socket.userPos.on('collision_res', function(data) {

            var collisionFlag = parseInt(data['collision']);
            var collisionUser = data['username'];
            var developThis = data['develop'];

            if((collisionUser === user['name']) && (collisionFlag === 1)) // (developThis === 'false')) 
            {
               switch(developThis)
               {
                  case 'true' : 
                        popUpMsg(data['username'] + "께서 개척하신 행성입니다.");
                        break;
                  case 'false':
                        //TODO: 개척 창 띄우고 실행 컴플릿 되면 바로 자원 데이터 넣기
                        console.log("[CLIENT LOG] Ready to the develop planet.");

                        var developPlanetInfo = {
                           name : $("#p_name").text("planet" + data.p_id),
                           resource : {
                              mineral : $("#p_mineral").text(data.mineral),
                              gas : $("#p_gas").text(data.gas),
                              unknown : $("#p_unknown").text(data.unknown)
                           },
                           grade : $("#p_grade").text(parseInt(data.create_spd + 1)),
                           develop : $("#p_develop")
                        };

                        var state = $("#develop_planet_ui").css('display');

                        $("#develop_planet_ui").css({
                           left: ($(window).width() - $("#develop_planet_ui").outerWidth()) / 2, 
                           top: ($(window).height() - $("#develop_planet_ui").outerHeight()) / 2
                        });
 
                        if(state == 'none')
                        {
                           $("#develop_planet_ui").show();
                           $("#develop_planet_ui").fadeOut(5000);      

                           developPlanetInfo.name;
                           developPlanetInfo.resource.mineral;
                           developPlanetInfo.resource.gas;
                           developPlanetInfo.resource.unknown;
                           developPlanetInfo.grade;
                           developPlanetInfo.develop.text("미 개척");
                        }

                        $("#cancel").mouseover(function() {
                           menuSelection.play();
                           $("#cancel").css('color', 'rgba(255, 255, 0, 0.7)');
                           menuSelection.currentTime = 0;
                        });

                        $("#cancel").mouseout(function() {
                           menuSelection.play();
                           $("#cancel").css('color', 'rgba(255, 255, 255, 0.7)');
                           menuSelection.currentTime = 0;
                        });

                        $("#cancel").off('click.cancel').on('click.cancel', function(event) { 
                           $("#develop_planet_ui").hide();
                           event.stopImmediatePropagation();
                        });

                        $("#develop_planet").mouseover(function() {
                           menuSelection.play();
                           $("#develop_planet").css('color', 'rgba(255, 255, 0, 0.7)');
                           menuSelection.currentTime = 0;
                        });

                        $("#develop_planet").mouseout(function() {
                           menuSelection.play();
                           $("#develop_planet").css('color', 'rgba(255, 255, 255, 0.7)');
                           menuSelection.currentTime = 0;
                        });
                        
                        $("#develop_planet").off('click.develop_plnaet').on('click.develop_planet', function(event) {

                           socket.develop.emit('add_p', {'username' : user['name'], 'p_id' : data.p_id});
                          
                           socket.develop.on('chng_info', function(data){
                              console.log("[CLIENT LOG]change planet resource information: ", data);

                              devMineral += parseInt(data.mineral);
                              devGas += parseInt(data.gas);
                              devUnknown += parseInt(data.unknown);

                              $("#mineral").text(parseInt(devMineral));
                              $("#gas").text(parseInt(devGas));
                              $("#unknown").text(parseInt(devUnknown));
                           });
                         
                           $("#develop_planet_ui").hide();
                       
                           popUpMsg("Complete develop planet.");      

                           event.stopImmediatePropagation();
                        });
                        break;
                  default:
                        break;
               }
            }             
         });
      }
   });

   // Keydown event
   $('body').off('keyup').on('keyup', function(ev) {

      ev.stopImmediatePropagation();

      switch(ev)
      {
         case LEFT:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;

         case UP:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;

         case RIGHT:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;

         case DOWN:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;

         case MINIMAP_BTN:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;

         case PLANET_BTN:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;

         case LOGOUT_BTN:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;

         case RANK_BTN:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;

         case KEYSET_BTN:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;
         
         case DEVELOP_PLANET:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;

         default:
            ev.keyCode = 0;
            ev.stopImmediatePropagation();
            break;
       }
    });
   
   $("#logout_btn").off('click.logout').on('click.logout', function(event){	
      if(user['name'] != null) 
      {
         logout(user);
      }
      else 
      {
         popUpMsg('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
         $(location).attr('href', indexPageUrl);	
      }
      event.stopImmediatePropagation();
   });	

   $("#planet_btn").off('click.planet').on('click.planet', function(event) {
      menuSelection.play();
      menuSelection.currentTime = 0;
      planetViewLayer(user, socket);

      event.stopImmediatePropagation();
   });

   $("#rank_btn").off('click.rank').on('click.rank', function(event) {
      menuSelection.play();
      menuSelection.currentTime = 0;
      rankViewLayer();

      event.stopImmediatePropagation();
   });

   $('#minimap_btn').on('click.minimap_btn', function(event) {      
      drawMinimap(user, enemy, socket);   
      event.stopImmediatePropagation();
   });
}

function logout(user) 
{
   var logoutMsg = confirm('로그아웃 하시겠습니까?');
   var LOGOUT = 81;

   if(logoutMsg === true) 
   {
      socket.userInit.emit('logout_msg', { 
         'username' : user['name'],
          'mineral' : user.resource['mineral'],
              'gas' : user.resource['gas'],
          'unknown' : user.resource['unknown'],          
            'socre' : user.state['score'],
         'key_val'  : LOGOUT 
      }); 

      socket.userInit.on('logout_res', function(data) {
          
         if(data.response === 'true') 
         {
            socket.userInfo.emit('lpos', {
               'username': user['name'],  
               'lastPosX': user['x'],     
               'lastPosY': user['y']     
            }); 
/*
            localStorage.removeItem('username');
            localStorage.removeItem('x');
            localStorage.removeItem('y'); 
            localStorage.removeItem('mineral');
            localStorage.removeItem('gas');
            localStorage.removeItem('unknown');
            localStorage.removeItem('exp');
            localStorage.removeItem('hp');
            socket.userInit.disconnect();
            socket.userInfo.disconnect();
            socket.userPos.disconnect();
            socket.develop.disconnect();
            socket.planet.disconnect();   
*/           
            $(location).attr('href', 'http://game.smuc.ac.kr:8000');
         }
         else
         {
            console.log("[ERROR] LOGOUT.");
         }
      });
   }
}

function userPosUpdate(user, enemy)
{
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
      var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40; 
      var keyValue = data.key_val;
      
      // TODO:  여기서 실행하면 키 입력 값을 받을 때 마다 appendChild를 하므로 같은 테그들이 생겨남
      //        따라서 초기화 시에 접속한 모든 사람의 데이터를 받아 appendChild를 한 번 해주고 
      //        위치 변경 시 각각의 css style만 바꿔야 함.
      if(user['name'] === data['username'])  
      {
         switch(keyValue)
         {
            case LEFT: 	           
               $("#" + data.username).css({
	               "backgroundImage" : imgSprite.player.LEFT,
 		            left: user['x'], 
		            top: user['y']
	            });

               user['x'] = parseInt(data.location_x);
	            //user['y'] = parseInt(data.location_y);
              
               $("#position_x").text(user['x']);
               //$("#position_y").text(user['y']);

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
	            //user['y'] = parseInt(data.location_y);
               
               $("#position_x").text(user['x']);
               //$("#position_y").text(user['y']);

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

	            //user['x'] = parseInt(data.location_x);
	            user['y'] = parseInt(data.location_y);

               //$("#position_x").text(user['x']);
               $("#position_y").text(user['y']);

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

               //user['x'] = parseInt(data.location_x);
	            user['y'] = parseInt(data.location_y);

               //$("#position_x").text(user['x']);
               $("#position_y").text(user['y']);

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
      else if(data['username'] !== user['name'])
      { 
         enemy[data.username] = data.username;
         enemy[data.username + "X"] = data.location_x;
         enemy[data.username + "Y"] = data.location_y;
         console.log("[CLIENT LOG] 835 enemy Object:", enemy);

        //TODO: RE-TEST
        $("#space_ship").append("<div id ='" + enemy[data.username] + "' style='position:absolute;'></div>");
         $("#" + enemy[data.username]).append(
            "<div style='position:absolute; bottom: 0px; color: white; font-weight: bold;'>" 
            + enemy[data.username] + "</div>"
         );

         switch(keyValue)
         {
            case LEFT:	      
	            $("#" + enemy[data.username]).css({
	               "backgroundImage" : imgSprite.others.LEFT,
		            "width"  : "64px",
		            "height" : "64px",
		            "zIndex" : "2",
		            left: enemy[data.username + "X"], 
		            top: enemy[data.username + "Y"]
	            });

               enemy[data.username + "X"] = parseInt(data.location_x);
	            enemy[data.username + "Y"] = parseInt(data.location_y);
	            break;

	         case RIGHT:	            
		         $("#" + enemy[data.username]).css({
		            "backgroundImage" : imgSprite.others.RIGHT,
		            "width"  : "64px",
		            "height" : "64px",
		            "zIndex" : "2",
		            left: enemy[data.username + "X"], 
		            top: enemy[data.username + "Y"]
		         });
               		
               enemy[data.username + "X"] = parseInt(data.location_x);
		         enemy[data.username + "Y"] = parseInt(data.location_y);
		         break;
				
	         case UP:	
		         $("#" + enemy[data.username]).css({
			         "backgroundImage" : imgSprite.others.UP,
			         "width"  : "64px",
			         "height" : "64px",
			         "zIndex" : "2",
			         left: enemy[data.username + "X"], 
			         top: enemy[data.username + "Y"]
		         });
               		
               enemy[data.username + "X"] = parseInt(data.location_x);
		         enemy[data.username + "Y"] = parseInt(data.location_y);
		         break;
				
	         case DOWN:	
		         $("#" + enemy[data.username]).css({
		            "backgroundImage" : imgSprite.others.DOWN,
		            "width"  : "64px",
		            "height" : "64px",
		            "zIndex" : "2",
		            left: enemy[data.username + "X"], 
		            top: enemy[data.username + "Y"]
		         });
               	
               enemy[data.username + "X"] = parseInt(data.location_x);
		         enemy[data.username + "Y"] = parseInt(data.location_y);
		         break;
		
            default:
                console.log("[CLIENT LOG] 927:", enemy[data.username]);
                break;
         }
      }
      else
      {
         console.log("[CLIENT LOG] 933:", data);
      }
   });		
}

function popUpMsg(msg)
{
   var state = $("#main_pop_up_view").css('display');

   if(state == 'none') 
   {
      $("#main_pop_up_view").show();
      $("#main_pop_up_msg").text(msg);
      $("#main_pop_up_view").fadeOut(1600);      
   }
/*   
   $("#main_pop_up_hide").click(function() {
      $("#main_pop_up_view").hide();
      return false;
   });
*/
}

/*

function keySetDisplay() 
{
   var display_state = $("#key_set").css('display');
   
   if(display_state == 'none')
   {
      $('#key_set').css({
         left: ($(window).width() - $('#key_set').outerWidth()) / 2,
         top : ($(window).height() - $('#key_set').outerHeight()) / 2
      });

      menuSelection.play();
      menuSelection.currentTime = 0;
      
      $("#key_set").find("div").css({ 'width': 500, 'height' : 50, top: 10 });
      $("#key_set").show();
   }
   else
   {
      menuSelection.play();
      menuSelection.currentTime = 0;

      $("#key_set").hide();
   }
}

// TODO:마우스가 페이지 밖으로 나갔을 때의 로그아웃 처리.
$(document).mousemove(function(e){
   if(e.clientY < 0)
   {
      socket.userInit.emit('logout_msg', { 
         'username' : user['name'],
          'mineral' : user.resource['mineral'],
              'gas' : user.resource['gas'],
          'unknown' : user.resource['unknown'],          
             'exp'  : user.state['exp'],
              'hp'  : user.state['hp'],
      });       
   }
   if(navigator.onLine == false)
   {
      console.log("This browser is online? " + navigator.onLine);
      socket.userInit.emit('logout_msg', { 
         'username' : user['name'],
          'mineral' : user.resource['mineral'],
              'gas' : user.resource['gas'],
          'unknown' : user.resource['unknown'],          
             'exp'  : user.state['exp'],
              'hp'  : user.state['hp'],
      });  
      localStorage.setItem('username');
      localStorage.setItem('exp');
      localStorage.setItem('hp');
      localStorage.setItem('mineral');
      localStorage.setItem('gas');
      localStorage.setItem('unknown');
      localStorage.setItem('x');
      localStorage.setItem('y'); 
   }
   else
   {
      localStorage.removeItem('username');
      localStorage.removeItem('exp');
      localStorage.removeItem('hp');
      localStorage.removeItem('mineral');
      localStorage.removeItem('gas');
      localStorage.removeItem('unknown');
      localStorage.removeItem('x');
      localStorage.removeItem('y'); 
   }
   //TODO:새로 고침이나 탭 키등 브라우저에 상에 조작을 가할 수 있는 키를 제한 시켜야 함.
}

//TODO: SHOOT STYLE 3
function shooting() 
{
   $('div[id=' + user['name'] + 'lazser]').each(function(){ // Move Bullets
      var lazerX = parseInt($(this).css('left')); // get x position
      var lazerY = parseInt($(this).css('top')); // get y position
      $(this).css('left', lazerX + speed); // update x
      $(this).css('top', lazerY + speed);       
    });
}

setInterval(shooting, 1000);

function shoot(ev, user) 
{
   var x = user['x'];
   var y = user['y'];
   var lazer = $("#" + user['name'] + "layer");

   fire.play();
   fire.currentTime = 0;
   
   switch(keyState) 
   {
      case LEFT:
         $("#main_layer").append(lazer);
         lazer.attr(lazer).css({ left : x - 64, top  : y });
         break;
         
      case RIGHT: 
         $("#main_layer").append(lazer);
         lazer.attr(lazer).css({ left : x + 64, top  : y });
         break;

      case UP:
         $("#main_layer").append(lazer);
         lazer.attr(lazer).css({ left : x, top  : y - 64});
         break;
         
      case DOWN: 
         $("#main_layer").append(lazer);
         lazer.attr(lazer).css({ left : x, top  : y + 64});
         break;
         
      default:
         break;
  }
} 

//TODO: SHOOT STYLE 2
function fire(keyState) 
{
   if(keyState == LEFT)
   {
      $("#" + user['name']).append($("<div>").addClass("bullet").css(user['x'] + speed, 0));
   }
   else if(keyState == RIGHT)
   {
      $("#" + user['name']).appned($("<div>").addClass("bullet").css(user['x'] - speed, 0));
   }
   else if(keyState == UP)
   {
      $("#" + user['name']).append($("<div>").addClass("bullet").css(0, user['y'] - speed));
   }
   else if(keyState == DOWN)
   {
      $("#" + user['name']).appned($("<div>").addClass("bullet").css(0, user['y'] - speed));
   }
   else
   {
      console.log("Not a direction key pressed!");
   }
}
//TODO: Not a click. Just if you press key direction button, this lazer is shooted!
$("input").click(fire);

function update() 
{
   //TODO: Change position in bullet
   $(".bullet").each(function() {
      var oldLeft = $(this).offset().left;
      console.log(oldLeft);
      $(this).css("left", oldLeft + speed);
   });
}
setInterval(update, 200);

//TODO: SHOOT STYLE 1
var shoot = function(user) {

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

   laserX = user['x'];
   laserY = user['y'];

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
         left : laserX + 64,
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
         top : leserY + 64
      });
   }
};
         $("#main_layer").append(
            "<div id ='" + enemy[data.username] + "' style='position:absolute;'></div>"
         );

         $("#" + enemy[data.username]).append(
            "<div style='position:absolute; bottom: 0px; color: white; font-weight: bold;'>" 
            + enemy[data.username] + "</div>"
         );
*/









