/**
	** File name: planet_ui.js
	** File explanation: Control planet user interface with javascript
	** Author: luxoss
*/

var planetViewLayer = function(user, socket) {

   var state = $('#planet_ui').css('display');
   var planetViewSocket = socket;
   var planetInfo = {};
   var styleTop = 0;
  
   if(state == 'none') 
   {
      //planetViewSocket.planet.connect();

      $('#planet_ui').css({
         left: ($(window).width() - $('#planet_ui').outerWidth()) / 2,
	      top: ($(window).height() - $('#planet_ui').outerHeight()) / 2
      });
      
      $("#planet_btn").css('background-color', 'rgba(255, 47, 77, 0.7)');
      $('#planet_ui').show();

      // All planet listing
      planetViewSocket.planet.emit('planet_req', { 'ready' : 'Ready to receive' });

      planetViewSocket.planet.on('planet_res', function(data){
         console.log(data);
         planetInfo.name = "행성" + data.p_id;
         planetInfo.mineral = "[M] " + data.mineral;
         planetInfo.gas = "[G] " + data.gas;
         planetInfo.unknown = "[U] " + data.unknown;
         planetInfo.develop = data.develop;
         planetInfo.grade = (Number(data.create_spd) + 1);

         $("#planet_list").append(
            "<div id='pv_name_" + planetInfo.name + "'style='position:absolute; line-height:100px; background-color: rgba(0, 0, 0, 0.7); color: rgba(255, 255, 0, 0.7);" + 
            "font-weight:bold; width: 200px; height: 100px; text-align: center; left: 10px;" + "top:" + parseInt(Number(styleTop) + 0) + "px;'></div>"
         );
         $("#planet_list").append(
            "<div id='pv_mineral_" + planetInfo.name + "'style='position:absolute; line-height:100px; background-color: rgba(0, 0, 0, 0.7); color: rgba(255, 255, 255, 0.7);" + 
            "font-weight:bold; width: 127px; height: 100px; text-align: center; left: 210px;" + "top:" + parseInt(Number(styleTop) + 0) + "px;'></div>" 
         );
         $("#planet_list").append(
            "<div id='pv_gas_" + planetInfo.name + "'style='position:absolute; line-height:100px; background-color: rgba(0, 0, 0, 0.7); color: rgba(255, 255, 255, 0.7);" + 
            "font-weight:bold; width: 127px; height: 100px; text-align: center; left: 337px;" + "top:" + parseInt(Number(styleTop) + 0) + "px;'></div>"
         );
         $("#planet_list").append(
            "<div id='pv_unknown_" + planetInfo.name + "'style='position:absolute; line-height:100px; background-color: rgba(0, 0, 0, 0.7); color: rgba(255, 255, 255, 0.7);" + 
            "font-weight:bold; width: 127px; height: 100px; text-align: center; left: 464px;" + "top:" + parseInt(Number(styleTop) + 0) + "px;'></div>"
         );
         $("#planet_list").append(
            "<div id='pv_develop_" + planetInfo.name + "'style='position:absolute; line-height:100px; background-color: rgba(0, 0, 0, 0.7); color: rgba(255, 255, 0, 0.7);" + 
            "font-weight:bold; width: 200px; height: 100px; text-align: center; left: 591px;" + "top:" + parseInt(Number(styleTop) + 0) + "px;'></div>"
         );
         $("#planet_list").append(
            "<div id='pv_grade_" + planetInfo.name + "'style='position:absolute; line-height:100px; background-color: rgba(0, 0, 0, 0.7); color: rgba(255, 255, 255, 0.7);" + 
            "font-weight:bold; width: 190px; height: 100px; text-align: center; left: 791px;" + "top:" + parseInt(Number(styleTop) + 0) + "px;'></div>"
         );

         switch(planetInfo['develop'])
         {
            case "true" :
         
               $("#pv_name_" + planetInfo.name).text(planetInfo.name);
               $("#pv_mineral_" + planetInfo.name).text(planetInfo.mineral);
               $("#pv_gas_" + planetInfo.name).text(planetInfo.gas);
               $("#pv_unknown_" + planetInfo.name).text(planetInfo.unknown);
               $("#pv_develop_" + planetInfo.name).text(data.username);
               $("#pv_grade_" + planetInfo.name).text(planetInfo.grade);
               break;

            case "false" :
               $("#pv_name_" + planetInfo.name).text(planetInfo.name);
               $("#pv_mineral_" + planetInfo.name).text(planetInfo.mineral);
               $("#pv_gas_" + planetInfo.name).text(planetInfo.gas);
               $("#pv_unknown_" + planetInfo.name).text(planetInfo.unknown);
               $("#pv_develop_" + planetInfo.name).text("미 개척된 행성");
               $("#pv_grade_" + planetInfo.name).text(planetInfo.grade);
               break;

            default :
               console.log("[CLIENT LOG] It was wrong:", data);
               break;
         }
         
         styleTop = (Number(styleTop) + 100);
     });
   }
   else
   {
      $("#planet_btn").css("background-color", "rgba(0, 0, 0, 0.7)");
      $("#planet_list").empty();
      $('#planet_ui').hide();
      //planetViewSocket.planet.disconnect();
   }
};

/*
   //TODO: TEST...
   document.getElementByid('pv_name_' + planet.name).innerHTML = "planet" + planet['name'];
   document.getElementByid('pv_name_' + planet.name).innerHTML = planet['mineral'];
   document.getElementByid('pv_name_' + planet.name).innerHTML = planet['gas'];
   document.getElementByid('pv_name_' + planet.name).innerHTML = planet['unknown'];
   document.getElementByid('pv_name_' + planet.name).innerHTML = planet['develop'];
   document.getElementByid('pv_name_' + planet.name).innerHTML = planet['grade'];

   $('#plnaet_list [id]').each(function(){
      $('[id="' + this.id + '"];not(#" + this.id + ":first)').remove();
   });
   $('[id]').each(function() {
      $('[id="' + this.id + '"]gt(0)').remove();
   });

   $("#all_planets").click(function(event){
   //.off('click.all_planets').on('click.all_planets', function(event){

      //$("#my_plnaet_list").hide();
      $("#planet_list").show();
               //$("#my_planets").css("background-color", "rgba(0, 0, 0, 0.7)");
      //$("#all_planets").css("background-color", "rgba(207, 47, 77, 0.7)");

      event.stopImmediatePropagation();
      //return false;
   });
   $("#my_planets").off('click.my_planets').on('click.my_planets', function(event){
      //$("#planet_list").hide();
      $("#my_planet_list").show();
      //$("#my_planets").css("background-color", "rgba(29, 66, 107, 0.7)");
      $("#all_planets").css("background-color", "rgba(0, 0, 0, 0.7)");
      // My planets listing     
      planetViewSocket.planet.emit('my_planet_req', { username : user['name']});

      planetViewSocket.planet.on('my_planet_res', function(data){

         var myPlanets = {
            name : data.p_id,
            gas : data.gas,
            mineral : data.mineral, 
            unknown : data.unknown,
            develop : data.develop,
            grade : data.create_spd
         }; 

         // TODO: Remove overlaping tags 
         $("#my_planet_list").append("<div id='my_pv_name_" + myPlanets.name + "'style='position:inherit; line-height:100px;'></div>");
         $("#my_planet_list").append("<div id='my_pv_mineral_" + myPlanets.name + "'style='position:inherit; line-height:100px;'></div>");
         $("#my_planet_list").append("<div id='my_pv_gas_" + myPlanets.name + "'style='position:inherit; line-height:100px;'></div>");
         $("#my_planet_list").append("<div id='my_pv_unknown_" + myPlanets.name + "'style='position:inherit; line-height:100px;'></div>");
         $("#my_planet_list").append("<div id='my_pv_develop_" + myPlanets.name + "'style='position:inherit; line-height:100px;'></div>");
         $("#my_planet_list").append("<div id='my_pv_grade_" + myPlanets.name + "'style = 'position:inherit; line-height:100px;'></div>");

         // TODO: Change html() -> text()
         $("#my_pv_name_" + myPlanets.name).text("planet" + myPlanets['name']);
         $("#my_pv_mineral_" + myPlanets.name).text(myPlanets['mineral']);
         $("#my_pv_gas_" + myPlanets.name).text(myPlanets['gas']);
         $("#my_pv_unknown_" + myPlanets.name).text(myPlanets['unknown']);
         $("#my_pv_develop_" + myPlanets.name).text("개척된 행성");
         $("#my_pv_grade_" + myPlanets.name).text(parseInt(myPlanets['grade'] + 1));

         $("#my_pv_name_" + myPlanets.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width': 200,
            'height': 100,
            'text-align': 'center',
            left: 10,
            top: Math.floor(0 + myStyleTop)
         });

         $("#my_pv_mineral_" + myPlanets.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width': 127,
            'height': 100,
            'text-align': 'center',
            left  : 210,
            top   : Math.floor(0 + myStyleTop)
         });

         $("#my_pv_gas_" + myPlanets.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width' : 127,
            'height': 100,
            'text-align': 'center',
            left  : 337,
            top   : Math.floor(0 + myStyleTop)
         });

         $("#my_pv_unknown_" + myPlanets.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width': 127,
            'height': 100,
            'text-align': 'center',
            left  : 464,
            top   : Math.floor(0 + myStyleTop)
         });

         $("#my_pv_develop_" + myPlanets.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width': 200,
            'height': 100,
            'text-align': 'center',
            left  : 591,
            top   : Math.floor(0 + myStyleTop)
         });

         $("#my_pv_grade_" + myPlanets.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color' : 'rgba(255, 255, 255, 1)',
            'font-weight': 'bold',
            'width': 190,
            'height': 100,
            'text-align': 'center',
          //  'line-height': 100,
            left  : 791,
            top   : Math.floor(0 + myStyleTop)
         });
         myStyleTop = Math.floor(myStyleTop + 100);          
      });
     
      event.stopImmediatePropagation();
      return false;
   });
*/



