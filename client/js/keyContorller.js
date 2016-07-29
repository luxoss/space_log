/**
	**File name: keyController.js
	**Writer: luxoss
	**Modified date: 07/29/2016
*/

$(document).keydown(function(e){ // Create key press down event 
	/*
		38 : up
		40 : down 
		37 : left
		39 : right
		83 : S key is 'Shot'
		66 : B key is 'battle ship button'
		82 : R key is 'Rank button'
		80 : P key is 'Planet information button'
	*/
	var keyDownEvent = e.keyCode;	

	switch(keyDownEvent)
	{
		case 38: // up key press down
			$('#battle_ship').animate({top: "-=50"}, {queue: false});
			break;
		case 40: // down key press down
			$('#battle_ship').animate({top: "+=50"}, {queue: false});
			break;
		case 37: // left key press down
	        	$('#battle_ship').css('transform',  'rotate(' + angle + 'deg)');
			//clockwiseRotateTransform(x, y, angle);
			angle -= 30;
			break;
		case 39: // right key press down
			$('#battle_ship').css('transform',  'rotate(' + angle + 'deg)');
//			counterClockwiseRotateTransform(x, y, angle);
			angle += 30;
			break;
		case 83:
			alert('shot button');
			break;
		case 66:
			battleShipViewLayer(); // call function battle ship layer
			break;
		case 82:
			rankViewLayer(); 	  // call function rank layer
			break;
		case 80:
			planetViewLayer();	  // call function planet layer
			break;
		case 81:
			logout(userId);
			break;
		default:
			break;
	}
});

$(document).keyup(function(ev){ // Key press up event 
	
	var keyUpEvent = ev.keyCode;	
	
		switch(keyUpEvent)
		{
			case 38:
				$('#battle_ship').animate({queue: false});
				break;
			case 40: 
				$('#battle_ship').animate({queue: false});
				break;
			case 37:
				$('#battle_ship').animate({queue: false});
				break;
			case 39:
				$('#battle_ship').animate({queue: false});			
				break;
			case 83:
				alert('shot button');
				break;
			default:
				break;
		};
		
	});		
};

