/**
   ** File name: main.js
   ** File explanation: Control main html page with javascript and Jquery	
   ** Author: luxoss
*/


//TODO: http://203.237.179.21 have to change that 'game.smuc.ac.kr' 
var serverUrl = "http://game.smuc.ac.kr";
var indexPageUrl = serverUrl;

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
var devMineral    = Number(user.resource.mineral), 
    devGas        = Number(user.resource.gas),     
    devUnknown    = Number(user.resource.unknown), 
    devScore      = Number(user.state.score),      
    devTicket     = Number(user.state.ticket);
         
var discovered    = new Audio(),
    menuSelection = new Audio(),
    developPlanet = 0;

menuSelection.src = serverUrl + "/res/sound/effect/menu_selection.wav";

$(document).ready(function(){ // After onload main html document, execute inner functions
   popUpMsg(user['name'] + "님SPACE LOG 세계에 오신 것을 환영합니다.");

   drawAllAssets("planets", user, socket); 		

   backgroundSoundControl();
   loginAll(user, enemy, socket);

   $('#main_pop_up_view').css({
      'left' : ($(window).width() - $('#main_pop_up_view').outerWidth()) / 2,
      'top'  : ($(window).height() - $('#main_pop_up_view').outerHeight()) / 2
   });

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
   //TODO: The resources are increased by 1/6sec
   setInterval(function(){
   }, 6000);
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

      if(data['username'] !== user['name']) 
      {
         enemy[data.username] = data.username;
         enemy[data.username + "X"] = parseInt(data['location_x']);
         enemy[data.username + "Y"] = parseInt(data['location_y']); 

         $("#" + enemy[data.username]).css({ 
            "backgroundImage" : "url('http://game.smuc.ac.kr/res/img/space_ship2_right.svg')",
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
   var image = { clnt  : "url('http://game.smuc.ac.kr/res/img/space_ship1_up.svg')" };

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
            'left'             : Math.floor(Math.random() * 9000 - 1),
            'top'              : Math.floor(Math.random() * 9000 - 1),
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
            'left'             : Math.floor(Math.random() * 5000 - 1),
            'top'              : Math.floor(Math.random() * 5000 - 1),
            'border'           : '0px',
            'border-radius'    : '10px'
         });
      } 
   }

   socket.planet.emit('planet_req', {'ready' : 'Ready to receive' });

   socket.planet.on('planet_res', function(data) {
      var planet = {
         id : "행성" + data.p_id,
         x  : data.location_x,
         y  : data.location_y,
         grade : data.create_spd,
         mineral : data.mineral,
         gas : data.gas,
         unknown : data.unknown,
         image : { 
            1 :  "url('http://game.smuc.ac.kr/res/img/planet/planet_5.png')",
            2 :  "url('http://game.smuc.ac.kr/res/img/planet/planet_7.png')",
            3 :  "url('http://game.smuc.ac.kr/res/img/planet/planet_9.png')",
            4 :  "url('http://game.smuc.ac.kr/res/img/planet/planet_11.png')",
            5 :  "url('http://game.smuc.ac.kr/res/img/planet/planet_12.png')"
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
            "<div style='position:absolute; width: 100px; left:0px; top:100px; color:rgba(255, 255, 0, 0.7); font-weight:bold; text-align: center;'>" 
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
            "<div style='position:absolute; width: 100px; left:0px; top:100px; color:rgba(255, 255, 0, 0.7); font-weight:bold; text-align: center;'>" 
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
            "<div style='position:absolute; width: 100px; left:0px; top:100px; color:rgba(255, 255, 0, 0.7); font-weight:bold; text-align: center;'>" 
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
            "<div style='position:absolute; width: 100px; left:0px; top:100px; color:rgba(255, 255, 0, 0.7); font-weight:bold; text-align:center;'>" 
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
            "<div style='position:absolute; width: 100px; left:0px; top:100px; color:rgba(255, 255, 0, 0.7); font-weight:bold; text-align: center;'>" 
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
   var BATTLESHIP_BTN = 66, MINIMAP_BTN = 77, PLANET_BTN = 80, 
       LOGOUT_BTN = 81, RANK_BTN = 82, KEYSET_BTN = 73,
       DEVELOP_PLANET = 32, FOCUS = 83, SHIFT = 16, CTRL = 17, 
       BACK_SPACE = 8, F5 = 116;
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
   
   $('body').keydown(function(event){   
      
      var keyState = event.keyCode;
      var viewOffset = $("#view_layer").offset();
      var offset = $("#" + user['name']).offset();
      
      if(keyState == F5) { return false; } 
      if(keyState == SHIFT) { return false; }
          
      if(keyState == LEFT)
      {
         //if(user['x'] <= 0) { bg.x("main_layer", bg.x("main_layer") - 0); }

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
         //if(user['y'] <= 0) { bg.y("main_layer", bg.y("main_layer") + 0); }

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
         //if(user['x'] >= 3430) { bg.x("main_layer", bg.x("main_layer") + 0); }

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
         //if(user['y'] >= 3430) { bg.y("main_layer", bg.y("main_layer") - 0); }

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
            $(location).attr('href', 'http://game.smuc.ac.kr');	
         }
      }
      
      if(keyState == DEVELOP_PLANET) { develop(user, socket); }              
      
      event.stopImmediatePropagation();
   });

   // Handling keyup event.
   $('body').keyup(function(event){ 

      if(event.keyCode == BACK_SPACE) { return false; }
      if(event.keyCode == F5) { return false; } 
      if(event.keyCode == SHIFT) { return false; }
      if(event.keyCode == LEFT) { return false; }
      if(event.keyCode == RIGHT) { return false; }
      if(event.keyCode == UP) { return false; }
      if(event.keyCode == DOWN) { return false; }
      if(event.keyCode == DEVELOP_PLANET) { return false; }
      if(event.keyCode == MINIMAP_BTN) { return false; }
      if(event.keyCode == RANK_BTN) { return false; }
      if(event.keyCode == LOGOUT_BTN) { return false; }
      if(event.keyCode == PLANET_BTN) { return false; }
      if(event.keyCode == FOCUS) { return false; }

      event.stopImmediatePropagation();
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
      menuSelection.play();
      menuSelection.currentTime = 0;
      planetViewLayer(user, socket);

      event.stopImmediatePropagation();

   });

   $("#rank_btn").click(function(event){ 
      menuSelection.play();
      menuSelection.currentTime = 0;
      rankViewLayer();

      event.stopImmediatePropagation();
   });

   $('#minimap_btn').click(function(event){ 
      drawMinimap(user, enemy, socket);   

      event.stopImmediatePropagation();
   });
}

var develop = function(user, socket) {
   var devUser = user;
   var devSocket = socket;

   //TODO: Test this code line.

   devSocket.userPos.emit('collision_req', {
      'username' : devUser['name'], 
      'location_x' : user['x'],
      'location_y' : user['y'],
   });

   devSocket.userPos.on('collision_res', function(data) {
      //console.log(data);
      var developPlanetInfo = {
         name : $("#p_name").text("행성" + data.p_id),
         resource : {
            mineral : $("#p_mineral").text(data.mineral),
            gas : $("#p_gas").text(data.gas),
            unknown : $("#p_unknown").text(data.unknown)
         },
         grade : $("#p_grade").text((Number(data.create_spd) + 1)),
         develop : $("#p_develop")
      };
      
      var collisionFlag = Number(data['collision']),
          developThis = data['develop'];
      
      developPlanet = data['p_id'];

      if((collisionFlag === 1) && (developThis === "false") && (devTicket > 0)) 
      {
         var state = $("#develop_planet_ui").css('display');

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

            $("#cancel").mouseover(function(event) {
               menuSelection.play();
               $("#cancel").css('color', 'rgba(255, 255, 0, 1)');
               menuSelection.currentTime = 0;

               event.stopImmediatePropagation();
            });

            $("#cancel").mouseout(function(event) {
               menuSelection.play();
               $("#cancel").css('color', 'rgba(255, 255, 255, 1)');
               menuSelection.currentTime = 0;

               event.stopImmediatePropagation();
            });

            $("#cancel").click(function(event){
               $("#develop_planet_ui").hide();
               event.stopImmediatePropagation();
            });

            $("#develop_planet").mouseover(function(event) {
               menuSelection.play();
               $("#develop_planet").css('color', 'rgba(255, 255, 0, 1)');
               menuSelection.currentTime = 0;

               event.stopImmediatePropagation();
            });

            $("#develop_planet").mouseout(function(event) {
               menuSelection.play();
               $("#develop_planet").css('color', 'rgba(255, 255, 255, 1)');
               menuSelection.currentTime = 0;

               event.stopImmediatePropagation();
            });
            
            // Developed planet event that clicked.
            $("#develop_planet").click(function(event){
               $("#develop_planet_ui").hide();
               devPopUpMsg(devSocket, devUser, developPlanet, data['p_id'] + "행성을 방어할 숫자(1~10)를 입력하세요!");
               event.stopImmediatePropagation();
            });
         }
      }
      else if(collisionFlag === 1 && developThis === "true" && devTicket > 0)
      {
         if(user['name'] === data['username'])
         {
            popUpMsg("이미 개척하신 행성입니다.");
         }
         else
         {
            extractPlanet(devSocket, devUser, developPlanet, "[" + data['username'] + "]" + " 께서 개척하신 행성입니다.");
         }
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
};

function devPopUpMsg(devSocket, devUser, developPlanet, msg)
{
   var state = $("#detect_planets_number_display").css('display');

   $("#detect_planets_number_display").css({
      'left' : ($(window).width() - $("#detect_planets_number_display").outerWidth()) / 2, 
      'top'  : ($(window).height() - $("#detect_planets_number_display").outerHeight()) / 2
   });

   if(state == 'none') 
   {
      $("#detect_planets_number_display").show();
      $("#detect_number_msg").text(msg);

      $("#submit_choose_number").mouseover(function(event){
         menuSelection.play();
         $("#submit_choose_number").css('background-color', 'rgba(255, 0, 0, 0.3)');
         menuSelection.currentTime = 0;

         event.stopImmediatePropagation();
      });

      $("#submit_choose_number").mouseout(function(event){
         $("#submit_choose_number").css('background-color', 'rgba(0, 0, 0, 0.7)');

         event.stopImmediatePropagation();
      });

      $("#cancel_include_planet_core").mouseover(function(event){
         menuSelection.play();
         $("#cancel_include_planet_core").css('background-color', 'rgba(0, 0, 255, 0.3)');
         menuSelection.currentTime = 0;

         event.stopImmediatePropagation();
      });

      $("#cancel_include_planet_core").mouseout(function(event){
         $("#cancel_include_planet_core").css('background-color', 'rgba(0, 0, 0, 0.7)');

         event.stopImmediatePropagation();
      });
      
      $("#submit_choose_number").click(function(event){
         var chooseNum = document.getElementById('input_number_text_field').value;

         chooseNum = Number(chooseNum);
        
         if(isNaN(chooseNum) === true)
         {
            popUpMsg("수가 아닙니다. 행성을 방어할 숫자를 입력해주세요. :)");
         }
         else if($("#input_number_text_field").val() == '')
         {
            popUpMsg("행성을 방어할 숫자를 입력해주세요. :)"); 
         }
         else if((chooseNum >= 1) && (chooseNum <= 10))
         {
            devSocket.develop.emit('add_p', {
               'username' : devUser['name'], 
               'p_id' : developPlanet,
               'choose_number' : chooseNum
            });

            devSocket.develop.on('add_p_res_userinfo', function(data){
               devScore  = Number(data.score);  
               devTicket = Number(data.ticket);

               $("#score_point").text(devScore);
               $("#ticket_point").text(devTicket);
            });

            devSocket.develop.on('chng_info', function(data){
               devMineral = Number(data.mineral);
               devGas     = Number(data.gas);
               devUnknown = Number(data.unknown);

               $("#mineral").text(devMineral);
               $("#gas").text(devGas);
               $("#unknown").text(devUnknown); 

               $("#detect_planets_number_display").hide();
               popUpMsg("행성이 개척되었습니다. :)");       
            });
         }
         else
         {
            popUpMsg("1에서 10사이의 수를 입력해주세요. :)");
         }

         event.stopImmediatePropagation();
      });

      $("#cancel_include_planet_core").click(function(event){
         $("#detect_planets_number_display").hide();
         $("#input_number_text_field").val('');

         event.stopImmediatePropagation();
      });
   }
}

function extractPlanet(devSocket, devUser, developPlanet, msg)
{
   var state = $("#extract_planets_number_display").css('display');

   $("#extract_planets_number_display").css({
      'left' : ($(window).width() - $("#extract_planets_number_display").outerWidth()) / 2, 
      'top'  : ($(window).height() - $("#extract_planets_number_display").outerHeight()) / 2
   });
   
   $("#input_extract_planet_core_field").val('');

   if(state == 'none') 
   {
      $("#extract_planets_number_display").show();
      $("#extract_number_msg").text(msg);

      $("#extract_planet_core").mouseover(function(event){
         menuSelection.play();
         $("#extract_planet_core").css('background-color', 'rgba(255, 0, 0, 0.3)');
         menuSelection.currentTime = 0;

         event.stopImmediatePropagation();
      });

      $("#extract_planet_core").mouseout(function(event){
         $("#extract_planet_core").css('background-color', 'rgba(0, 0, 0, 0.7)');

         event.stopImmediatePropagation();
      });

      $("#cancel_extract_planet_core").mouseover(function(event){
         menuSelection.play();
         $("#cancel_extract_planet_core").css('background-color', 'rgba(0, 0, 255, 0.3)');
         menuSelection.currentTime = 0;

         event.stopImmediatePropagation();
      });

      $("#cancel_extract_planet_core").mouseout(function(event){
         $("#cancel_extract_planet_core").css('background-color', 'rgba(0, 0, 0, 0.7)');

         event.stopImmediatePropagation();
      });
       
      $("#extract_planet_core").click(function(event){
         var extractNum = document.getElementById('input_extract_planet_core_field').value;
         
         extractNum = Number(extractNum);

         if(isNaN(extractNum) === true)
         {
            popUpMsg("수가 아닙니다. 행성을 쟁취할 키를 입력하세요. :)");
         }
         else if($("#input_extract_planet_core_field").val() == '')
         {
            popUpMsg("행성을 쟁취할 키를 입력해주세요. :)"); 
         }
         else if((extractNum >= 1) && (extractNum <= 10))
         {         
            devSocket.develop.emit('bet_add_p', {
               'username' : devUser['name'], 
               'p_id' : developPlanet,
               'choose_number' : extractNum
            });

            devSocket.develop.on('bet_num', function(data) {
               console.log("[CLIENT LOG]", data);
               var betFlag = {
                  success : "success",
                  fail : "fail",
                  same : "same"
               };
               console.log(betFlag['success'], betFlag['fail'], betFlag['same']);

               if(data === betFlag['fail'])
               {
                  devSocket.develop.on('chng_user', function(data) {
                     devMineral = Number(data.mineral);
                     devGas     = Number(data.gas);
                     devUnknown = Number(data.unknown);

                     $("#mineral").text(devMineral);
                     $("#gas").text(devGas);
                     $("#unknown").text(devUnknown); 
                  });

                  popUpMsg("행성 코어를 각인할 수가 없습니다. 다시 시도해주세요. :(");
               }
               else if(data === betFlag['success'])
               {
                  devSocket.develop.on('add_p_res_userinfo', function(data){
                     devScore  = Number(data.score);  
                     devTicket = Number(data.ticket);

                     $("#score_point").text(devScore);
                     $("#ticket_point").text(devTicket);
                  });

                  devSocket.develop.on('chng_info', function(data){
                     devMineral = Number(data.mineral);
                     devGas     = Number(data.gas);
                     devUnknown = Number(data.unknown);

                     $("#mineral").text(devMineral);
                     $("#gas").text(devGas);
                     $("#unknown").text(devUnknown); 
                  });

                  $("#extract_planets_number_display").hide();
                  popUpMsg(devPlanet + "행성을 점령하였습니다. :)");                  
               }
               else if(data === betFlag['same'])
               {
                  devSocket.develop.on('chng_user', function(data) {
                     devMineral = Number(data.mineral);
                     devGas     = Number(data.gas);
                     devUnknown = Number(data.unknown);

                     $("#mineral").text(devMineral);
                     $("#gas").text(devGas);
                     $("#unknown").text(devUnknown); 
                  });
                  
                  $("#extract_planets_number_display").hide();
                  popUpMsg("행성을 반환합니다. :(");
               }
               else
               {
                  console.log("[CLIENT LOG]", data);
               }
            });
         }
         else
         {
            popUpMsg("1에서 10사이의 수를 입력해주세요. :)");
         }

         event.stopImmediatePropagation();
      });

      $("#cancel_extract_planet_core").click(function(event){
         $("#extract_number_msg").val('');
         $("#extract_planets_number_display").hide();

         event.stopImmediatePropagation();
      });
   }
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

            localStorage.clear();

            socket.userInit.disconnect();
            socket.userInfo.disconnect();
            socket.userPos.disconnect();
            socket.develop.disconnect();
            socket.planet.disconnect();   
                       
            $(location).attr('href', 'http://game.smuc.ac.kr');
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
         LEFT : "url('http://game.smuc.ac.kr/res/img/space_ship1_left.svg')",
         RIGHT: "url('http://game.smuc.ac.kr/res/img/space_ship1_right.svg')",
         UP   : "url('http://game.smuc.ac.kr/res/img/space_ship1_up.svg')",
         DOWN : "url('http://game.smuc.ac.kr/res/img/space_ship1_down.svg')"
      },

      others : {
         LEFT : "url('http://game.smuc.ac.kr/res/img/space_ship2_left.svg')",
         RIGHT: "url('http://game.smuc.ac.kr/res/img/space_ship2_right.svg')",
         UP   : "url('http://game.smuc.ac.kr/res/img/space_ship2_up.svg')",
         DOWN : "url('http://game.smuc.ac.kr/res/img/space_ship2_down.svg')"
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

               if(user['x'] >= 4930) 
               {
                  user['x'] = 4930;
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

               if(user['y'] >= 4930) 
               {
                  user['x'] = parseInt(data.location_x);
                  user['y'] = 4930;

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
       LEFT : "url('http://game.smuc.ac.kr/res/img/missile/laser_left.svg')",
      RIGHT : "url('http://game.smuc.ac.kr/res/img/missile/laser_right.svg')",
         UP : "url('http://game.smuc.ac.kr/res/img/missile/laser_up.svg')",
       DOWN : "url('http://game.smuc.ac.kr/res/img/missile/laser_down.svg')"
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









