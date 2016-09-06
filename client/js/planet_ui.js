/**
	**File name: planetUi.js
	**Writer: luxoss
	**File-explanation: Control planet user interface with javascript
*/

function planetViewLayer()
{
	var state = $('.planet_ui').css('display');
	var planetSocket = io.connect('http://203.237.179.21:5002');

	if(state == 'none')
	{
		$('.planet_ui').show();

		// 행성 DB를 plnaet socket으로 받기 위함. 
		planetSocket.on("planet_res", function(data){
			var planet = {
				name : data._id,
				gas : data.gas,
				mineral : data.mineral,
				unknown : dta.unknown,
				//discover : "false",
				grade : data.create_spd
			};

			console.log(planet.name);
			$("#planet_name").append("<div id ='" + planet.name + "' style='position: absolute;'></div>");
			$("#planet_resource").
				append("<div id='" + planet.gas + "'style='position:absolute;'></div>"					
				      + "<div id='" + planet.mineral + "'style='position:absolute;'></div>"
				      + "<div id='" + planet.unknown + "'style='position:absolute;'></div>");
			//$("#planet_discovered").append(planet.discover);
			$("#planet_grade").append("<div id='" + planet.grade + "'style='position:absolute;'></div>"); 
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


