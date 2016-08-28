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
		contorlPlanet = function(){ // 서버로 부터 받은 행성 정보를 제어하기 위한 매서드 
		}					
	};
	//TODO: 나중에 처리
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

		// 행성 DB를 plnaet socket으로 받기 위함. 
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


