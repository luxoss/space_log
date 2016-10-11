/**
	** File name: planet_ui.js
	** File explanation: Control planet user interface with javascript
	** Author: luxoss
*/

function planetViewLayer(planetSocket)
{
   var state = $('.planet_ui').css('display');
   var cnt = 1, posDown = 0;

   if(state == 'none') 
   {
      $('.planet_ui').show();

      planetSocket.emit('planet_req', { 'ready' : 'Ready to receive' });

      planetSocket.on('planet_res', function(data){
         var planet = {
            name : data.p_id,
            gas : data.gas,
            mineral : data.mineral, 
            unknown : data.unknown,
            grade : data.create_spd
            //discover : "false",
         };

         console.log( "planet:", planet.name, "gas:", planet.gas, "mineral:", planet.mineral, "unknown:",  planet.unknown, "grade:", planet.grade);
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


