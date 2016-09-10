/**
	**File name: main.js
	**Writer: luxoss
	**File-explanation: Control main html page with javascript	

	**Variable naming: camelCase 
	**Function naming: camelCase
	**jquery selector naming: under_bar

	Main layer size = 5000(width) * 5000(hegiht)
	User layer size = window.width(), window.height()
	All assets size = 100 * 100	
*/

var serverUrl =  "http://203.237.179.21" 					
var indexPageUrl = serverUrl + ":8000";
var mainSocket     = io.connect(serverUrl + ":5001"),			
    planetSocket   = io.connect(serverUrl + ":5002"),			// 행성 정보를 주고 받기 위한 소캣 생성
    userInfoSocket = io.connect(serverUrl + ":5005"),			// 유저 정보를 주고 받기 위한 소캣 생성
    userPosSocket  = io.connect(serverUrl + ":5006");
var curWinWidth = $(window).width(), curWinHeight = $(window).height(); // 현재 창의 가로, 세로의 크기 
var mainLayer = "main_layer";
var mainWidth = 5000, mainHeight = 5000;				// 메인 화면의 가로, 세로 크기
var userId = localStorage.getItem("username");				
var fps = 30, speed = 7;			
var curPosX = Math.floor(Math.random() * mainWidth - 100),
    curPosY = Math.floor(Math.random() * mainHeight - 100);
var lastPosX = 0, lastPosY = 0;		// 로그아웃 시 마지막 위치를 받기 위한 변수  
var missile = new Object();		// 미사일 이미지를 담을 객체 선언
var isKeyDown = new Array();		// 키 상태를 polling 하기 위한 배열 선언 
var fire = new Audio();
var discovered = new Audio();
/*
var open = new Audio();
var close = new Audio();
var insert = new Audio();
var remove = new Audio();
var ignite = new Audio(); 

missile.url = serverUrl + ":8000/res/img/misile1.png";
missile.speed = 10;
missile.posArray = function(curPosX, curPosY){}; 
*/
fire.src = serverUrl + ":8000/res/sound/effect/shoot.mp3";
discovered.src = serverUrl + ":8000/res/sound/effect/kkang.mp3";

// Ready document that is game loop 
$(document).ready(function(){  	
	gameLoop();
});

function gameLoop() {
	var imgUrl = "url('http://203.237.179.21:8000/res/img/space_ship.png')";

	var battleShipPos = { 
		x : curPosX,
		y : curPosY,
		level 	: localStorage.getItem('level'),
		exp 	: localStorage.getItem('exp'),
		mineral : localStorage.getItem('mineral'),
		gas 	: localStorage.getItem('gas'),
		unknown : localStorage.getItem('unknown')
	};

	curPosX = battleShipPos.x; 
	curPosY = battleShipPos.y;

	drawAllAssets(mainLayer); 		
	drawShipInfo(curPosX, curPosY, imgUrl); 
	viewPort();
	keyHandler(mainLayer, userId);
	buttonSet();
	setInterval(function(){
		userPosUpdate(userId, curPosX, curPosY, imgUrl);
		curPosX = parseInt($("#" + userId).offset().left);
		curPosY = parseInt($("#" + userId).offset().top);
	}, 1000/fps);
 
}

function buttonSet() {
	
	$('#logout_btn').on('click', function(){
	
		if(userId != null)
		{
			logout(userId, lastPosX, lastPosY);
		}
		else
		{
			alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');

			mainSocket.disconnect();

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

	
// 캔버스 및 서버로 부터 받은 행성 데이터를 division 테그로 겹쳐 그리기 위한 함수 
function drawAllAssets(mainLayer) {

	planetSocket.emit('planet_req', {'ready' : 'Ready to draw all assets'});

	planetSocket.on('planet_res', function(data) {

		//var mainLayer = $("#main_layer");
		var planetInfo = {
			id : data._id,
			x  : data.location_x,
			y  : data.location_y,
			grade : data.create_spd,
			image : { 
				1 :  "url('http://203.237.179.21:8000/res/img/planet/planet_1.svg')",
				2 :  "url('http://203.237.179.21:8000/res/img/planet/planet_2.svg')",
				3 :  "url('http://203.237.179.21:8000/res/img/planet/planet_5.png')",
				4 :  "url('http://203.237.179.21:8000/res/img/planet/planet_11.png')",
				5 :  "url('http://203.237.179.21:8000/res/img/planet/planet_12.png')"
			}
		};
	
		if(planetInfo.grade == 1) {
			drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['1']);
		}

		else if(planetInfo.grade == 2) {
			drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['2']);
		}
		else if(planetInfo.grade == 3) {
			drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['3']);
		}
		else if(planetInfo.grade == 4) {
			drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['4']);
		}
		else {
			drawPlanetImg(mainLayer, planetInfo.id, planetInfo.x, planetInfo.y, planetInfo.image['5']);
		}
	});		
}

// 생성된 행성들을 메인 화면 내에 뿌려주기 위한 함수
function drawPlanetImg(mainLayer, divId, x, y, imgUrl) {
	$("#" + mainLayer).append("<div id='" + divId + "' style='position: absolute; top: " + x + "px" + "; left:" + y + "px" + ";'></div>");	

	$("#" + divId).css({
		"backgroundImage" : imgUrl,
		"width"		: "100px",
		"height" 	: "100px"
	});
}

// 유저 정보(유저명, 함선 이미지)를 메인 화면에 뿌릴 함수
function drawShipInfo(curPosX, curPosY,imgUrl) {
	//$('#mineral').val() = userInitInfo.mineral;
	//$('#gas').val() = userInitInfo.gas;     
	//$('#unknown').val() = userInitInfo.unknown;

	$('#user_avartar').append("<div id='" + userId + "'style='position:absolute; bottom:0px; color:white;'>" + userId + "</div>");
	$("#user_name").text("" + userId + "");
	
	$("#main_layer").append("<div id='" + userId + "' style='position:absolute;'></div>");
	$("#" + userId).css({
		"backgroundImage" : imgUrl,
		"width"  : "100px",
		"height" : "100px",
		"zIndex" : "2",
		left: curPosX, 
		top: curPosY
	});

	autoFocus(userId);
}

function autoFocus(divId) {
 	
	var offset = $("#" + divId).offset();

	// 해당 함선을 기준으로 스크롤 하면서 브라우저 창 정 가운데에 배치
	// (해당 배경 크기만큼 스코롤링 하기 때문에 가장자리에 위치한 객체의 경우 가운데 포커싱이 안되는 것처럼 보이나
	// 실제론 가운데 맞춰지려 하는 것)
	// 현재 left 좌표 - (현재 브라우저 창 넓이 값 / 2)
	// 현재 top 좌표 - (현재 브라우저 창 높이 값 / 2)
	$("html, body").animate({
		scrollLeft: offset.left - (curWinWidth / 2), 
		scrollTop: offset.top - (curWinHeight / 2)  
	}, 1000);

	//viewPort.css({left: offset.left - (curWinWidth / 2), top: offset.top - (curWinHeight / 2)});
}

function viewPort() {
	
	$(window).resize(function(){
		$("#view_layer").css({
			width: ($(window).width() - 100),
			height: ($(window).height() - 100)
		});

                $('#view_layer').css({
                        left: ($(window).width() - $('#view_layer').outerWidth()) / 2,
                        top: ($(window).height() - $('#view_layer').outerHeight()) / 2
                });

        }).resize();
}

// 유저 함선들의 현 위치를 주고 받기 위한 함수
function userPosUpdate(userId, curPosX, curPosY, imgUrl) {

	userPosSocket.emit('cpos_req', { 
		'username' : userId, 
		'location_x' : curPosX,
		'location_y' : curPosY
	});

	userPosSocket.on('cpos_res', function(data) {
		var userPosInfo = {
			name : data.username,
			curPosX : data.location_x,
			curPosY : data.location_y
		};
		
		$("#main_layer").append("<div id='" + userPosInfo.name + "' style='position:absolute;'></div>");
		$("#" + userPosInfo.name).css({
				"backgroundImage" : imgUrl,
				"width"  : "100px",
				"height" : "100px",
				"zIndex" : "2",
				left: userPosInfo.curPosX, 
				top: userPosInfo.curPosY
		});			
	});

}

function keyHandler(divId, divId1) {
	
	$(document).keydown(function(ev) {  
		isKeyDown[ev.keyCode] = true;
		shipMove(divId, divId1);
		menuButton(ev);
	});

	$(document).keyup(function(ev) {
		isKeyDown[ev.keyCode] = false;
	});
}

function shipMove(divId, divId1) {

	if(isKeyDown[37]) { // Left
		posX(divId1, posX(divId1) - speed);
		posX(divId, posX(divId) + speed);
		$("#" + divId1).css('transform', 'rotate(-90deg)');  				
	}
	
	if(isKeyDown[39]) { // Right
		posX(divId1, posX(divId1) + speed);
		posX(divId, posX(divId) - speed);
	        $("#" + divId1).css('transform', 'rotate(90deg)');   
	}

	if(isKeyDown[38]) { // Up
		posY(divId1, posY(divId1) - speed);
	        posY(divId, posY(divId) + speed);
		$("#" + divId1).css('transform', 'rotate(0deg)');
	}

	if(isKeyDown[40]) { // Down
		posY(divId1, posY(divId1) + speed);
		posY(divId, posY(divId) - speed);
		$("#" + divId1).css('transform', 'rotate(180deg)');
        }
ttr("width", GAME_SETTINGS.WIDTH);
        $(canvas).attr("height", GAME_SETTINGS.HEIGHT);
        document.body.appendChild(canvas);
	if(isKeyDown[83]) { // Shoot
		fire.play();
		console.log('fire!');
		fire.currentTime = 0;
		//curPosX = ;
		//curPosY = ;
		//shoot(curPosX, curPosY);
	}
/*
	// Move a diagonal line 
	if(isKeyDown[38] && isKeyDown[37]) { 
		$("#" + divId).css('transform', 'rotate(-45deg)');
	}

	if(isKeyDown[38] && isKeyDown[39]) {
		$("#" + divId).css('transform', 'rotate(45deg)');
	}

	if(isKeyDown[40] && isKeyDown[37]) {
		$("#" + divId).css('transform', 'rotate(-135deg)');
	}

	if(isKeyDown[40] && isKeyDown[39]) {
		$("#" + divId).css('transform', 'rotate(135deg)');
	}	
*/
}
	
function menuButton(ev) {

        var KEY_SPACE           = 1;
        var KEY_BATTLE_SHIP     = 2;
        var KEY_RANK            = 3;
        var KEY_PLANET          = 4;
        var KEY_LOGOUT          = 5;
	var KEY_NONE 		= null;

	var getKey = function(i) {

		switch(i)
		{
			case 32: 
				return KEY_SPACE;
				break;
			case 66:
				return KEY_BATTLE_SHIP;
				break;
			case 80:
				return KEY_PLANET;
				break;
			case 81:
				return KEY_LOGOUT;
				break;
			case 82:
				return KEY_RANK;
				break;
			default:
				return KEY_NONE;
				break;
		}
	};

	var otherKeyState = getKey(ev.keyCode);

	switch(otherKeyState)
	{
		case KEY_SPACE:
			discovered.play();
			console.log('got a planet');
			discovered.currentTime = 0;
			break;

		case KEY_BATTLE_SHIP:
			battleShipViewLayer(); 	  
			break;

		case KEY_RANK:
			rankViewLayer(); 	  
			break;

		case KEY_PLANET:
			planetViewLayer();	  
			break;

		case KEY_LOGOUT:
			lastPosX = parseInt($("#" + userId).offset().left);
			lastPosY = parseInt($("#" + userId).offset().top);	
			logout(userId, lastPosX, lastPosY);
			break;

		default:
			break;
	}
};

// x좌표에 관한 셋팅을 위함(아무런 값이 들어오지 않을 시 현재 좌표 반환)  
function posX(divId, position) {

	if(position)
	{
		return parseInt($("#" + divId).css("left", position));
	}
	else	
	{
		return parseInt($("#" + divId).css("left"));
	}
};

function posY(divId, position) { 

	if(position)
	{
		return parseInt($("#" + divId).css("top", position));
	}
	else
	{
		return parseInt($("#" + divId).css("top"));
	}
};

function logout(userId, lastPosX, lastPosY) {

        var logoutMsg = confirm('로그아웃 하시겠습니까?');
        var indexPageUrl = serverUrl + ":8000";

        if(logoutMsg == true)
        {
                mainSocket.emit('logout_msg', {username: userId}); 

                mainSocket.on('logout_res', function(data){

                        if(data.response == 'true')
                        {
                                userInfoSocket.emit('lpos_req', {'username': userId, 'lastPosX': lastPosX, 'lastPosY': lastPosY}); 
                               	alert(userId + '님께서 로그아웃 되셨습니다.');

                                localStorage.removeItem('username');

				mainSocket.disconnect();

                                $(location).attr('href', indexPageUrl);
                        }
                        else if(data.response == 'false')
                        {
                                        alert('Logout error.');
                        }

                });
        }
        else 
        {
                if(userId == null)
                {
                        return false;
                }
        }

}
/*
//TODO: LATER

var shoot = function() {
	var dx = 0.0;
	var dy = 0.0;
	var angle = 0.0, _angle = 0;
	var launcharX = ship's x position;
	var launcharY = ship's y position;
 
	if(!isShoot) { return ; }
	if(angle < 0) {
		_angle = 100 + angle - 90;
		dy = Math.sin(_angle * Math.PI / 180);
		dx = -Math.cos(_angle * Math.PI / 180);
	}
	else {
		_angle = angle - 90;
		dy = -Math.sin(_angle * Math.PI / 180);
		dx = Math.cos(_angle * Math.PI / 180);
	}
	
	dx *= speed;
	dy *= speed;
	//translate css(bulletX += dx, bulletY -= dy);
	//rotate(angle * Math.PI / 180);
	if(bulletX && bulletY < 0) { isFire = false; }
	bulletX = launcherX;
	bulletY = launcherY;
	
	isFire = true;
};

// 키 입력 상태를 서버에 전송하기 위한 코드
$('body').on('keydown', function(ev){
	userPosSocket.emit('keydown', ev.keycode);
});

$('body').on('keyup', function(ev){
	userPosSocket.emit('keyup', ev.keycode);
});

// 마우스 위치 확인하기 위한 코드 
$(document).mousemove(function(e){
	console.log(e.pageX + ',' + e.pageY);
});

// 숫자 타입인지 아닌지 체크하기 위한 함수 
function isNumber(str) {

  	str += ''; 			     // 문자열 타입으로 변환 
  	str = str.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거 

  	if (str == '' || isNaN(str)) {return false };

  	return true;
*/
