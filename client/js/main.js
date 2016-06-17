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
	var socket = io.connect('http://203.237.179.21:5001');
	var unknown_planet_socket = io.connect('http://203.237.137.21:5002');
	var url = "http://203.237.179.21:80";
	var angle = 0;
	user_state_init(); // Call user state initialize function

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
/*
	var battle_ship_pos = {};
*/
	//alert(e.keyCode);

	var key_down_event = e.keyCode;	

	switch(key_down_event){
		case 38:
			$('#battle_ship_img').animate({top: "-=50"}, {queue: false});
			break;
		case 40: 
			$('#battle_ship_img').animate({top: "+=50"}, {queue: false});
			break;
		case 37:
	        //	$('#battle_ship_img').animate({left: "-=50"}, 1000);
			break;
		case 39:
		//	$('#battle_ship_img').animate({left: "+=50"}, 1000);
		//	battle_ship_angle_transform(angle);
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
/*
$(document).keyup(function(ev){

	var battle_ship_pos = {};

	//alert(e.keyCode);

	var key_up_event = ev.keyCode;	

	switch(key_up_event){
		case 38:
			$('#battle_ship_img').stop();
			break;
		case 40: 
			$('#battle_ship_img').stop();
			break;
		case 37:
	        //	$('#battle_ship_img').animate({left: "-=50"}, 1000);
			break;
		case 39:
		//	$('#battle_ship_img').animate({left: "+=50"}, 1000);
			battle_ship_angle_transform(angle);
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
*/

function battle_ship_angle_transform(angle){
	document.getElementById('battle_ship_img').style.transform = "rotate(" + angle + "deg)";
	angle += 30;	
}
	
function user_state_init(){

	$(window).resize(function(){
		$('#battle_ship_img').css({
			left: ($(window).width() - $('#user_obj').outerWidth()) / 2,
			top: ($(window).height() - $('#user_obj').outerHeight()) / 2
		});

		$('#planet').css({
			left: ($(window).width() - $('#user_obj').outerWidth()) / 2,
			top: ($(window).height() - $('#user_obj').outerHeight()) / 2
		});
	
	}).resize();
}

function planet_view_layer(){

	var state = $('#planet_layer').css('display');
	var unknown_planet_info = {};
	
	unknown_planet.x = null;
	unknown_planet.y = null;
	unknown_planet.gas = null;
	unknown_planet.mineral = null;
	unknown_planet.unknown = null;
/*
	//response unknown plnaet database 

	unknown_planet_socket.on('planet_req', function(data){
		alert(data);

		unknown_planet_info.x = data.location_x;
		unknown_planet_info.y = data.location_y;
		unknown_planet_info.gas = data.gas;
		unknown_planet_info.mineral = data.mineral;
		unknown_plnaet_info.unknown = data.unknown;
		
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

		
