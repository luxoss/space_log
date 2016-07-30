/**
	**File name: battleShipUi.js
	**Writer: luxoss
	**Modified date: 07/30/2016
*/

// Create battle ship menu controller function
var battleShipViewLayer = function()
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
};

