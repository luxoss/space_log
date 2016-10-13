/**
	** File name: rankUi.js
	** File explanation: Control rank user interface with javascript 
   ** Author: luxoss
*/

// 랭크 메뉴 정보를 제어하기 위한 함수 
function rankViewLayer()
{	
	var state = $('.rank_ui').css('display');

	if(state == 'none')
	{
      $(window).resize(function(){
         $('.rank_ui').css({
            left: ($(window).width() - $('.rank_ui').outerWidth()) / 2,
            top: ($(window).height() - $('.rank_ui').outerHeight()) / 2
         });
      }).resize();

      $("#rank_btn").css("background-color", "rgba(255, 47, 77, 0.7)");
		$('.rank_ui').show();
	}
	else
	{
      $("#rank_btn").css("background-color", "rgba(0, 0, 0, 0.7)");
		$('.rank_ui').hide();
	}
}
	
