/* Javascript file :: main_page_control */

$(document).ready(function(){
	var socket = io.connect('http://52.79.132.7:3000');
/*
	var planet_info = {}; // Create planet information object 
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
		
	socket.on('planet_infor', function(){
	});
*/
	$('#logout_btn')
		.on('click', function(){
			alert('Click logout button.');
			// Below to disconnect user code line
			
			socket.emit('logout_msg', {username: user_info.username}); 
			socket.disconnect();	
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
			break;
		default:
			break;
	};
});

function open_popup_view(){
		window.open('index.html', 'pop_ip', 
			    'width=840, height=480, toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=no, left=300, top=300'
		);
};

