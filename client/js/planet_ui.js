/**
	** File name: planet_ui.js
	** File explanation: Control planet user interface with javascript
	** Author: luxoss
*/

function planetViewLayer(planetSocket)
{
   var state = $('.planet_ui').css('display');
   var styleTop = 0;


   if(state == 'none') 
   {
      $(window).resize(function(){
         $('.planet_ui').css({
            left: ($(window).width() - $('.planet_ui').outerWidth()) / 2,
	         top: ($(window).height() - $('.planet_ui').outerHeight()) / 2
         });
      }).resize();		
      
      $("#planet_btn").css('background-color', 'rgba(255, 47, 77, 0.7)');
      $('.planet_ui').show();

      planetSocket.emit('planet_req', { 'ready' : 'Ready to receive' });

      planetSocket.on('planet_res', function(data){
         var planet = {
            name : data.p_id,
            gas : data.gas,
            mineral : data.mineral, 
            unknown : data.unknown,
            grade : data.create_spd,
            develop : data.develop
         };
       
         // TODO: 1. All planets display
         $("#planet_list").append("<div id='" + planet.name + "name'style = 'position:absolute;'>" + "planet" + data.p_id +  "</div>");
         $("#planet_list").append("<div id='" + planet.name + "mineral'style = 'position:absolute;'>" + data.mineral + "</div>");
         $("#planet_list").append("<div id='" + planet.name + "gas'style = 'position:absolute;'>" + data.gas + "</div>");
         $("#planet_list").append("<div id='" + planet.name + "unknown'style = 'position:absolute;'>" + data.unknown + "</div>");
         $("#planet_list").append("<div id='" + planet.name + "develop'style = 'position:absolute;'>" + data.develop + "</div>");
         $("#planet_list").append("<div id='" + planet.name + "grade'style = 'position:absolute;'>" + data.create_spd + "</div>");
         

         $("#" + planet.name + "name").css({
            'width': 200,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left: 10,
            top: parseInt(0 + styleTop)
         });

         $("#" + planet.name + "mineral").css({
            'width': 126,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left: 210,
            top: parseInt(0 + styleTop)
         });

         $("#" + planet.name + "gas").css({
            'width' : 126,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left: 336,
            top: parseInt(0 + styleTop)
         });

         $("#" + planet.name + "unknown").css({
            'width': 126,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left: 452,
            top: parseInt(0 + styleTop)
         });

         $("#" + planet.name + "develop").css({
            'width': 200,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left: 578,
            top: parseInt(0 + styleTop)
         });

         $("#" + planet.name + "grade").css({
            'width': 193,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            'left': 766,
            top: parseInt(0 + styleTop)
         });

         styleTop += 100;
         // TODO: 2. Own user's planets display that is developed. 
      });
   }
   else 
   {
      $("#planet_btn").css("background-color", "rgba(0, 0, 0, 0.7)");
      $('.planet_ui').hide();
   }
}


