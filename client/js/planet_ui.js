/**
	**File name: planetUi.js
	**Writer: luxoss
	**File-explanation: Control planet user interface with javascript
*/
function planetViewLayer()
{
	var state = $('.planet_ui').css('display');
	var planetImg = {};
/*
	var planetInfo = {
		'name' : ,
		'resource' : , 
		'grade' : , 
		contorlPlanet = function(){ // Create method contorl planet information to server
		}					
	};
	//TODO: Write down got by user planet information code line
	var serverUserPlanetDb = [];
	var getUserPlanetInfo = [];
	for(var i = 0; i < serverUserPlanetDb.length; i++)
	{
		getUserPlanetInfo.push(serverUserPlanetDb[i]);
	}
*/
	if(state == 'none')
	{
		$('.planet_ui').show();

		//response undiscovered plnaet database 
		planetSocket.on("planet_req", function(data){
				$("#planet_name").append("<div id='" + data._id + "'/></div>");		
		});
	}
	else
	{
		$('.planet_ui').hide();
	}

	$(window).resize(function(){

		$('.planet_ui').css({
			left: ($(window).width() - $('.planet_ui').outerWidth()) / 2,
			top: ($(window).height() - $('.planet_ui').outerHeight()) / 2
		});

	}).resize();
		
	return ; 		
};


