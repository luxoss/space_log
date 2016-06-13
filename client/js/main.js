/* Javascript file :: main_page_control */

/*
// Create get_parameter method
var get_parameter = function(param){
	var return_value;
	var url = winodw.location.href;
	var parameters = (url.slice(url.indexOf('?') + 1, url, length)).split('&');
	
	for(var i=0; i<parameters.length; i++){
		var user_name = parameters[i].split('=')[0];
		
		if(user_name.toUpperCase() == param.toUpperCase()){
			return_value = parameters[i].split('=')[1];
			return decodeURIComponent(return_value);
		}
	}
};
*/
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
$(document).ready(function(){
//	set_background();

	var socket = io.connect('http://203.237.179.21:5001');
	var url = "http://203.237.179.21:80";
	var user_id = document.location.href.substr(document.location.href.lastIndexOf('=') + 1);
/*
	var planet_info = function(){}; // Create planet information object 
	var battle_ship_info = {};

	// Create Each name space in planet information object 
	planet_info.mineral = function(){return ;}; 
	planet_info.gas = function(){return ;};
	planet_info.unknown = function(){return ;};

	// Create Each name space in battle ship object
	battle_ship_info.pos = function(x, y, state){
		var pos_x = x;
		var pos_y = y;
		var pos_state = state;
	};

	battle_ship_info = function(){};
		
	socket.on('planet', function(){
		setInterval(planet_info(), 2000); // Update planet obj list on 2sec 
	});
*/
	$('#logout_btn')
		.on('click', function(){
			alert('Click logout button.');
			/* Below to disconnect user code line */
			//alert('connection user id: ' + user_id);
			socket.emit('logout_msg', {username: user_id}); 
			socket.on('logout_res', function(data){
				if(data.response == 'true'){
					alert(user_id + ' is logout.');
					socket.disconnect();
					$(location).attr('href', url);
				}else if(data.response == 'false'){
					alert('Logout error.');
				};
			});
			//$(location).attr('href', url);
		});	
	
	$('#planet_btn')
		.on('click', function(){
			alert('Click planet button.');
			open_popup_view();
		});

	$('#battle_ship_btn')
		.on('click', function(){
			alert('Click battle ship button.');
			open_popup_view();
		});

	$('rank_btn')
		.on('click', function(){
			alert('Click rank button.');
			open_popup_view();
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
			alert('battle ship button');
			break;
		case 82:
			alert('rank button');
			break;
		case 80:
			alert('planet button');
			pop_up_window(this, 'name', '100', '100', 'yes'); 
			break;
		default:
			break;
	};
});

// Create open other window in Ifram set
var win = null;

function pop_up_window(mypage, myname, w, h, scroll){
	left_pos = (screen.width) ? (screen.width-w)/2 : 0;
	top_pos = (screen.height) ? (screen.height-h)/2 : 0;
	
	settings = 'height=' + h + ',width=' + w + ',top=' + top_pos + ',left=' + left_pos + ',scrollbars=' + scroll + ',resizable';
	win = window.open(mypage, myname, settings);
	
	return false; 
}
/*
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
		
