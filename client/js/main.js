/**
	**File name: main.js
	**Writer: luxoss
	**File-explanation: Control main html page with javascript	

	**Variable naming: camelCase 
	**Function naming: camelCase
	**jquery selector naming: under_bar

	Main layer size = 5000(width) * 5000(hegiht)
	User layer size = mainlayer's 1/5
	All assets size = 100 * 100	
*/

// 모든 코드 모듈에 접근하기 위한 전역 변수 선언.
var serverUrl =  "http://203.237.179.21" 				// 메인 서버 URL 주소를 담은 변수 선언
var socket = io.connect(serverUrl + ":5001");				// 메인 소캣 생성
var planetSocket = io.connect(serverUrl + ":5002");			// 행성 정보를 주고 받기 위한 소캣 생성
var userInfoSocket = io.connect(serverUrl + ":5003");			// 유저 정보를 주고 받기 위한 소캣 생성
var userId = localStorage.getItem("username");				
var fps = 30;								// fps를 30으로 맞추기 위한 변수 선언 
var bgWidth = 5000, bgHeight = 5000;				        // 메인 화면의 가로, 세로 크기
var curWinWidth = $(window).width(), curWinHeight = $(window).height(); // 현재 창의 가로, 세로의 크기 (캐릭터가 창 밖으로 나갈 시 스코롤 이동을 위해 생성 
var mainLayerOffset = $("#main_layer").offset();

/*
$(document).mousemove(function(e){
	console.log(e.pageX + ',' + e.pageY);
});
*/
// Ready document that is game loop 
$(document).ready(function(){  

	var indexPageUrl = serverUrl + ":8000";

	drawAllAssets(); 		
	drawShipInfo(); 
//	setInterval(userPosUpdate(), 1000/fps); 
	keyHandler();
	buttonSet();
});

function buttonSet() {
	
	$('#logout_btn').on('click', function(){
			
		if(userId != null)
		{
			logout(userId);
		}
		else
		{
			alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');

			socket.disconnect();

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

	planetSocket.emit('planet_req', {'ready' : 'ready to connect planet db'});

	planetSocket.on('planet_res', function(data) {

//		var canvas = document.getElementById("background");
		var mainLayer = $("#main_layer");
		var userLayer = $("#user_layer");
		var planetImgList = {
			 0 :  "url('http://203.237.179.21:8000/res/img/planet/planet_0.png')",
			 1 :  "url('http://203.237.179.21:8000/res/img/planet/planet_1.png')",
			 2 :  "url('http://203.237.179.21:8000/res/img/planet/planet_2.png')",
			 3 :  "url('http://203.237.179.21:8000/res/img/planet/planet_3.png')",
			 4 :  "url('http://203.237.179.21:8000/res/img/planet/planet_4.png')",
		};
	
		mainLayer.append("<div id='" + data._id + "' style='position: fixed; color: white; top: " + data.location_x + "px" + "; left:" + data.location_y + "px" + "; width: 100px; height: 100px;'></div>");			
		drawPlanetImg(data._id, planetImgUrl);
	});		
}

// 자바스크립트 변수의 특성상 값이 입력되는 순간 타입이 정해지기 때문에 타입이 제대로 들어갔는지 테스트 해보기 위한 함수 
function isNumber(str) {

  	str += ''; 			     // Change to string type 
  	str = str.replace(/^\s*|\s*$/g, ''); // Delete left and right blank 

  	if (str == '' || isNaN(str)) {return false };

  	return true;
}

// 생성된 행성들을 메인 화면 내에 뿌려주기 위한 함수
function drawPlanetImg(planetNumData, planetImgUrl) {

	var planetNum = document.getElementById(planetNumData);	
	
	planetNum.style.backgroundImage = planetImgUrl; 

}

// 유저 정보(유저명, 함선 이미지)를 메인 화면에 뿌릴 함수
function drawShipInfo() {

	var userInitInfo = {
		curX     : 1500,//localStorage.getItem('posX');
		curY     : 1500,//localStorage.getItem('posY');
		level    : localStorage.getItem('level'),
		exp      : localStorage.getItem('exp'),
		mineral  : localStorage.getItem('mineral'),
		gas      : localStorage.getItem('gas'),
		unknown  : localStorage.getItem('unknown')
	};
	
	// offset - 절대좌표, position - 상대좌표 
	//$('#mineral').val() = userInitInfo.mineral;
	//$('#gas').val() = userInitInfo.gas;     
	//$('#unknown').val() = userInitInfo.unknown;


	$('#user_avartar')
		.append("<div id='" + userId + "'style='position:absolute; bottom:0px; color:white;'>" + userId + "</div>");
	$("#user_name").text("" + userId + "");
	
	$("#battle_ship").css({left: userInitInfo.curX, top: userInitInfo.curY});
	$("#view_layer").css({left: curWinWidth - 100, top: curWinHeight - 100});

	autoMove('battle_ship');
}

function autoMove(obj) {
 	
	var offset = $("#" + obj).offset();

	// 해당 함선을 기준으로 스크롤 하면서 브라우저 창 정 가운데에 배치 
	$("html, body").animate({
		// current left(x) pos - (browser window width / 2)
		// current top(y) pos - (brouwser window height / 2) 
		scrollLeft: offset.left - (curWinWidth / 2), 
		scrollTop: offset.top - (curWinHeight / 2)
	}, 1000);
}
		
function logout(logoutUserId) {

	var logoutMsg = confirm('로그아웃 하시겠습니까?');
	var indexPageUrl = serverUrl + ":8000";

	if(logoutMsg == true)
	{
		socket.emit('logout_msg', {username: logoutUserId}); 

		socket.on('logout_res', function(data){

			if(data.response == 'true')
			{
				alert(logoutUserId + '님께서 로그아웃 되셨습니다.');

				localStorage.removeItem('username');

				//socket.emit('lpos_req', {'x': postX, 'y': postY}); 
				socket.disconnect();

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
		if(logoutUserId == null)
		{
			return false;
		}
	}

}

//TODO: Later...
/*
// 유저 함선들의 현 위치를 주고 받기 위한 함수
function userPosUpdate(userid, curPosX, curPosY) {
	userInfoSocket.emit('lpos_req', {'username' : userid, 'x' : curPosX,'y' : curPosY});

	userInfoSocket.on('lpos_res' function(data) {
		var username = data.username; // 배열 또는 객체로 읽어들일 것 
		var curPosX = data.location_x;
		var curPosY = data.location_y;
	});
}
*/

/*
	$(window).resize(function(){		

		$("#battle_ship").css({
			left: ($(self).width() - $('#battle_ship').outerWidth()) / 2,
			top: ($(self).height() - $('#battle_ship').outerHeight()) / 2
		});

	});
*/
