/**
	** File name: planet_ui.js
	** File explanation: Control planet user interface with javascript
	** Author: luxoss
*/

function planetViewLayer(planetSocket)
{
   var state = $('.planet_ui').css('display');
      console.log(planetSocket);

   if(state == 'none') 
   {
      $('.planet_ui').show();

      planetSocket.emit('planet_req', { 'ready' : 'Ready to receive' });

      planetSocket.on('planet_res', function(data){
         var planet = {
            name : data._id,
            gas : data.gas,
            mineral : data.mineral, 
            unknown : data.unknown,
            grade : data.create_spd
            //discover : "false",
         };
         console.log(
            "planet: ", "gas: ", "mineral: ", "unknown: ", "grade: ",
            planet.name, planet.gas, planet.mineral, planet.unknown, planet.grade
         );

         // Not a div apped, try list and table tag. e.g) <table></table> or <li></li> or <ul></ul>
         $("#planet_name").append( 
            "<div id ='" + planet.name + "' style='position: absolute;'>" + planet['name'] + "</div>"
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
}


