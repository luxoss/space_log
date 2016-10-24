/**
	** File name: planet_ui.js
	** File explanation: Control planet user interface with javascript
	** Author: luxoss
*/

var planetViewLayer = function(planetSocket) {
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
         $("#planet_list").append("<div id='pv_name_" + planet.name + "'style='position:inherit;'>" + "planet" + data.p_id +  "</div>");
         $("#planet_list").append("<div id='pv_mineral_" + planet.name + "'style='position:inherit;'>" + data.mineral + "</div>");
         $("#planet_list").append("<div id='pv_gas_" + planet.name + "'style='position:inherit;'>" + data.gas + "</div>");
         $("#planet_list").append("<div id='pv_unknown_" + planet.name + "'style='position:inherit;'>" + data.unknown + "</div>");
         $("#planet_list").append("<div id='pv_develop_" + planet.name + "'style='position:inherit;'>" + data.develop + "</div>");
         $("#planet_list").append("<div id='pv_grade_" + planet.name + "'style = 'position:inherit;'>" + data.create_spd + "</div>");

         $("#pv_name_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'width': 200,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left: 10,
            top: Math.floor(0 + styleTop)
         });

         $("#pv_mineral_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'width': 127,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left  : 210,
            top   : Math.floor(0 + styleTop)
         });

         $("#pv_gas_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'width' : 127,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left  : 337,
            top   : Math.floor(0 + styleTop)
         });

         $("#pv_unknown_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'width': 127,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left  : 464,
            top   : Math.floor(0 + styleTop)
         });

         $("#pv_develop_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'width': 200,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left  : 591,
            top   : Math.floor(0 + styleTop)
         });

         $("#pv_grade_" + planet.name).css({
            'width': 193,
            'height': 100,
            'text-align': 'center',
            'line-height': 100,
            left  : 791,
            top   : Math.floor(0 + styleTop)
         });

         styleTop = Math.floor(styleTop + 100);
         // TODO: 2. Own user's planets display that is developed. 
      });
   }
   else 
   {
      $("#planet_btn").css("background-color", "rgba(0, 0, 0, 0.7)");
      $('.planet_ui').hide();
   }
};


