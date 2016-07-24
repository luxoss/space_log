/**
	*File name: main.js
	*Writer: luxoss
	*Modified date: 07/23/2016 
*/

(function(){ // Create imediately-invoked function expression
	//Create socket global scope. becuz socket access all document type
	var server_url =  "http://203.237.179.21"
	var socket = io.connect(server_url + ":5001");
	var undiscovered_planet_socket = io.connect(server_url + ":5002");
	var angle = 0;

	$(document).ready(function(){ // Ready to the document 
		var url = server_url + ":8000";
		var user_id = localStorage.getItem('username');
	
		//isNaN(_PARAMETER) ? true : false 
		drawAllAssets();
		userStateInit(); // Call user state initialize function

		$('#battle_ship_img').append("<div id='" + user_id + "'style='postion:fixed; color: white;'>" + user_id + "</div>");

		$('#logout_btn').on('click', function(){
			// Below to disconnect user code line 
			var user_id = localStorage.getItem('username');
			
			if(user_id === null)
			{
				alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
				socket.disconnect();
				$(location).attr('href', url);	
			}
			else
			{
				socket.emit('logout_msg', {username: user_id}); 
				socket.on('logout_res', function(data){
					if(data.response == 'true')
					{
						alert(user_id + ' is logout.');
						localStorage.removeItem('username');
						//TODO: socket.emit('lpos_req', {'x': pos_x, 'y': pos_y}); 
						socket.disconnect();
						$(location).attr('href', url);
					}
					else if(data.response == 'false')
					{
						alert('Logout error.');
					};
				});
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
		var key_down_event = e.keyCode;	

		switch(key_down_event)
		{
			case 38: // up key press down
				$('#battle_ship_img').animate({top: "-=50"});
				break;
			case 40: // down key press down
				$('#battle_ship_img').animate({top: "+=50"});
				break;
			case 37: // left key press down
		        	$('#battle_ship_img').css('transform',  'rotate(' + angle + 'deg)');
//				player_pos = clockwiseRotateTransform(x, y, angle);
				angle -= 30;
				break;
			case 39: // right key press down
				$('#battle_ship_img').css('transform',  'rotate(' + angle + 'deg)');
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
				logout();
				break;
			default:
				break;
		};
		return ; 
	});

	$(document).keyup(function(ev){ // Key press up event 
		var battle_ship_pos = {}; // Create battle ship position set object and send to server
		var key_up_event = ev.keyCode;	
	
		switch(key_up_event)
		{
			case 38:
				$('#battle_ship_img').animate({queue: false});
				break;
			case 40: 
				$('#battle_ship_img').animate({queue: false});
				break;
			case 37:
				$('#battle_ship_img').animate({queue: false});
				break;
			case 39:
				$('#battle_ship_img').animate({queue: false});			
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
		undiscovered_planet_socket.emit('planet_req', {'ready' : 'ready to connect planet db'});
		undiscovered_planet_socket.on('planet_res', function(data){
/*
			//TODO: Received 'Undiscovered planet information' to server
			undiscovered_planet_info.id = data._id;
			undiscovered_planet_info.x = data.location_x;
			undiscovered_planet_info.y = data.location_y;
			undiscovered_planet_info.gas = data.gas;
			undiscovered_planet_info.mineral = data.mineral;
			undiscovered_planet_info.unknown = data.unknown;
			undiscovered_planet_info.grade = data.create_spd;
*/	
			// Create group of the planet grage image obj
			var planet1_img = new Image();
			var planet2_img = new Image();
			var planet3_img = new Image();
			var planet4_img = new Image();

			planet1_img.src = server_url + ":8000/res/img/planet/planet_9.png";
			planet2_img.src = server_url + ":8000/res/img/planet/planet_11.png";
			planet3_img.src = server_url + ":8000/res/img/planet/planet_12.png";
			planet4_img.src = server_url + ":8000/res/img/planet/planet_13.png";

			var canvas = document.getElementById('background');
			var planet_img = new Image();
			var pos_x = parseInt(data.location_x);
			var pos_y = parseInt(data.location_y);
	
			if(canvas.getContext)
			{
				context = canvas.getContext('2d');
				context.fillStyle = 'Black';
				context.rect(0, 0, 2048, 1024);
				context.fill();
				
				drawStars();
			}

			planet_img.onload = function()
			{
				context.drawImage(planet_img, pos_x, pos_y, 100, 100);
			}
			planet_img.src = server_url + ":8000/res/img/planet/planet_11.png";
		});
		return ;
	}

	function drawStars()
	{
		for(var i=0; i<=100; i++)
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

			$('#battle_ship_img').css({
				left: ($(window).width() - $('#battle_ship_img').outerWidth()) / 2,
				top: ($(window).height() - $('#battle_ship_img').outerHeight()) / 2
			});

		}).resize();

		return ;
	}

	// Create planet menu controller function
	function planetViewLayer()
	{  
		var state = $('#planet_layer').css('display');
		var undiscovered_planet_info = {};
	
		undiscovered_planet_info.x = null;
		undiscovered_planet_info.y = null;
		undiscovered_planet_info.gas = null;
		undiscovered_planet_info.mineral = null;
		undiscovered_planet_info.undiscovered = null;
		
		//response undiscovered plnaet database 
		undiscovered_planet_socket.emit('planet_req', {'ready' : 'ready to connect planet db'});
		undiscovered_planet_socket.on('planet_res', function(data){
			console.log(data);	
			undiscovered_planet_info.id = data._id;
			undiscovered_planet_info.x = data.location_x;
			undiscovered_planet_info.y = data.location_y;
			undiscovered_planet_info.gas = data.gas;
			undiscovered_planet_info.mineral = data.mineral;
			undiscovered_planet_info.unknown = data.unknown;
			undiscovered_planet_info.grade = data.create_spd;
		
			$('#main_layer').append("<div id='" + data._id + "' style='position: absolute; color: white; top: " + data.location_x + "; left:" + data.location_y + "; width: 100px; height: 100px;'>" + undiscovered_planet_img + "</div>");	

			$('#planet_layer').append("<div id='" + data._id + "' style='position: absolute; color: white; top: " + data.location_x + "; left:" + data.location_y + "; width: 100px; height: 100px;'>" + undiscovered_planet_img + "</div>");
	
		});

		$(window).resize(function(){
			$('#planet_layer').css({
				left: ($(window).width() - $('#planet_layer').outerWidth()) / 2,
				top: ($(window).height() - $('#planet_layer').outerHeight()) / 2
			});
		}).resize();
		
		if(state == 'none')
		{
			$('#planet_layer').show();
		}
		else
		{
			$('#planet_layer').hide();
		}

		return ; 		
	}

	// Create battle ship menu controller function
	function battleShipViewLayer(){	
		var state = $('#battle_ship_layer').css('display');
	
		$(window).resize(function(){
			$('#battle_ship_layer').css({
				left: ($(window).width() - $('#battle_ship_layer').outerWidth()) / 2,
				top: ($(window).height() - $('#battle_ship_layer').outerHeight()) / 2
			});
		}).resize();

		if(state == 'none')
		{
			$('#battle_ship_layer').show();
		}
		else
		{
			$('#battle_ship_layer').hide();
		}
	
		return ;
	}

	// Create rank menu controller function
	function rankViewLayer()
	{	
		var state = $('#rank_layer').css('display');
		
		$(window).resize(function(){
			$('#rank_layer').css({
				left: ($(window).width() - $('#rank_layer').outerWidth()) / 2,
				top: ($(window).height() - $('#rank_layer').outerHeight()) / 2
			});
		}).resize();

		if(state == 'none')
		{
			$('#rank_layer').show();
		}
		else
		{
			$('#rank_layer').hide();
		}
		return ; 
	}

			
	// Create clockwise rotate transformation matrix function
	function clockwiseRotateTransform(x, y, angle)
	{
		var pos_x, pos_y;

		var ratio = {
			x : Math.cos(angle),
			y : Math.sin(angle)
		};

		pos_x = ((x * ratio.x) + (y * (-ratio.y)));
		pos_y = ((x * ratio.y) + (y * (ratio.x)));

		angle += 30;
			
		return ;
	}

	// Create counter clockwise rotate tranformation matrix function
	function counterClockwiseRotateTransform(x, y, angle)
	{
		var pos_x, pos_y;

		var ratio = {
			x : Math.cos(angle),
			y : Math.sin(angle)
		};

		pos_x = ((x * ratio.x) + (y * (ratio.y)));
		pos_y = ((x * -ratio.y) + (y * (ratio.x)));

		angle += 30;

		return ;	
	}

	function logout()
	{
		var logout_user_id = localStorage.getItem('username');
		var logout_msg = confirm('로그아웃 하시겠습니까?');
		var main_url = server_url + ":8000";

		if(logout_msg == true)
		{
			socket.emit('logout_msg', {username: logout_user_id}); 
			socket.on('logout_res', function(data){
				if(data.response == 'true')
				{
					alert(logout_user_id + ' is logout.');
					localStorage.removeItem('username');
					//socket.emit('lpos_req', {'x': pos_x, 'y': pos_y}); 
					socket.disconnect();
					$(location).attr('href', main_url);
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



