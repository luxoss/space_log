/* Javascript file :: main_page_control */

/*
function set_background(){
	var canvas = document.getElementById('main_layer');
	var context = canvas.getContext('2d');
	var image = new Image();
//	$(#main_layer).css('z-index', 1);
	image.onload = function(){
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
	}
	image.src = "http://52.79.132.7:8000/res/img/space0.jpg"
}
*/
$(document).ready(function(){ // Ready to the document 
//	set_background();
	var socket = io.connect('http://203.237.179.21:5001');
	var url = "http://203.237.179.21:80";

//	$(window).resize();

	$('#logout_btn')
		.on('click', function(){
			/* Below to disconnect user code line */
			//alert('connection user id: ' + user_id);
			var user_id = localStorage.getItem('username');
			if(user_id === null){
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
		});	
	
	$('#planet_btn')
		.on('click', function(){
			planet_view_layer();
		});

	$('#battle_ship_btn')
		.on('click', function(){
			alert('Click battle ship button.');
			battle_ship_view_layer();
		});

	$('#rank_btn')
		.on('click', function(){
			alert('Click rank button.');
			rank_view_layer();
		});
});

$(document).keydown(function(e){
	//alert(e.keyCode);
	var key_event = e.keyCode;	
	switch(key_event){
		case 38:
			alert('up');
			break;
		case 40: 
			alert('down');
			break;
		case 37:
			alert('left');
			break;
		case 39:
			alert('right');
			break;
		case 83:
			alert('shot button');
			break;
		case 66:
			battle_ship_view_layer(); // call function battle ship layer
			break;
		case 82:
			rank_view_layer(); 	  // call function rank layer
			break;
		case 80:
			planet_view_layer();	  // call function planet layer
			break;
		default:
			break;
	};
});

function planet_view_layer(){

	var state = $('#planet_layer').css('display');
	var planet_info = {};
	
	planet.gas = null;
	planet.mineral = null;
	planet.unknown = null;
/*
	socket.on('planet_req', function(){
		
	});
*/ 
	$(window).resize(function(){
		$('#planet_layer').css({
			left: ($(window).width() - $('#planet_layer').outerWidth()) / 2,
			top: ($(window).height() - $('#planet_layer').outerHeight()) / 2
		});
	}).resize();
		
	if(state == 'none'){
		$('#planet_layer').show();
	}else{
		$('#planet_layer').hide();
	}
}

function battle_ship_view_layer(){
	
	var state = $('#battle_ship_layer').css('display');
	
	$(window).resize(function(){
		$('#battle_ship_layer').css({
			left: ($(window).width() - $('#battle_ship_layer').outerWidth()) / 2,
			top: ($(window).height() - $('#battle_ship_layer').outerHeight()) / 2
		});
	}).resize();

	if(state == 'none'){
		$('#battle_ship_layer').show();
	}else{
		$('#battle_ship_layer').hide();
	}
}

function rank_view_layer(){
	
	var state = $('#rank_layer').css('display');
		
	$(window).resize(function(){
		$('#rank_layer').css({
			left: ($(window).width() - $('#rank_layer').outerWidth()) / 2,
			top: ($(window).height() - $('#rank_layer').outerHeight()) / 2
		});
	}).resize();

	if(state == 'none'){
		$('#rank_layer').show();
	}else{
		$('#rank_layer').hide();
	}
}

/*
// Create open other window in Ifram set
var win = null;

function pop_up_window(mypage, myname, w, h, scroll){
	left_pos = (screen.width) ? (screen.width-w)/2 : 0;
	top_pos = (screen.height) ? (screen.height-h)/2 : 0;
	
	settings = 'height=' + h + ',width=' + w + ',top=' + top_pos + ',left=' + left_pos + ',scrollbars=' + scroll + ',resizable';
	win = window.open(mypage, myname, settings);
	
	socket.on('planet_info', function(){
		setInterval(planet_info(x_pos, y_pos, grade, gas, mineral, unknown), 5000); // Call function interval 2sec
	});
	return false; 
}
*/

/*
function planet_info(x_pos, y_pos, grade, gas, mineral, unknown){
	var planet_status = {};

	planet_status.x_pos = x_pos;
	planet_stauts.y_pos = y_pos;
	planet_status.grade = grade;
	planet_status.resources = function(){};
}


var player_set = function(start_pos_x, start_pos_y, _username, _HP, _SP, _damage){
	// Declare player state value	
	var x = start_pos_x;
	var y = start_pos_y;
	var username = _username;
	var damage = _damage;
	var hp = _HP;
	var sp = _SP;
	var sound = new Audio('http://52.79.132.7:8000/res/sound/InterStellare.mp3');
	var shot_cnt = 0; // counting shot

	// Create get player state method
	var get_pos_x = function(){
		return x;
	};

	var get_pos_y = function(){
		return y;
	};

	var get_username = function(){
		return username;
	};

	var get_HP = function(){
		return hp;
	};

	var get_SP = function(){
		return sp;
	};

	var get_damage = function(){
		return damage;
	};

	// Create set player state method
	var set_pos_x = function(new_pos_x){
		x = new_pos_x;
	};

	var set_pos_y = function(new_pos_y){
		y = new_pos_y;
	};

	// Create update player position
	var update_pos = function(keys){
		
		var prev_x = x;
		var prev_y = y;

	);
*/		
		
