/**
	**File name: planet_ui.js
	**File-explanation: Control planet user interface with javascript
	**Writer: luxoss
*/

function planetViewLayer(planetSocket)
{
	var state = $('.planet_ui').css('display');
	console.log(typeof planetSocket);
	console.log(planetSocket);

	if(state == 'none') {
		$('.planet_ui').show();

		planetSocket.emit('planet_req', {'receive' : 'that'});

		planetSocket.on('planet_res', function(data){

			console.log('socket is alive.');
			var planet = {
				name : data._id,
				gas : data.gas,
				mineral : data.mineral,
				unknown : data.unknown,
				//discover : "false",
				grade : data.create_spd
			};
			
			console.log(
				planet.name,
				planet.gas,
				planet.mineral,
				planet.unknown,
				planet.grade
			);

			$("#planet_name").append(
				"<div id ='" + planet.name + "' style='position: absolute;'></div>"
			);

			$("#planet_resource").append(
				"<div id='" + planet.gas + "'style='position:absolute;'></div>"	
				+ "<div id='" + planet.mineral + "'style='position:absolute;'></div>" 
				+ "<div id='" + planet.unknown + "'style='position:absolute;'></div>"
			);

			//$("#planet_discovered").append(planet.discover);
			$("#planet_grade").append(
				"<div id='" + planet.grade + "'style='position:absolute;'></div>"
			); 

		});
	}
	else {
		$('.planet_ui').hide();
	}

	$(window).resize(function(){

		$('.planet_ui').css({
			left: ($(window).width() - $('.planet_ui').outerWidth()) / 2,
			top: ($(window).height() - $('.planet_ui').outerHeight()) / 2
		});

	}).resize();		
}


