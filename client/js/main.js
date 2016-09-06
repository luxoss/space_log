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

// 모든 코드 모듈에 접근하기 위한 전역 변수 선언.
var serverUrl =  "http://203.237.179.21" 				
var mainSocket = io.connect(serverUrl + ":5001");			
var planetSocket = io.connect(serverUrl + ":5002");			// 행성 정보를 주고 받기 위한 소캣 생성
var userInfoSocket = io.connect(serverUrl + ":5005");			// 유저 정보를 주고 받기 위한 소캣 생성
var userId = localStorage.getItem("username");				
var fps = 30;								// fps를 30으로 맞추기 위한 변수 선언 
var mainWidth = 5000, mainHeight = 5000;				// 메인 화면의 가로, 세로 크기
var curWinWidth = $(window).width(), curWinHeight = $(window).height(); // 현재 창의 가로, 세로의 크기 
var mainLayerOffset = $("#main_layer").offset();
var viewLayerOffset = $("#view_layer").offset();

var battleShipPos = { 							// 변수 명이 안의 키, 벨류 값들을 포괄하지 못하므로 손 볼 필요가 있음.
	curPosX : Math.floor(Math.random() * mainWidth - 100),
	curPosY : Math.floor(Math.random() * mainHeight - 100),
	level 	: localStorage.getItem('level'),
	exp 	: localStorage.getItem('exp'),
	mineral : localStorage.getItem('mineral'),
	gas 	: localStorage.getItem('gas'),
	unknown : localStorage.getItem('unknown')
};

/*
*/

// Ready document that is game loop 
$(document).ready(function(){  
	
	gameLoop();
});

function gameLoop() {

	var indexPageUrl = serverUrl + ":8000";

	drawAllAssets(); 		
	drawShipInfo(); 
	viewPort();
	keyHandler();
	buttonSet();
//	setInterval(userPosUpdate(), 1000/fps); 
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
function drawAllAssets() {

	planetSocket.emit('planet_req', {'ready' : 'Ready to draw all assets'});

	planetSocket.on('planet_res', function(data) {

		var mainLayer = $("#main_layer");
		var viewLayer = $("#view_layer");
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
	mainLayer.append("<div id='" + divId + "' style='position: absolute; top: " + x + "px" + "; left:" + y + "px" + ";'></div>");	

	$("#" + divId).css({
		"backgroundImage" : imgUrl,
		"width"		: "100px",
		"height" 	: "100px"
	});
}

// 유저 정보(유저명, 함선 이미지)를 메인 화면에 뿌릴 함수
function drawShipInfo() {
	//$('#mineral').val() = userInitInfo.mineral;
	//$('#gas').val() = userInitInfo.gas;     
	//$('#unknown').val() = userInitInfo.unknown;

	$('#user_avartar')
		.append("<div id='" + userId + "'style='position:absolute; bottom:0px; color:white;'>" + userId + "</div>");
	$("#user_name").text("" + userId + "");
	
	$("#battle_ship").css({left: battleShipPos.curPosX, top: battleShipPos.curPosY});
/*
	viewLayer.append("<div id = '" + userId + "style='position:absolute;'></div>"
	$("#" + userId).css({ 
		width: 100, 
		height: 100,
		zIndex: 2
	});
*/
	autoFocus('battle_ship');
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
	$("#view_layer").css({
		width: ($(window).width() - 100),
		height: ($(window).height() - 100)
	});

	$(window).resize(function(){

                $('#view_layer').css({
                        left: ($(window).width() - $('#view_layer').outerWidth()) / 2,
                        top: ($(window).height() - $('#view_layer').outerHeight()) / 2
                });

        }).resize();
}

//TODO: LATER
/*
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
}

// 유저 함선들의 현 위치를 주고 받기 위한 함수
function userPosUpdate(userid, curPosX, curPosY) {
	userInfoSocket.emit('cpos_req', {'username' : userid, 'location_x' : curPosX,'location_y' : curPosY});

	userInfoSocket.on('cpos_res' function(data) {
		var username = data.username;  
		var curPosX = data.location_x;
		var curPosY = data.location_y;
	});
}
*/

