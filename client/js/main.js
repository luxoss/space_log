/**
	**File name: main.js
	**Writer: luxoss
	**File-explanation: Control main html page with javascript	

	**Variable naming: camelCase 
	**Function naming: camelCase
	**jquery selector naming: under_bar
*/

//Create socket global scope. becuz socket access all document type
var serverUrl =  "http://203.237.179.21"
var socket = io.connect(serverUrl + ":5001");
var planetSocket = io.connect(serverUrl + ":5002");
var userInfoSocket = io.connect(serverUrl + ":5003");
var userId = localStorage.getItem("username");

/*
// Confirm mousemove x, y position
$(document).mousemove(function(e){
	console.log(e.pageX + ',' + e.pageY);
});
*/
$(document).ready(function(){ // Ready to the document 

	var indexPageUrl = serverUrl + ":8000";
	
	drawAllAssets();
	userStateInit(); // Call user state initialize function

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
});
	
// Create draw background image in canvas 
function drawAllAssets()
{
	planetSocket.emit('planet_req', {'ready' : 'ready to connect planet db'});

	planetSocket.on('planet_res', function(data){

		var canvas = document.getElementById("background");
		var mainLayer = $("#main_layer");
		var backgroundLayer = $("#background");
		//var planetNum = "plnaet", cnt = 0;
		//planetNum += cnt;
		//cnt++;	
		//var planetId = $("#" + planetNum);

		var planetImgNum = {
			 0 :  "url('http://203.237.179.21:8000/res/img/planet/planet_0.png')",
			 1 :  "url('http://203.237.179.21:8000/res/img/planet/planet_1.png')",
			 2 :  "url('http://203.237.179.21:8000/res/img/planet/planet_2.png')",
			 3 :  "url('http://203.237.179.21:8000/res/img/planet/planet_3.png')",
			 4 :  "url('http://203.237.179.21:8000/res/img/planet/planet_4.png')",
			 5 :  "url('http://203.237.179.21:8000/res/img/planet/planet_5.png')",
			 6 :  "url('http://203.237.179.21:8000/res/img/planet/planet_6.png')",
			 7 :  "url('http://203.237.179.21:8000/res/img/planet/planet_7.png')",
			 8 :  "url('http://203.237.179.21:8000/res/img/planet/planet_8.png')",
			 9 :  "url('http://203.237.179.21:8000/res/img/planet/planet_9.png')",
			10 :  "url('http://203.237.179.21:8000/res/img/planet/planet_10.png')",
			11 :  "url('http://203.237.179.21:8000/res/img/planet/planet_11.png')",
			12 :  "url('http://203.237.179.21:8000/res/img/planet/planet_12.png')",
			13 :  "url('http://203.237.179.21:8000/res/img/planet/planet_13.png')"
		};

		var planetImgUrl = [];
		
		
/*
		//TODO: After testing...
		var posX = parseInt(data.location_x);
		var posY = parseInt(data.location_y);
		var planetImg = new Image();	
		planetImg.src = serverUrl + ":8000/res/img/planet/planet_13.png";
*/
		if(canvas.getContext)
		{
			context = canvas.getContext('2d');
			context.fillStyle = 'Black';
			context.rect(0, 0, 4095, 2047);
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
		
		mainLayer.append("<div id='" + data._id + "' style='position: fixed; color: white; top: " + data.location_x + "px" + "; left:" + data.location_y + "px" + "; width: 100px; height: 100px;'></div>");	
//		planetId.css("background-image", "\"" + planetImgUrl + "\"");
		
		drawPlanetImg(data._id, planetImgUrl);
		//console.log(isNumber(cnt));
/*			
		//TODO: After testing...			
		planetImg.onload = function()
		{
			context.drawImage(planetImg, posX, posY, 100, 100);
		}
*/
	});
	
	return ;
}

// Create function that confirm number type 
function isNumber(str)
{
  	str += ''; // Change to string type 
  	str = str.replace(/^\s*|\s*$/g, ''); // Delete left and right blank 

  	if (str == '' || isNaN(str)) {return false };

  	return true;
}

function drawPlanetImg(planetNumData, planetImgUrl)
{
/*
	var planetNum = $("#" + planetNumData); 

	planetNum.css("background-image", "\"" + planetImgUrl + "\"");
*/
	var planetNum = document.getElementById(planetNumData);	
	
	planetNum.style.backgroundImage = planetImgUrl; 
	//"url('http://203.237.179.21:8000/res/img/planet/planet_13.png')";

	return ;
}
// Create user state function in main display
function userStateInit()
{
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
*/	
	$('#battle_ship')
		.append("<div id='" + userId + "'style='postion:fixed; color: white;'>" + userId + "</div>");

	$(window).resize(function(){		

		$('#battle_ship').css({
			left: ($("#background").width() - $('#battle_ship').outerWidth()) / 2,
			top: ($("#background").height() - $('#battle_ship').outerHeight()) / 2
		});

	}).resize();

	return ;
}

function logout(logoutUserId)
{
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




