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
      $('.planet_ui').css({
         left: ($(window).width() - $('.planet_ui').outerWidth()) / 2,
	      top: ($(window).height() - $('.planet_ui').outerHeight()) / 2
      });
      
      $("#planet_btn").css('background-color', 'rgba(255, 47, 77, 0.7)');
      $('.planet_ui').show();
     
      planetSocket.emit('planet_req', { 'ready' : 'Ready to receive' });

      planetSocket.on('planet_res', function(data){
         var planet = {
            name : data.p_id,
            gas : data.gas,
            mineral : data.mineral, 
            unknown : data.unknown,
            develop : data.develop,
            grade : data.create_spd
         }; 

         // TODO: Remove overlaping tags 
         $("#planet_list").append("<div id='pv_name_" + planet.name + "'style='position:inherit; line-height:100px;'></div>");
         $("#planet_list").append("<div id='pv_mineral_" + planet.name + "'style='position:inherit; line-height:100px;'></div>");
         $("#planet_list").append("<div id='pv_gas_" + planet.name + "'style='position:inherit; line-height:100px;'></div>");
         $("#planet_list").append("<div id='pv_unknown_" + planet.name + "'style='position:inherit; line-height:100px;'></div>");
         $("#planet_list").append("<div id='pv_develop_" + planet.name + "'style='position:inherit; line-height:100px;'></div>");
         $("#planet_list").append("<div id='pv_grade_" + planet.name + "'style = 'position:inherit; line-height:100px;'></div>");

         // TODO: Change html() -> text()
         $("#pv_name_" + planet.name).text("planet" + planet['name']);
         $("#pv_mineral_" + planet.name).text(planet['mineral']);
         $("#pv_gas_" + planet.name).text(planet['gas']);
         $("#pv_unknown_" + planet.name).text(planet['unknown']);
         $("#pv_develop_" + planet.name).text(planet['develop']);
         $("#pv_grade_" + planet.name).text(parseInt(planet['grade'] + 1));

         /*
            document.getElementByid('pv_name_' + planet.name).innerHTML = "planet" + planet['name'];
            document.getElementByid('pv_name_' + planet.name).innerHTML = planet['mineral'];
            document.getElementByid('pv_name_' + planet.name).innerHTML = planet['gas'];
            document.getElementByid('pv_name_' + planet.name).innerHTML = planet['unknown'];
            document.getElementByid('pv_name_' + planet.name).innerHTML = planet['develop'];
            document.getElementByid('pv_name_' + planet.name).innerHTML = planet['grade'];
         */

         $("#pv_name_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width': 200,
            'height': 100,
            'text-align': 'center',
            left: 10,
            top: Math.floor(0 + styleTop)
         });

         $("#pv_mineral_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width': 127,
            'height': 100,
            'text-align': 'center',
            left  : 210,
            top   : Math.floor(0 + styleTop)
         });

         $("#pv_gas_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width' : 127,
            'height': 100,
            'text-align': 'center',
            left  : 337,
            top   : Math.floor(0 + styleTop)
         });

         $("#pv_unknown_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width': 127,
            'height': 100,
            'text-align': 'center',
            left  : 464,
            top   : Math.floor(0 + styleTop)
         });

         $("#pv_develop_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width': 200,
            'height': 100,
            'text-align': 'center',
            left  : 591,
            top   : Math.floor(0 + styleTop)
         });

         $("#pv_grade_" + planet.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width': 190,
            'height': 100,
            'text-align': 'center',
          //  'line-height': 100,
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


