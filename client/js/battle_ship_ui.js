/**
	**File name: battleShipUi.js
	**Writer: luxoss
	**File-explanation: Control battle ship user interface with javascript
*/

// Create battle ship menu controller function
var battleShipViewLayer = function()
{
	var state = $('.battle_ship_ui').css('display');

	if(state == 'none')
	{
		$('.battle_ship_ui').show();
	}
	else
	{
		$('.battle_ship_ui').hide();
	}
	
	$(window).resize(function(){

		$('.battle_ship_ui').css({
			left: ($(window).width() - $('.battle_ship_ui').outerWidth()) / 2,
			top: ($(window).height() - $('.battle_ship_ui').outerHeight()) / 2
		});

	}).resize();

	return ;
};

