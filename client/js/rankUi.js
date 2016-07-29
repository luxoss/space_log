/**
	**File name: rankUi.js
	**Writer: luxoss
	**Modified date: 07/30/2016
*/
var rankViewLayer = function(){
	
	// Create rank menu controller function
	var state = $('#rank_layer').css('display');

	if(state == 'none')
	{
		$('#rank_layer').show();
	}
	else
	{
		$('#rank_layer').hide();
	}
	
	$(window).resize(function(){
		$('#rank_layer').css({
			left: ($(window).width() - $('#rank_layer').outerWidth()) / 2,
			top: ($(window).height() - $('#rank_layer').outerHeight()) / 2
		});
	}).resize();

	return ; 
};
	
