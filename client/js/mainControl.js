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
	var angle = 0;

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

	$(document).keydown(function(e){ // Create key press down event 
		/*
			38 : up
			40 : down 
			37 : left
			39 : right
			83 : S key is 'Shot'
			66 : B key is 'battle ship button'
			82 : R key is 'Rank button'
			80 : P key is 'Planet information button'
		*/
		var keyDownEvent = e.keyCode;	

		switch(keyDownEvent)
		{
			case 38: // up key press down
				$('#battle_ship').animate({top: "-=50"}, {queue: false});
				break;
			case 40: // down key press down
				$('#battle_ship').animate({top: "+=50"}, {queue: false});
				break;
			case 37: // left key press down
		        	$('#battle_ship').css('transform',  'rotate(' + angle + 'deg)');
				//clockwiseRotateTransform(x, y, angle);
				angle -= 30;
				break;
			case 39: // right key press down
				$('#battle_ship').css('transform',  'rotate(' + angle + 'deg)');
//				counterClockwiseRotateTransform(x, y, angle);
				angle += 30;
				break;
			case 83:
				alert('shot button');
				break;
			case 66:
				battleShipViewLayer(); // call function battle ship layer
				break;
			case 82:
				rankViewLayer(); 	  // call function rank layer
				break;
			case 80:
				planetViewLayer();	  // call function planet layer
				break;
			case 81:
				logout(userId);
				break;
			default:
				break;
		}
	});

	$(document).keyup(function(ev){ // Key press up event 

		var keyUpEvent = ev.keyCode;	
	
		switch(keyUpEvent)
		{
			case 38:
				$('#battle_ship').animate({queue: false});
				break;
			case 40: 
				$('#battle_ship').animate({queue: false});
				break;
			case 37:
				$('#battle_ship').animate({queue: false});
				break;
			case 39:
				$('#battle_ship').animate({queue: false});			
				break;
			case 83:
				alert('shot button');
				break;
			default:
				break;
		};
		
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

	// Create planet menu controller function
	function planetViewLayer()
	{  
		var state = $('#planet_layer').css('display');

		if(state == 'none')
		{
			$('#planet_layer').show();
		}
		else
		{
			$('#planet_layer').hide();
		}
	
		//response undiscovered plnaet database 
		undiscoveredPlanetSocket.emit('planet_req', {'ready' : 'ready to connect planet db'});
		undiscoveredPlanetSocket.on('planet_res', function(data){
		
			$('#main_layer')
				.append("<div id='" + data._id + "' style='position: absolute; color: white; top: " + data.location_x + "; left:" + data.location_y + "; width: 100px; height: 100px;'>" + undiscovered_planet_img + "</div>");	

			$('#planet_layer')
				.append("<div id='" + data._id + "' style='position: absolute; color: white; top: " + data.location_x + "; left:" + data.location_y + "; width: 100px; height: 100px;'>" + undiscovered_planet_img + "</div>");
	
		});

		$(window).resize(function(){

			$('#planet_layer').css({
				left: ($(window).width() - $('#planet_layer').outerWidth()) / 2,
				top: ($(window).height() - $('#planet_layer').outerHeight()) / 2
			});

		}).resize();
		
		return ; 		
	}

	// Create battle ship menu controller function
	function battleShipViewLayer()
	{	
		var state = $('#battle_ship_layer').css('display');

		if(state == 'none')
		{
			$('#battle_ship_layer').show();
		}
		else
		{
			$('#battle_ship_layer').hide();
		}
	
		$(window).resize(function(){

			$('#battle_ship_layer').css({
				left: ($(window).width() - $('#battle_ship_layer').outerWidth()) / 2,
				top: ($(window).height() - $('#battle_ship_layer').outerHeight()) / 2
			});

		}).resize();


		return ;
	}

	// Create rank menu controller function
	function rankViewLayer()
	{	
		var state = $('#rank_layer').css('display');

		if(state == 'none')
		{
			$('#rank_layer').show();
		}
		else
		{
			$('#rank_layer').hide();
		}
		
		$(window).resize(function(){
			$('#rank_layer').css({
				left: ($(window).width() - $('#rank_layer').outerWidth()) / 2,
				top: ($(window).height() - $('#rank_layer').outerHeight()) / 2
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



