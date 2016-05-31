/* Javascript file :: main_page_control */

$(document).ready(function(){
/*
	var socket = io.connect();
	
	socket.on('planet_infor', function(){
	});
*/
	function key_code_set(){
		var key_code = event.keyCode;
		alert(key_code);
	};

	function open_popup_view(){
		window.open('index.html', 'pop_ip', 
			    'width=840, height=480, toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=no, left=300, top=300'
		);
	});

	$('#logout_btn')
		.on('click', function(){
			alert('Click logout button.');
			// Below to disconnect user code line
		});	
	
	$('planet_btn')
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





