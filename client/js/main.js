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
var bgWidth = 5000, bgHeight = 5000;				

/*
// 마우스의 x, y 위치를 확인하기 위한 코드
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

		var canvas = document.getElementById("background");
		var mainLayer = $("#main_layer");
		var userLayer = $("#user_layer");
		var planetImgList = {
			 0 :  "url('http://203.237.179.21:8000/res/img/planet/planet_0.png')",
			 1 :  "url('http://203.237.179.21:8000/res/img/planet/planet_1.png')",
			 2 :  "url('http://203.237.179.21:8000/res/img/planet/planet_2.png')",
			 3 :  "url('http://203.237.179.21:8000/res/img/planet/planet_3.png')",
			 4 :  "url('http://203.237.179.21:8000/res/img/planet/planet_4.png')",
		};
	
//		userLayer.width();
//		userLayer.height();
/*
		//TODO: 나중에 테스트
		var posX = parseInt(data.location_x);
		var posY = parseInt(data.location_y);
		var planetImg = new Image();	
		planetImg.src = serverUrl + ":8000/res/img/planet/planet_13.png";

		if(canvas.getContext)
		{
			context = canvas.getContext('2d');
			context.fillStyle = 'Black';
			context.rect(0, 0, bgWidth-1, bgHeight-1);
			context.fill();
			
			for(var i = 0; i <= 100; i++)
			{
				var starX = Math.floor(Math.random() * 4095);
				var starY = Math.floor(Math.random() * 2047);
		
				context.fillStyle = "rgb(255, 255, 0)";
				
				context.beginPath();
				context.arc(starX, starY, 3, 0, Math.PI * 2, true);
				context.closePath();
				context.fill();
			}
				
		}
*/		
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
/*
	var userInitInfo = {
		'curX'     : localStorage.getItem('posX');
		'curY'     : localStorage.getItem('posY');
		'level'    : localStorage.getItem('level');
		'exp'      : localStorage.getItem('exp');
		'mineral'  : localStorage.getItem('mineral');
		'gas'      : localStorage.getItem('gas');
		'unknown'  : localStorage.getItem('unknown');
	}

	$('#mineral').val() = userInitInfo.mineral;
	$('#gas').val() = userInitInfo.gas;     
	$('#unknown').val() = userInitInfo.unknown;

	posX("battle_ship", userInitInfo.curX);
	posY("battle_ship", userInitInfo.curY);

	$('#user_avartar')
		.append("<div id='" + userId + "'style='position: absolute; bottom: 0px; color: white;'>" + userId + "</div>");
*/
	$("#user_name").text("" + userId + "");

	$(window).resize(function(){		

		$('#battle_ship').css({
			left: ($("#user_layer").width() - $('#battle_ship').outerWidth()) / 2,
			top: ($("#user_layer").height() - $('#battle_ship').outerHeight()) / 2
		});

	}).resize();
}

/*
// 유저 함선들의 현 위치를 주고 받기 위한 함수
function userPosUpdate(userid, curPosX, curPosY) 
{
	userInfoSocket.emit('lpos_req', {'username' : userid, 'x' : curPosX,'y' : curPosY});

	userInfoSocket.on('lpos_res' function(data) {
		var username = data.username; // 배열 또는 객체로 읽어들일 것 
		var curPosX = data.location_x;
		var curPosY = data.location_y;
	});
}
*/

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




