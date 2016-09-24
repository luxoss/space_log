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
    planetSocket   = io.connect(serverUrl + ":5002"),			// Create socket :: Planet information
    userInfoSocket = io.connect(serverUrl + ":5005"),			// Create socket :: User inforamtion
    userPosSocket  = io.connect(serverUrl + ":5006");			// Create socket :: Battle ship position information 
var curWinWidth = $(window).width(), curWinHeight = $(window).height(); // Current window width and height size  
var mainLayer = "main_layer";
var mainWidth = 5000, mainHeight = 5000;				// Main display width and height size 
var userId = localStorage.getItem("username");				
var fps = 30, speed = 10;			
var initPosX = parseInt(mainWidth / 2),  //Math.floor(Math.random() * mainWidth - 100),
    initPosY = parseInt(mainHeight / 2); //Math.floor(Math.random() * mainHeight - 100);
var curPosX = 0, curPosY = 0,
    lastPosX = 0, lastPosY = 0;		// Create last position val :: If user is disconnected, client send last position to server    
var missile = new Object();		// Create missile image object 
var isKeyDown = new Array();		// Create key state array to keyboard polling  
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
missile.posArray = function(initPosX, initPosY){}; 
*/
fire.src = serverUrl + ":8000/res/sound/effect/shoot.mp3";
discovered.src = serverUrl + ":8000/res/sound/effect/kkang.mp3";

// Ready document that is game loop 
$(document).ready(function() {  	
	gameLoop();
});

function gameLoop() {
	curPosX = initPosX;
	curPosY = initPosY;
	//After init, update and display

//	initialize();
//	update();
//	display();
	drawAllAssets(mainLayer); 		
	drawShipInfo(initPosX, initPosY); 
	viewPort();
	keyHandler(mainLayer, userId, curPosX, curPosY);
	buttonSet();
	userPosUpdate();
 
}

// 유저 함선들의 현 위치를 주고 받기 위한 함수
function userPosUpdate() {

	var imgUrl = "url('http://203.237.179.21:8000/res/img/space_ship1.svg')";

	userPosSocket.on('mv', function(my_obj) {
		console.log(my_obj.username);
		curPosX = my_obj.location_x;
		curPosY = my_obj.location_y;

		$("#main_layer").append("<div id='" + my_obj.username + "' style='position:absolute;'></div>");
		$("#" + my_obj.username).css({
			"backgroundImage" : imgUrl,
			"width"  : "64px",
			"height" : "64px",
			"zIndex" : "2",
			left: curPosX, 
			top: curPosY
		});			
	});
}

function keyHandler(mainLayer, userId, curPosX, curPosY) {
	
	$(document).keydown(function(ev) {  
		userPosSocket.emit('press_key', {
			'username': userId, 
			'key_val' : ev.keyCode, 
			'location_x' : curPosX,
			'location_y' : curPosY
		});
		isKeyDown[ev.keyCode] = true;
		shipMove(mainLayer, userId, curPosX, curPosY);
	});

	$(document).keyup(function(ev) {
		isKeyDown[ev.keyCode] = false;
	});
}

function shipMove(divId, divId1, curPosX, curPosY) {
	lastPosX = curPosX;
	lastPosY = curPosY;

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
/*
	// Move a diagonal line 
	if(isKeyDown[38] && isKeyDown[37]) { 
		$("#" + divId1).css('transform', 'rotate(-45deg)');
	}

	if(isKeyDown[38] && isKeyDown[39]) {
		$("#" + divId1).css('transform', 'rotate(45deg)');
	}

	if(isKeyDown[40] && isKeyDown[37]) {
		$("#" + divId1).css('transform', 'rotate(-135deg)');
	}

	if(isKeyDown[40] && isKeyDown[39]) {
		$("#" + divId1).css('transform', 'rotate(135deg)');
	}	
*/
	if(isKeyDown[32]) { // press space key
		discovered.play();
		console.log('got a planet');
		discovered.currentTime = 0;
	}

	if(isKeyDown[66]) { // press battle ship menu button
		battleShipViewLayer(); 	  
	}

	if(isKeyDown[80]) { // press planet menu button
		planetViewLayer();
	}

	if(isKeyDown[81]) { // press logout(q)
	//	lastPosX = parseInt($("#" + userId).offset().left);
	//	lastPosY = parseInt($("#" + userId).offset().top);	
		logout(divId1, lastPosX, lastPosY);
	}

	if(isKeyDown[82]) { // press rank menu button
		rankViewLayer();
	}

	if(isKeyDown[83]) { // press shoot key(s)
		fire.play();
		console.log('fire!');
		fire.currentTime = 0;
		//shoot(curPosX, curPosY);	
	}
}

// x좌표에 관한 셋팅을 위함(아무런 값이 들어오지 않을 시 현재 좌표 반환)  
function posX(divId, position) {

	if(position) {
		return parseInt($("#" + divId).css("left", position));
	}else {
		return parseInt($("#" + divId).css("left"));
	}
}

function posY(divId, position) { 

	if(position) {
		return parseInt($("#" + divId).css("top", position));
	}
	else {
		return parseInt($("#" + divId).css("top"));
	}
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
				1 :  "url('http://203.237.179.21:8000/res/img/planet/planet_grade1.svg')",
				2 :  "url('http://203.237.179.21:8000/res/img/planet/planet_grade2.svg')",
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
function drawPlanetImg(mainLayer, divId, x, y, planetImgUrl) {
	$("#" + mainLayer).append("<div id='" + divId + "' style='position: absolute; top: " + x + "px" + "; left:" + y + "px" + ";'></div>");	

	$("#" + divId).css({
		"backgroundImage" : planetImgUrl,
		"width"		: "100px",
		"height" 	: "100px"
	});
}

// 유저 정보(유저명, 함선 이미지)를 메인 화면에 뿌릴 함수
function drawShipInfo(initPosX, initPosY) {
	//$('#mineral').val() = userInitInfo.mineral;
	//$('#gas').val() = userInitInfo.gas;     
	//$('#unknown').val() = userInitInfo.unknown;
	var imgUrl = "url('http://203.237.179.21:8000/res/img/space_ship1.svg')";

	$('#user_avartar').append("<div id='" + userId + "'style='position:absolute; bottom:0px; color:white;'>" + userId + "</div>");
	$("#user_name").text("" + userId + "");
	
	$("#main_layer").append("<div id='" + userId + "' style='position:absolute;'></div>");
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

function autoFocus(divId) {

 	// 해당 함선을 기준으로 스크롤 하면서 브라우저 창 정 가운데에 배치
	// (해당 배경 크기만큼 스코롤링 하기 때문에 가장자리에 위치한 객체의 경우 가운데 포커싱이 안되는 것처럼 보이나
	// 실제론 가운데 맞춰지려 하는 것)
	// 현재 left 좌표 - (현재 브라우저 창 넓이 값 / 2)
	// 현재 top 좌표 - (현재 브라우저 창 높이 값 / 2)
	
	var offset = $("#" + divId).offset();

	$("html, body").animate({
		scrollLeft: offset.left - (curWinWidth / 2), 
		scrollTop: offset.top - (curWinHeight / 2)  
	}, 1000);
}

function viewPort() {
	
	$(window).resize(function(){
		$("#view_layer").css({
			width: 1368,	//($(window).width() - 100),
			height: 768	//($(window).height() - 100)
		});

                $('#view_layer').css({
                        left: ($(window).width() - $('#view_layer').outerWidth()) / 2,
                        top: ($(window).height() - $('#view_layer').outerHeight()) / 2
                });

        }).resize();
}
	
function buttonSet() {
	
	$('#logout_btn').on('click', function(){
	
		if(userId != null) {
			logout(userId, lastPosX, lastPosY);
		}
		else {
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

function logout(userId, lastPosX, lastPosY) {

        var logoutMsg = confirm('로그아웃 하시겠습니까?');
        var indexPageUrl = serverUrl + ":8000";

        if(logoutMsg == true) {
                mainSocket.emit('logout_msg', {username: userId}); 

                mainSocket.on('logout_res', function(data){

                        if(data.response == 'true') {

                                userInfoSocket.emit('lpos', {
					'username': userId, 
					'lastPosX': lastPosX, 
					'lastPosY': lastPosY
				}); 

                               	alert(userId + '님께서 로그아웃 되셨습니다.');

                                localStorage.removeItem('username');
				mainSocket.disconnect();
                                $(location).attr('href', indexPageUrl);

                        }else if(data.response == 'false') {
                                        alert('Logout error.');
                        }

                });
        }else {
                if(userId == null){ return false; }
        }

}

/*
	Collision model width boxing
*/

/*
//TODO: Some code lines 
function isCollision(otherObj, player) {
	return (otherObj.x < player.x + player.width) && (otherObj.x + otherObj.width > player.x) && 
               (otherObj.y < player.y + player.height) && (otherObj.y + otherObj.height > player.y);
}

function boxModel(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

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
