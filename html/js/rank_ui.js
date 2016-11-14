/**
	** File name        : rank_ui.js
	** File explanation : Control rank user interface with javascript 
   ** Author           : luxoss
*/

// 랭크 메뉴 정보를 제어하기 위한 함수 
function rankViewLayer(socket) 
{	
	var state = $('#rank_ui').css('display');
   var styleTop = 0;

	if(state == 'none')
	{
      socket.rank.connect();

      $('#rank_ui').css({
         left: ($(window).width() - $('#rank_ui').outerWidth()) / 2,
         top: ($(window).height() - $('#rank_ui').outerHeight()) / 2
      });

      $("#rank_btn").css("background-color", "rgba(255, 47, 77, 0.7)");
		$('#rank_ui').show();

      socket.rank.emit('rank_req', {'ready' : 'Ready to receive'});
      
      socket.rank.on('rank_res', function(data) {

         var userList = {
            rank : data.rank,
            name : data.username,
            score: data.score
         };

         $("#user_list").append("<div id='rank_number_" + userList.name + "' style='position:inherit; line-height: 100px;'></div>");
         $("#user_list").append("<div id='rank_username_" + userList.name + "' style='position:inherit; line-height: 100px;'></div>");
         $("#user_list").append("<div id='rank_user_score_" + userList.name + "' style='position:inherit; line-height: 100px;'></div>");

         $("#rank_number_" + userList.name).text(userList['rank']);
         $("#rank_username_" + userList.name).text(userList['name']);
         $("#rank_user_score_" + userList.name).text(userList['score']);

         $("#rank_number_" + userList.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color'            : 'rgba(255, 255, 255, 1)',
            'font-size'        : '20pt',
            'font-weight'      : 'bold',
            'width'            : 100,
            'height'           : 100,
            'text-align'       : 'center',
            left               : 10,
            top                : Math.floor(0 + styleTop)
         });

         $("#rank_username_" + userList.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color'            : 'rgba(255, 255, 255, 1)',
            'font-size'        : '20pt',
            'font-weight'      : 'bold',
            'width'            : 285,
            'height'           : 100,
            'text-align'       : 'center',
            left               : 110,
            top                : Math.floor(0 + styleTop)
         });

         $("#rank_user_score_" + userList.name).css({
            'background-color' : 'rgba(0, 0, 0, 0.7)',
            'color'            : 'rgba(255, 255, 255, 1)',
            'font-size'        : '20pt',
            'font-weight'      : 'bold',
            'width'            : 187,
            'height'           : 100,
            'text-align'       : 'center',
            left               : 395,
            top                : Math.floor(0 + styleTop)
         });
         styleTop = Math.floor(styleTop + 100);                  
	   });
   }
	else
	{
      $("#rank_btn").css("background-color", "rgba(0, 0, 0, 0.7)");
      $("#user_list").empty(); // Added a code line
		$('#rank_ui').hide();

      socket.rank.disconnect();
	}
}
	
