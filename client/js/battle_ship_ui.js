/**
	** File name: battle_ship_ui.js
	** File explanation: Control battle ship user interface with javascript
   ** Author: luxoss
*/

// 함선 매뉴를 제어하기 위한 함수 선언
function battleShipViewLayer()
{
	var state = $('.battle_ship_ui').css('display');

	if(state == 'none')
	{
      $("#battle_ship_btn").css('background-color', 'rgba(255, 47, 77, 0.7)');
		$(".battle_ship_ui").show();
	}
	else
	{
      $("#battle_ship_btn").css('background-color', 'rgba(0, 0, 0, 0.7)');
		$(".battle_ship_ui").hide();
	}
	
	$(window).resize(function(){

		$('.battle_ship_ui').css({
			left: ($(window).width() - $('.battle_ship_ui').outerWidth()) / 2,
			top: ($(window).height() - $('.battle_ship_ui').outerHeight()) / 2
		});

	}).resize();
};

