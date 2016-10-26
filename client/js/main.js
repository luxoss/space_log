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
   userPos  : io.connect(serverUrl + ":5006"),
   develop  : io.connect(serverUrl + ":5003"),
   planet   : io.connect(serverUrl + ":5002")
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

var devMineral = parseInt(localStorage.getItem('mineral'));
var devGas = parseInt(localStorage.getItem('gas'));
var devUnknown = parseInt(localStorage.getItem('unknown'));

var enemyPosX = 0, enemyPosY = 0;	// Create enemy x, y position
var isKeyDown = [];		            // Create key state array to keyboard polling  
var fire = new Audio();
var discovered = new Audio();
var menuSelection = new Audio();
var eventCount = 0;

fire.src = serverUrl + ":8000/res/sound/effect/laser.wav";
discovered.src = serverUrl + ":8000/res/sound/effect/kkang.mp3";
menuSelection.src = serverUrl + ":8000/res/sound/effect/menu_selection.wav";

$(document).ready(function(){ // After onload document, execute inner functions
   $('#main_pop_up_view').css({
      'left' : ($(window).width() - $('#main_pop_up_view').outerWidth()) / 2,
      'top'  : ($(window).height() - $('#main_pop_up_view').outerHeight()) / 2
   });

   popUpMsg(user.name + "님 SPACE LOG 세계에 오신 것을 환영합니다.");
   /*
   socket.userInit.on('login_all', function(data) {
      console.log("[CLIENT LOG]", data.username, 'is login!');
      
      if(data.username != user['name']) 
      {
         $("#main_layer").append("<div id ='" + data.username + "' style='position:absolute;'></div>");
      }
   });
   */
   socket.userInit.on('logout_all', function(data) {
      console.log("[CLIENT LOG]", data.username, "is logout!"); 

      if(data.username !== user['name']) 
      {
         $("#" + data.username).remove(); 
      } 
   });

   drawAllAssets("main_layer", user, socket); 		
   keyHandler(user, socket);
   userPosUpdate(user); 
/*
   localStorage.removeItem('username');
   localStorage.removeItem('exp');
   localStorage.removeItem('hp');
   localStorage.removeItem('mineral');
   localStorage.removeItem('gas');
   localStorage.removeItem('unknown');
   localStorage.removeItem('x');
   localStorage.removeItem('y'); 
*/
});
/*
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
*/
function drawAllAssets(mainLayer, user, socket) 
{
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
      drawPlanetImg(mainLayer, data);
   });		
        
   $("#mineral").text(mineral);
   $("#gas").text(gas);
   $("#unknown").text(unknown);
   $("#position_x").text(user['x']);
   $("#position_y").text(user['y']);
   $("#progress_bar").text(hp + " / 300");

   $("#user_avartar").append(
      "<div id='" + user['name'] + "'style='position:absolute; bottom:0px; color:white;'>" 
      + user['name'] + "</div>"
   );
   $("#user_name").text(user['name']);
	
   $("#main_layer").append("<div id='" + user['name'] + "' style='position:absolute;'></div>");
   $("#" + user['name']).append(
      "<div style='position:absolute; bottom: 0px; color: white; font-weight: bold;'>" 
      + user['name'] + "</div>"
   );
   $("#" + user['name']).append(
      "<div id='" + user['name'] + "_laser" + "' style='position:absolute;'></div>"
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

   // Auto focus user's battleship
   var offset = $("#" + user['name']).offset();

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
}

function keyHandler(user, socket) 
{
   console.log("[CLIENT LOG] KeyHandler is called.");

   var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
   var BATTLESHIP_BTN = 66, MINIMAP_BTN = 77, PLANET_BTN = 80, LOGOUT_BTN = 81, RANK_BTN = 82, KEYSET_BTN = 73;
   var DEVELOP_PLANET = 32, SHOOT = 83;
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
   
   // TODO: $("#" + selector :: e.g.document).on('keydown', function(ev){});
   $('body').off('keydown').on('keydown', function(ev) {  

      console.log("[CLIENT LOG] Keydown event is called.");
      
      var keyState = ev.keyCode;

      ev.stopImmediatePropagation();
          
      if(keyState == LEFT)
      {
         console.log("[CLIENT LOG] LEFT is called.");
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
         console.log("[CLIENT LOG] UP is called.");
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
         console.log("[CLIENT LOG] RIGHT is called.");
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
         console.log("[CLIENT LOG] DOWN is called.");
         bg.y("main_layer", bg.y("main_layer") - speed);

         socket.userPos.emit('press_key', {
            'username': user['name'], 
            'key_val' : DOWN, 
            'location_x' : user['x'],
            'location_y' : user['y']
         });

      }

      if(keyState == SHOOT) 
      {
         fire.play();
         console.log('fire!');
         //shoot(ev, user);
         fire.currentTime = 0;      
      }
/*
      if(keyState == BATTLESHIP_BTN) // press battle ship menu button, isKeyDown[66]
      {
         menuSelection.play();
         menuSelection.currentTime = 0; 	  
         battleShipViewLayer();
      }
*/
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
/*
      if(keyState = KEYSET_BTN) 
      {
         keySetDisplay();
      }
*/
      if(keyState == LOGOUT_BTN) // press logout(q), isKeydown[81]
      {
         if(user['name'] != null) 
         {
            logout(user);
         }
         else 
         {
            popUpMsg('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
            $(location).attr('href', 'http://203.237.179.21:8000');	
         }
      }
      
      // command line R key is 'redo' and r key is 'undo'
      if(keyState == DEVELOP_PLANET) 
      {        
         console.log("[CLIENT LOG] SPACE KEY LOG");
         
         socket.userPos.emit('collision_req', {
            'username' : user['name'], 
            'location_x' : user['x'],
            'location_y' : user['y'],
         });

         socket.userPos.on('collision_res', function(data) {
/*
            if(parseInt(data.collision) === 0)
            {
               popUpMsg("이미 개척된 행성입니다.");
            }
*/
            // 충돌 + 접속 클라이언트와의 일치여부 + 개척이 안 되어 있으면 실행
            if((data.collision == 1) && (data.username == user['name']) && (data.develop == 'false')) 
            {
               if(data.develop == 'false')
               {
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

                  var state = $('.develop_planet_ui').css('display');
                           
                  //discovered.play();
                  //discovered.currentTime = 0;

                  $('.develop_planet_ui').css({
                     left: ($(window).width() - $('.develop_planet_ui').outerWidth()) / 2, 
                     top: ($(window).height() - $('.develop_planet_ui').outerHeight()) / 2
                  });

                  if(state == 'none')
                  {
                     $(".develop_planet_ui").show();

                     developPlanetInfo.name;
                     developPlanetInfo.resource.mineral;
                     developPlanetInfo.resource.gas;
                     developPlanetInfo.resource.unknown;
                     developPlanetInfo.grade;
                     
                     if(data.develop == 'true') 
                     {
                        developPlanetInfo.develop.text("개척"); 
                     }
                     else
                     {
                        developPlanetInfo.develop.text("미 개척");
                     }
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
                     console.log("[CLINET LOG] Canceled.");
                     $(".develop_planet_ui").hide();
                     
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
                        console.log(data);
                        devMineral += parseInt(data.mineral);
                        devGas += parseInt(data.gas);
                        devUnknown += parseInt(data.unknown);
                        $("#mineral").text(parseInt(devMineral));
                        $("#gas").text(parseInt(devGas));
                        $("#unknown").text(parseInt(devUnknown));
                     });
                   
                     $(".develop_planet_ui").hide();
                 
                     popUpMsg("Complete develop planet.");      

                     event.stopImmediatePropagation();
                  });
               }
            }
         }); 
      }
   });

   // Before code line is '$(document).on('keyup', function(){});
   $('body').off('keyup').on('keyup', function(ev) {
      console.log('[CLIENT LOG] Keyup event is called.');
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

         case BATTLESHIP_BTN:
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
      planetViewLayer(socket['planet']);

      event.stopImmediatePropagation();
   });
/*
   $("#battle_ship_btn").off('click.battle_ship').on('click.battle_ship', function(event) {
      menuSelection.play();
      menuSelection.currentTime = 0;
      battleShipViewLayer();

      event.stopImmediatePropagation();
   });
*/
   $("#rank_btn").off('click.rank').on('click.rank', function(event) {
      menuSelection.play();
      menuSelection.currentTime = 0;
      rankViewLayer();

      event.stopImmediatePropagation();
   });
/*
   $('#minimap_btn').on('click.minimap_btn', function() {      
      drawMinimap(socket);
      return false;
   });
*/
}

function logout(user) 
{
   var logoutMsg = confirm('로그아웃 하시겠습니까?');
   var LOGOUT = 81;

   if(logoutMsg == true) 
   {
      socket.userInit.emit('logout_msg', { 
         'username' : user['name'],
          'mineral' : user.resource['mineral'],
              'gas' : user.resource['gas'],
          'unknown' : user.resource['unknown'],          
             'exp'  : user.state['exp'],
              'hp'  : user.state['hp'],
         'key_val'  : LOGOUT 
      }); 

      socket.userInit.on('logout_res', function(data) {
          
         if(data.response == 'true') 
         {
            socket.userInfo.emit('lpos', {
               'username': user['name'],  
               'lastPosX': user['x'],     
               'lastPosY': user['y']     
            }); 

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
   //var userId = user['name'];
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
      if(user['name'] === data['username'])  
      {
         /*
         console.log("[Client log] ", data['username'], ",x: ", data['location_x'], ",y: ", data['location_y'], ",key_value: ", data['key_val']);
         */
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

function popUpMsg(msg)
{
   var state = $("#main_pop_up_view").css('display');

   if(state == 'none') 
   {
      $("#main_pop_up_view").show();
      $("#main_pop_up_msg").text(msg);
   }
   
   $("#main_pop_up_hide").click(function() {
      $("#main_pop_up_view").hide();
      return false;
   });
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
       LEFT : "url('http://203.237.179.21:8000/res/img/missile/laser_left.svg')",
      RIGHT : "url('http://203.237.179.21:8000/res/img/missile/laser_right.svg')",
         UP : "url('http://203.237.179.21:8000/res/img/missile/laser_up.svg')",
       DOWN : "url('http://203.237.179.21:8000/res/img/missile/laser_down.svg')"
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
*/









