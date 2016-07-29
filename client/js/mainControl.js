/**
	*File name: main.js
	*Writer: luxoss
	*Modified date: 07/29/2016 
	
	**Variable naming: camelCase 
	**Function naming: camelCase
	**jquery selector naming: under_bar
*/

(function(){ // Create imediately-invoked function expression
	//Create socket global scope. becuz socket access all document type
	var serverUrl =  "http://203.237.179.21"
	var socket = io.connect(serverUrl + ":5001");
	var undiscoveredPlanetSocket = io.connect(serverUrl + ":5002");
	//var battleShipObj = $("#battle_ship").offset(); 
	//var positionX = battleShipObj.left;
	//var positionY = battleShipObj.top;
	var userId = localStorage.getItem("username");

	$(document).ready(function(){ // Ready to the document 

		var indexPageUrl = serverUrl + ":8000";
	
		//isNaN(_PARAMETER) ? true : false 
		drawAllAssets();
		userStateInit(); // Call user state initialize function

		$('#battle_ship').append("<div id='" + userId + "'style='postion:fixed; color: white;'>" + userId + "</div>");

		$('#logout_btn').on('click', function(){
			// Below to disconnect user code line 
			
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
		undiscoveredPlanetSocket.emit('planet_req', {'ready' : 'ready to connect planet db'});

		undiscoveredPlanetSocket.on('planet_res', function(data){

			// Create group of the planet grage image obj
			var canvas = document.getElementById('background');
			var planetImg = new Image();
			var posX = parseInt(data.location_x);
			var posY = parseInt(data.location_y);
			var planetImg1 = new Image();
			var planetImg2 = new Image();
			var planetImg3 = new Image();
			var planetImg4 = new Image();
	
			planetImg1.src = serverUrl + ":8000/res/img/planet/planet_9.png";
			planetImg2.src = serverUrl + ":8000/res/img/planet/planet_11.png";
			planetImg3.src = serverUrl + ":8000/res/img/planet/planet_12.png";
			planetImg4.src = serverUrl + ":8000/res/img/planet/planet_13.png";

			if(canvas.getContext)
			{
				context = canvas.getContext('2d');
				context.fillStyle = 'Black';
				context.rect(0, 0, 2048, 1024);
				context.fill();
				
				drawStars();
			}

			planetImg.onload = function()
			{
				context.drawImage(planetImg, posX, posY, 100, 100);
			}

			planetImg.src = serverUrl + ":8000/res/img/planet/planet_11.png";
		});
		return ;
	}

	function drawStars()
	{
		for(var i = 0; i <= 100; i++)
		{
			var x = Math.floor(Math.random() * 2047);
			var y = Math.floor(Math.random() * 1023);
			
			context.fillStyle = "rgb(255, 255, 0)";
			
			context.beginPath();
			context.arc(x, y, 3, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();
		}
		return ; 
	}

	// Create user state function in main display
	function userStateInit()
	{
		$(window).resize(function(){		

			$('#battle_ship').css({
				left: ($(window).width() - $('#battle_ship').outerWidth()) / 2,
				top: ($(window).height() - $('#battle_ship').outerHeight()) / 2
			});

		}).resize();

		return ;
	}
			
	// Create clockwise rotate transformation matrix function
	function clockwiseRotateTransform(posX, posY, angle)
	{

		var ratio = {
			x : Math.cos(angle),
			y : Math.sin(angle)
		};

		posX = ((x * ratio.x) + (y * (-ratio.y)));
		posY = ((x * ratio.y) + (y * (ratio.x)));

		console.log(posX, posY);

		angle += 30;
			
		return ;
	}

	// Create counter clockwise rotate tranformation matrix function
	function counterClockwiseRotateTransform(posX, posY, angle)
	{
		var ratio = {
			x : Math.cos(angle),
			y : Math.sin(angle)
		};

		posX = ((x * ratio.x) + (y * (ratio.y)));
		posY = ((x * -ratio.y) + (y * (ratio.x)));

		angle += 30;

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
				};

			});
		}

		return ;
	}
})();



