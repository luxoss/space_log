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
        score : parseInt(localStorage.getItem('score')),
        ticket : parseInt(localStorage.getItem('ticket'))
   }
};
var enemy = {}; // Create other users object

// Set develop information that are resource, score, and ticket. 
var devMineral    = Number(user.resource.mineral); //parseInt(localStorage.getItem('mineral'), 10);
var devGas        = Number(user.resource.gas);     //parseInt(localStorage.getItem('gas'), 10);
var devUnknown    = Number(user.resource.unknown); //parseInt(localStorage.getItem('unknown'), 10);
var devScore      = Number(user.state.score);      //parseInt(localStorage.getItem('score'), 10);
var devTicket     = Number(user.state.ticket);     //parseInt(localStorage.getItem('ticket'), 10);

var discovered    = new Audio();
var menuSelection = new Audio();
var developPlanet = 0;

//discovered.src = serverUrl + ":8000/res/sound/effect/kkang.mp3";
menuSelection.src = serverUrl + ":8000/res/sound/effect/menu_selection.wav";

$(document).ready(function(){ // After onload document, execute inner functions

   backgroundSoundControl();
   loginAll(user, enemy, socket);

   $('#main_pop_up_view').css({
      'left' : ($(window).width() - $('#main_pop_up_view').outerWidth()) / 2,
      'top'  : ($(window).height() - $('#main_pop_up_view').outerHeight()) / 2
   });

   popUpMsg(user.name + "님SPACE LOG 세계에 오신 것을 환영합니다.");

   drawAllAssets("planets", user, socket); 		

   keyHandler(user, socket);
   userPosUpdate(user, enemy); 

   socket.userInit.on('logout_all', function(data) {

      if(data['username'] !== user['name']) 
      {
         delete enemy[data.username];
         delete enemy[data.username + "X"];
         delete enemy[data.username + "Y"];

         $("#" + enemy[data.username]).remove();
         $("#" + data.username).remove(); 
      } 

   });
/*
   socket.develop.on('chng_info', function(data){
      console.log("receive resource");

      devMineral = parseInt(data.mineral);
      devGas = parseInt(data.gas);
      devUnknown = parseInt(data.unknown);

      $("#mineral").text(parseInt(devMineral));
      $("#gas").text(parseInt(devGas));
      $("#unknown").text(parseInt(devUnknown));
   });
*/
});

function backgroundSoundControl()
{
   $("#bg_sound_control").click(function(event){
      //.off('click.bg_sound_control').on('click.bg_sound_control', function() {
      var bgSound = document.getElementById('main_bg_sound');

      if(bgSound.paused)
      {
         $("#bg_sound_control").css('color', 'rgba(255, 255, 255, 0.7)');
         $("#bg_sound_control").text("[SOUND | ON]");
         bgSound.play();
      }
      else
      {
         $("#bg_sound_control").css('color', 'rgba(207, 47, 77, 0.7)');
         $("#bg_sound_control").text("[SOUND | OFF]");
         bgSound.pause();
         bgSound.currentTime = 0;
      }

      event.stopImmediatePropagation();
   });
}
         
function loginAll(user, enemy, socket)
{
  socket.userPos.on('login_all', function(data) {
      //console.log("[CLIENT LOG] me: ", user['name']);

      if(data['username'] !== user['name']) 
      {
         enemy[data.username] = data.username;
         enemy[data.username + "X"] = parseInt(data['location_x']);
         enemy[data.username + "Y"] = parseInt(data['location_y']); 

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
   var score = user.state['score'];
   var mineral = user.resource['mineral'];
   var gas = user.resource['gas'];
   var unknown = user.resource['unknown'];
   var ticket  = user.state['ticket'];
   var ENTER = 13;
   var image = { clnt  : "url('http://game.smuc.ac.kr:8000/res/img/space_ship1_up.svg')" };

   socket.planet.emit('planet_req', {'ready' : 'Ready to receive' });

   $(window).resize(function() {

      $("#main_layer").css({ // left : 1920, top : 1080 
         left: 1920, //($(window).width() - $('#main_layer').outerWidth()) / 2,
         top : 1080//($(window).height() - $('#main_layer').outerHeight()) / 2
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

   for(var i = 0; i <= 777; i++)
   {
      if(i % 1 === 0)
      {
         $('#star_boxes').append(
            "<div id='star_" + i + "' style='position:absolute; width: 10px; height: 10px;'></div>"
         );

         $("#star_" + i).css({
            'background-color' : 'rgba(255, 255, 0, 1)',
            'left'             : Math.floor(Math.random() * 7000 - 1),
            'top'              : Math.floor(Math.random() * 7000 - 1),
            'border'           : '0px',
            'border-radius'    : '5px'
         });
      }
      
      if(i % 2 === 0)
      {
         $('#main_star_boxes').append(
            "<div id='star_" + i + "' style='position:absolute; width: 10px; height: 10px;'></div>"
         );

         $("#star_" + i).css({
            'background-color' : 'rgba(255, 255, 255, 0.8)',
            'left'             : Math.floor(Math.random() * 3500 - 1),
            'top'              : Math.floor(Math.random() * 3500 - 1),
            'border'           : '0px',
            'border-radius'    : '10px'
         });
      } 
   }

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
            //"border" : "1px solid rgba()",
            //"border-radius" : "15px",
            //"border-style"  : "dotted",
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
            //"border" : "1px solid rgba()",
            //"border-radius" : "15px",
            //"border-style"  : "dotted",
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
            //"border" : "1px solid rgba()",
            //"border-radius" : "15px",
            //"border-style"  : "dotted",
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
            //"border" : "1px solid rgba()",
            //"border-radius" : "15px",
            //"border-style"  : "dotted",
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
   $("#ticket_point").text(ticket);

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
      //"border" : "1px solid rgba(255, 255, 0, 0.3)",
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
   localStorage.removeItem('score');
   localStorage.removeItem('ticket');
}

function keyHandler(user, socket) 
{
   //console.log("[CLIENT LOG] KeyHandler is called.");
   
   var userId = user['name'];
   var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
   var BATTLESHIP_BTN = 66, MINIMAP_BTN = 77, PLANET_BTN = 80, LOGOUT_BTN = 81, RANK_BTN = 82, KEYSET_BTN = 73;
   var DEVELOP_PLANET = 32, FOCUS = 83, SHIFT = 16, CTRL = 17, BACK_SPACE = 8, F5 = 116;
   //shift: 16, backspace: 8, f5:116, tab: 9, ctrl: 17 
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
   
   $('body').keydown(function(ev){ //.off('keydown').on('keydown', function(ev) {  
      
      var keyState = ev.keyCode;
      var viewOffset = $("#view_layer").offset();
      var offset = $("#" + user['name']).offset();

      ev.stopImmediatePropagation();
      
      if(keyState == BACK_SPACE) { return false; }
      if(keyState == F5) { return false; } 
      if(keyState == SHIFT) { return false; }
          
      if(keyState == LEFT)
      {
//         if(user['x'] <= 0) { bg.x("main_layer", bg.x("main_layer") - 0); }

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
//         if(user['y'] <= 0) { bg.y("main_layer", bg.y("main_layer") + 0); }

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
//         if(user['x'] >= 3430) { bg.x("main_layer", bg.x("main_layer") + 0); }

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
//         if(user['y'] >= 3430) { bg.y("main_layer", bg.y("main_layer") - 0); }

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
         develop(user, socket);
      }
              
   });

   // Handling keyup event.
   $('body').keyup(function(ev){ 
      //.off('keyup').on('keyup', function(ev) {

      ev.stopImmediatePropagation();

      if(ev.keyCode == BACK_SPACE) { return false; }
      if(ev.keyCode == F5) { return false; } 
      if(ev.keyCode == SHIFT) { return false; }

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
   
   $("#logout_btn").click(function(event){ 

      //.off('click.logout').on('click.logout', function(event){	
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

   $("#planet_btn").click(function(event){ 

      //.off('click.planet').on('click.planet', function(event) {
      menuSelection.play();
      menuSelection.currentTime = 0;
      planetViewLayer(user, socket);

      event.stopImmediatePropagation();

   });

   $("#rank_btn").click(function(event){ 

      //.off('click.rank').on('click.rank', function(event) {
      menuSelection.play();
      menuSelection.currentTime = 0;
      rankViewLayer();

      event.stopImmediatePropagation();
   });

   $('#minimap_btn').click(function(event){ 

      //.off('click.minimap_btn').on('click.minimap_btn', function(event) {      
      drawMinimap(user, enemy, socket);   

      event.stopImmediatePropagation();

   });
}

function develop(user, socket)
{
   socket.userPos.emit('collision_req', {
      'username' : user['name'], 
      'location_x' : user['x'],
      'location_y' : user['y'],
   });

   socket.userPos.on('collision_res', function(data) {
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

      var collisionFlag = parseInt(data['collision'], 10);
      var collisionUser = parseInt(data['username'], 10);
      var developThis = data['develop'];

      if((collisionFlag === 1) && (developThis === 'false') && (devTicket > 0)) 
      {
         var state = $("#develop_planet_ui").css('display');

         developPlanet = data['p_id'];

         $("#develop_planet_ui").css({
            left: ($(window).width() - $("#develop_planet_ui").outerWidth()) / 2, 
            top: ($(window).height() - $("#develop_planet_ui").outerHeight()) / 2
         });

         if(state == 'none')
         {
            $("#develop_planet_ui").show();

            developPlanetInfo.name;
            developPlanetInfo.resource.mineral;
            developPlanetInfo.resource.gas;
            developPlanetInfo.resource.unknown;
            developPlanetInfo.grade;
            developPlanetInfo.develop.text("미개척 행성");
         }

         $("#cancel").mouseover(function(event) {
            menuSelection.play();
            $("#cancel").css('color', 'rgba(255, 255, 0, 0.7)');
            menuSelection.currentTime = 0;

            event.stopImmediatePropagation();
         });

         $("#cancel").mouseout(function() {
            menuSelection.play();
            $("#cancel").css('color', 'rgba(255, 255, 255, 0.7)');
            menuSelection.currentTime = 0;
         });

         $("#cancel").click(function(event){
            $("#develop_planet_ui").hide();

            event.stopImmediatePropagation();
         });

         $("#develop_planet").mouseover(function(event) {

            menuSelection.play();
            $("#develop_planet").css('color', 'rgba(255, 255, 0, 0.7)');
            menuSelection.currentTime = 0;

            event.stopImmediatePropagation();

         });

         $("#develop_planet").mouseout(function(event) {

            menuSelection.play();
            $("#develop_planet").css('color', 'rgba(255, 255, 255, 0.7)');
            menuSelection.currentTime = 0;

            event.stopImmediatePropagation();
         });
         
         // Developed planet event that clicked.
         $("#develop_planet").click(function(event){

            socket.develop.emit('add_p', {'username' : user['name'], 'p_id' : developPlanet});

            socket.develop.on('add_p_res_userinfo', function(data){

               devScore  = parseInt(data.score, 10);  // Number() -> parseInt()
               devTicket = parseInt(data.ticket, 10); // Number() -> parseInt()

               $("#score_point").text(devScore);
               $("#ticket_point").text(devTicket);

            });

            socket.develop.on('chng_info', function(data){

               devMineral = parseInt(data.mineral, 10);
               devGas     = parseInt(data.gas, 10);
               devUnknown = parseInt(data.unknown, 10);

               $("#mineral").text(devMineral);
               $("#gas").text(devGas);
               $("#unknown").text(devUnknown); 

            });
          
            $("#develop_planet_ui").hide();
        
            popUpMsg("Complete develop planet.");      

            event.stopImmediatePropagation();
         });
      }
      else if(collisionFlag == 1 && developThis === 'true')
      {
         popUpMsg(data['username'] + "께서 개척하신 행성입니다.");
      }
      else if(devTicket == 0)
      {
         popUpMsg("티켓이 없어 더이상 개척을 진행할 수 없습니다.");
      }
      else
      {
         console.log('[CLIENT LOG]: ', data);
      }
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
*/
            socket.userInit.disconnect();
            socket.userInfo.disconnect();
            socket.userPos.disconnect();
            socket.develop.disconnect();
            socket.planet.disconnect();   
                       
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
              
               $("#position_x").text(user['x']);

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

               $("#position_x").text(user['x']);

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

	            user['y'] = parseInt(data.location_y);

               $("#position_y").text(user['y']);

               if(user['y'] <= 0) 
               {
                  user['x'] = parseInt(data.location_x);
                  user['y'] = 0;

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

	            user['y'] = parseInt(data.location_y);

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
         enemy[data.username + "X"] = parseInt(data.location_x, 10);
         enemy[data.username + "Y"] = parseInt(data.location_y, 10);

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

               enemy[data.username + "X"] = parseInt(data.location_x, 10);
	            enemy[data.username + "Y"] = parseInt(data.location_y, 10);
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
               		
               enemy[data.username + "X"] = parseInt(data.location_x, 10);
		         enemy[data.username + "Y"] = parseInt(data.location_y, 10);
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
               		
               enemy[data.username + "X"] = parseInt(data.location_x, 10);
		         enemy[data.username + "Y"] = parseInt(data.location_y, 10);
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
               	
               enemy[data.username + "X"] = parseInt(data.location_x, 10);
		         enemy[data.username + "Y"] = parseInt(data.location_y, 10);
		         break;
		
            default:
               console.log("[CLIENT LOG] 1050:", enemy[data.username]);
               break;
         }
      }
      else
      {
         console.log("[CLIENT LOG] 1056:", data);
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
}

/*
function devPopUpMsg()
{
   var state = $("#develop_planet_question_pop_up_view").css('display');
   var chooseNum = $("#anser_develop_msg").val();

   if(state == 'none') {
      $("#develop_planet_question_pop_up_view").show();
      $("#question_develop_msg").text(msg);
   }
}

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
   var isFire = false;

   if(keyState == LEFT)
   {
      $("#" + user['name']).append($("<div>").addClass("bullet").css(user['x'] + speed, 0));
   }
   
   if(keyState == RIGHT)
   {
      $("#" + user['name']).appned($("<div>").addClass("bullet").css(user['x'] - speed, 0));
   }
   
   if(keyState == UP)
   {
      $("#" + user['name']).append($("<div>").addClass("bullet").css(0, user['y'] - speed));
   }
   
   if(keyState == DOWN)
   {
      $("#" + user['name']).appned($("<div>").addClass("bullet").css(0, user['y'] - speed));
   }
}

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

   laserX = parseInt(user['x'], 10);
   laserY = parseInt(user['y'], 10);

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
*/









