/**
	**File name: rankUi.js
	**Writer: luxoss
	**File-explanation: Control rank user interface with javascript 
*/
var rankViewLayer = function(){
	
	// Create rank menu controller function
	var state = $('.rank_ui').css('display');

	if(state == 'none')
	{
		$('.rank_ui').show();
	}
	else
	{
		$('.rank_ui').hide();
	}
	
	$(window).resize(function(){
		$('.rank_ui').css({
			left: ($(window).width() - $('.rank_ui').outerWidth()) / 2,
			top: ($(window).height() - $('.rank_ui').outerHeight()) / 2
		});
	}).resize();

	return ; 
};
	
