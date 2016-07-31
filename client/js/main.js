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
//var battleShipObj = $("#battle_ship").offset(); 
//var positionX = battleShipObj.left;	
//var positionY = battleShipObj.top;
var userId = localStorage.getItem("username");

$(document).ready(function(){ // Ready to the document 

	var indexPageUrl = serverUrl + ":8000";
	
	//isNaN(_PARAMETER) ? true : false 
	drawAllAssets();
	userStateInit(); // Call user state initialize function

	$('#logout_btn').on('click', function(){
			
		if(userId === null)
		{
			alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');

			socket.disconnect();

			$(location).attr('href', indexPageUrl);	
		}
		else
		{
			logout(userId);
		}
	});	

	$('#planet_btn').on('click', function(){
		planetViewLayer();
	});

	$('#battle_ship_btn').on('click', function(){
		alert('Click battle ship button.');
		battleShipViewLayer();
	});

	$('#rank_btn').on('click', function(){
		alert('Click rank button.');
		rankViewLayer();
	});
});
	
// Create draw background image in canvas 
function drawAllAssets()
{
	planetSocket.emit('planet_req', {'ready' : 'ready to connect planet db'});

	planetSocket.on('planet_res', function(data){

		var canvas = document.getElementById("background");
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
			context.rect(0, 0, 2048, 1024);
			context.fill();
			
			for(var i = 0; i <= 100; i++)
			{
				var starX = Math.floor(Math.random() * 2047);
				var starY = Math.floor(Math.random() * 1023);
		
				context.fillStyle = "rgb(255, 255, 0)";
				
				context.beginPath();
				context.arc(starX, starY, 3, 0, Math.PI * 2, true);
				context.closePath();
				context.fill();
			}
				
		}
	
		$("#background")
			.append("<div id='" + data._id + "' style='position: fixed; color: white; top: " + data.location_x + "; left:" + data.location_y + "; width: 100px; height: 100px;'></div>");	

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

// Create user state function in main display
function userStateInit()
{
	var canvas = document.getElementById('background');
	var battleShipImg = new Image();

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

				//socket.emit('lpos_req', {'x': posX, 'y': posY}); 
				socket.disconnect();

				$(location).attr('href', indexPageUrl);
			}
			else if(data.response == 'false')
			{
					alert('Logout error.');
			}

		});
	}

	return ;
}




