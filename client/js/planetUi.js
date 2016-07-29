/**
	**File name: planetUi.js
	**Writer: luxoss
	**Modiifed date: 07/29/2016
*/
var planetViewLayer = function(){
	
	// Create planet menu controller function
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
};


