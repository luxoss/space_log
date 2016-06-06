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


$(document).ready(function(){
	var socket = io.connect('http://52.79.132.7:3000');
	var url = "http://52.79.132.7:8000";
	var user_id = document.location.href.substr(document.location.href.lastIndexOf('=') + 1);
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
			/* Below to disconnect user code line */
			//alert('connection user id: ' + user_id);
			socket.emit('logout_msg', {username: user_id}); 
			socket.on('logout_res', function(data){
				if(data.response == 'true'){
					alert(user_id + 'is logout.');
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

