/**
	** File name        : rank_ui.js
	** File explanation : Control rank user interface with javascript 
   ** Author           : luxoss
*/

// 랭크 메뉴 정보를 제어하기 위한 함수 
var rankViewLayer = function(socket) {	
	var state = $('#rank_ui').css('display');
   var styleTop = 0;

	if(state == 'none')
	{
      $('#rank_ui').css({
         left: ($(window).width() - $('#rank_ui').outerWidth()) / 2,
         top: ($(window).height() - $('#rank_ui').outerHeight()) / 2
      });

      $("#rank_btn").css("background-color", "rgba(255, 47, 77, 0.7)");
		$('#rank_ui').show();
      /*
      socket.userInfo.emit('', {'ready' : 'ready to receive'});
      socket.userInfo.on('', function(data) {
         var userList = {
            rank : ,
            name : data.username,
            userPlanets : ,
            userResource : 
         };

         $("#user_list").appned("<div id=rank_number_" + userList.rank + "'style='position:inherit; line-height: 100px;'></div>");
         $("#user_id").append("<div id=rank_username_" + userList.name + "'style='position:inherit; line-height: 100px;'></div>");
         $("#user_id").appned("<div id=rank_user_planets_" + userList.userPlanets + "'style='position:inherit; line-height: 100px;'></div>");

         $("#rank_number_" + userList.rank).text(userList['rank']);
         $("#rank_username_" + userList.name).text(userList['name']);
         $("#rank_user_planets_" + userList.userPlanets).text(userList['userPlanets']);

         $("#rank_number_" + userList.rank).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color'            : 'rgba(255, 255, 255, 1)',
            'font-weight'      : 'bold',
            'width'            : 100,
            'height'           : 100,
            'text-align'       : 'center',
            left               : 10,
            top                : parseInt(0 + styleTop)
         });

         $("#rank_username_" + userList.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color'            : 'rgba(255, 255, 255, 1)',
            'font-weight'      : 'bold',
            'width'            : 285,
            'height'           : 100,
            'text-align'       : 'center',
            left               : 110,
            top                : parseInt(0 + styleTop)
         });

         $("#rank_user_planets_" + userList.userPlanets).css({
            'backgournd-color' : 'rgba(0, 0, 0, 0.7)',
            'color'            : 'rgba(255, 255, 255, 1)',
            'font-weight'      : 'bold',
            'width'            : 187,
            'height'           : 100,
            'text-align'       : 'center',
            left               : 395,
            top                : parseInt(0 + styleTop)
         });

         styleTop = parseInt(styleTop + 100);
         */         
	}
	else
	{
      $("#rank_btn").css("background-color", "rgba(0, 0, 0, 0.7)");
		$('#rank_ui').hide();
	}
}
	
