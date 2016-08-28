/* 스크롤 좌표만 확인할 목적으로 만듦 */
$(window).scroll(function () {
	var width = $(document).scrollLeft(); 	
	var height = $(document).scrollTop();
	
	log(width, height);
			
});

var log = function(x, y){
    $('#x_log').text(x);
    $('#y_log').text(y);
}
