/* 
	Javascript file === 'main_page_control.js'
	function naming is 'CamelCase';
	valuable and object naming is 'under_bar case'
*/

/* Create socket in global valuable. becuz socket access all document type */
var socket = io.connect('http://203.237.179.21:5001');
var undiscovered_planet_socket = io.connect('http://203.237.179.21:5002');
//var angle = 0;
//var bg_width = 2048;
//var bg_height = 1024;

$(document).ready(function(){ // Ready to the document 
	var url = "http://203.237.179.21:8000";
	var user_id = localStorage.getItem('username');
	

	//undiscovered_planet_draw_init();
	setBackground();
	userStateInit(); // Call user state initialize function

	$('#battle_ship_img').append("<div id='" + user_id + "'style='postion:fixed; color: white;'>" + user_id + "</div>");

	$('#logout_btn').on('click', function(){
		// Below to disconnect user code line 
		var user_id = localStorage.getItem('username');
		
		try
		{
			socket.emit('logout_msg', {username: user_id}); 
			socket.on('logout_res', function(data){
				
				if(data.response == 'true')
				{
					alert(user_id + ' is logout.');
					localStorage.removeItem('username');
					socket.disconnect();
					$(location).attr('href', url);
				}
				else if(data.response == 'false')
				{
					alert('Logout error.');
				};
			});
		}
		catch(user_id === null)
		{
			alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
			socket.disconnect();
			$(location).attr('href', url);
		}
	});	
/*	
		if(user_id === null)
		{
				alert('비 정상적인 로그아웃이므로 게임을 강제 종료합니다.');
				socket.disconnect();
				$(location).attr('href', url);
			}else{
				socket.emit('logout_msg', {username: user_id}); 
				socket.on('logout_res', function(data){
					if(data.response == 'true'){
						alert(user_id + ' is logout.');
						localStorage.removeItem('username');
						socket.disconnect();
						$(location).attr('href', url);
					}else if(data.response == 'false'){
						alert('Logout error.');
					};
				});
			}
*/	
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
	var battle_ship_pos_top = document.getElementById('battle_ship_img');
	var player_pos = new Array(3);
	
	switch(key_down_event)
	{
		case 38: // up key press down
			$('#battle_ship_img').animate({top: "-=50"}, {queue: false});
			// rotate_translation(top, left) top, left is 'coordinate x, y';
			// [x', y'] =  [x, y][{sin(angle), cos(angle)}, {cos(angle), sin(angle)}] is right rotate translation
			break;
		case 40: // down key press down
			$('#battle_ship_img').animate({top: "+=50"}, {queue: false});
			break;
		case 37: // left key press down
	        	$('#battle_ship_img').css('transform',  'rotate(' + angle + 'deg)');
			player_pos = clockwiseRotateTransform(x, y, angle);
			player_pos[2] -= 30;
//			angle -= 30;
			break;
		case 39: // right key press down
			$('#battle_ship_img').css('transform',  'rotate(' + angle + 'deg)');
			counterClockwiseRotateTransform(x, y, angle);
			player_pos[2] += 30;
//			angle += 30;
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
			$('#battle_ship_img').stop();
			break;
		case 40: 
			$('#battle_ship_img').stop();
			break;
		case 37:
			$('#battle_ship_img').stop();
			break;
		case 39:
			$('#battle_ship_img').stop();			
			break;
		case 83:
			alert('shot button');
			break;
		default:
			break;
	};

});
	
// Create draw background image in canvas 
function setBackground()
{
	undiscovered_planet_socket.emit('planet_req', {'ready' : 'ready to connect planet db'});
	undiscovered_planet_socket.on('planet_res', function(data){
	console.log(data);
/*
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

		planet0_img.src = 'http://203.237.179.21:8000/res/img/planet/planet_9.png';
		planet1_img.src = "http://203.237.179.21:8000/res/img/planet/planet_11.png";
		planet2_img.src = "http://203.237.179.21:8000/res/img/planet/planet_12.png";
		planet3_img.src = "http://203.237.179.21:8000/res/img/planet/planet_13.png";

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

		test_planet_img.onload = function()
		{
			context.drawImage(test_planet_img, pos_x, pos_y, 100, 100);
			console.log(pos_x, pos_y);
		}
		planet_img.src = "http://203.237.179.21:8000/res/img/planet/planet_11.png";
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
				
		$('#user_obj').css({
			left: ($(window).width() - $('#user_obj').outerWidth()) / 2,
			top: ($(window).height() - $('#user_obj').outerHeight()) / 2
		});


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
	var ratio = {
		x : Math.cos(angle),
		y : Math.cos(angle)
	};
	var pos_x, pos_y;

	pos_x = ((x * ratio.x) + (y * (-ratio.y));
	pos_y = ((x * ratio.y) + (y * (ratio.y));

	angle += 30;

	return [pos_x, pos_y];
}

// Create counter clockwise rotate tranformation matrix function
function counterClockwiseRotateTransform(x, y, angle)
{
	var pos_x, pos_y;
	var ratio = {
		x : Math.cos(angle),
		y : Math.cos(angle)
	};

	pos_x = ((x * ratio.x) + (y * (ratio.y));
	pos_y = ((x * -ratio.y) + (y * (ratio.y));

	angle += 30;

	return [pos_x, pos_y];	
}


/*
function undiscovered_planet_draw_init(){ // Create undiscovered planet draw function
	var undiscovered_planet_info = {}; // Create undiscovered planet information object
	
	// Set initialize 'null'
	undiscovered_planet_info.id = null;
	undiscovered_planet_info.x = null;
	undiscovered_planet_info.y = null;
	undiscovered_planet_info.gas = null;
	undiscovered_planet_info.mineral = null;
	undiscovered_planet_info.undiscovered = null;

	// Response undiscovered plnaet database 
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


		for(var planet in undiscovered_planet_info){
			console.log(planet);
		}

		//console.log(undiscovered_planet_info.id);

		var planet0_img = new Image();
		var planet1_img = new Image();
		var planet2_img = new Image();
		var planet3_img = new Image();
		var planet4_img = new Image();

		planet0_img.src = 'http://203.237.179.21:8000/res/img/planet/planet_9.png';
		planet1_img.src = "http://203.237.179.21:8000/res/img/planet/planet_11.png";
		planet2_img.src = "http://203.237.179.21:8000/res/img/planet/planet_12.png";
		planet3_img.src = "http://203.237.179.21:8000/res/img/planet/planet_13.png";

		//var slash = '/';
		//var double_slash = '//';

		var test_img_url = "../res/img/planet/planet_1.png";
		var undiscovered_planet_img = "<div style='position: fixed; width: 100px; height: 100px; background-image: url('../res/img/planet/planet_1.png');'></div>"
		
		$('#main_layer').append("<div id='" + data._id + "' style='position: absolute; color: white; top: " + data.location_x + "; left:" + data.location_y + "; width: 100px; height: 100px;'>" + undiscovered_planet_img + "</div>");	

		$('#planet_layer').append("<div id='" + data._id + "' style='position: absolute; color: white; top: " + data.location_x + "; left:" + data.location_y + "; width: 100px; height: 100px;'>" + undiscovered_planet_img + "</div>");
		

	});
 
	//console.log('x: ' + undiscovered_planet_info.x + ', ' + 'y: ' + undiscovered_planet_info.y);
	//console.log('gas: ' + undiscovered_planet_info.gas + ', ' + 'mineral: ' + undiscovered_planet_info.mineral + ', ' + 'undiscovered: ' + undiscovered_planet_info.undiscovered); 
	
	return ;
}
*/




