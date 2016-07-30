/**
	**File name: planetUi.js
	**Writer: luxoss
	**Modiifed date: 07/30/2016
*/
var planetViewLayer = function()
{
	var state = $('#planet_ui').css('display');
	
	if(state == 'none')
	{
		$('#planet_ui').show();

		//response undiscovered plnaet database 
		planetSocket.on("planet_res", function(data){				
			$("#planet_name").append("<div id='" + data._id + "' style='position: relative'/></div>");	
		});
	}
	else
	{
		$('#planet_ui').hide();
	}

	$(window).resize(function(){

		$('#planet_ui').css({
			left: ($(window).width() - $('#planet_ui').outerWidth()) / 2,
			top: ($(window).height() - $('#planet_ui').outerHeight()) / 2
		});

	}).resize();
		
	return ; 		
};


