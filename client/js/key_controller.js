/**
	**File name: keyController.js
	**Writer: luxoss
	**File-explanation: Control key value with javascript
*/
var battleShip = $("#battle_ship").offset();	// Current battleship obj offset(left, top)
var curX = 0, curY = 0;				// Current x, y position
var postX = 0, postY = 0;			// Post postion X, Y
var angle = 30; 				// Declare degree variable 
var radAngle =  angle * (Math.PI / 180); 	// Declare radian angle variable 
var tempAngle = 0; 				// Declare temporary angle variable
var misile = new Image();			// Declare misile image object
var misileSpeed = 10;				// Declare misile speed(10) variable
var misilePosArray = []; 			// Declare misile x, y position array
 
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
	
	curX = parseInt($("#battle_ship").offset().left); // posX("battle_ship", curY);
	curY = parseInt($("#battle_ship").offset().top);  // posY("battle_ship", curY); 

//	misile.src = ""; 				  // Misile image source url

	switch(keyDownEvent)
	{
		case 38: // up key press down
		//	$('#battle_ship').animate({top: "-=50"}, {queue: false});
			posY("battle_ship", posY("battle_ship") - 10);
			break;
		case 40: // down key press down
			posY("battle_ship", posY("battle_ship") + 10);
		//	$('#battle_ship').animate({top: "+=50"}, {queue: false});
			break;
		case 37: // left key press down
			posX("battle_ship", posX("battle_ship") - 10);
	        	//$('#battle_ship').css('transform',  'rotate(' + tempAngle + 'deg)');
			//tempAngle -= 30;
			//clockwiseRotateTransform(posX("battle_ship", curX), posY("battle_ship", curY), radAngle);
			break;
		case 39: // right key press down
			posX("battle_ship", posX("battle_ship") + 10);
			//$('#battle_ship').css('transform',  'rotate(' + tempAngle + 'deg)');
			//tempAngle += 30;
			//counterClockwiseRotateTransform(posX("battle_ship", curX), posY("battle_ship", curY), radAngle);
			break;
		case 83:
			alert('shot button');
			break;
		case 66:
			battleShipViewLayer(); 		 // call method battle ship layer
			break;
		case 82:
			rankViewLayer(); 	  	 // call method rank layer
			break;
		case 80:
			planetViewLayer();	 // call method planet layer
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
				//$('#battle_ship').animate({queue: false});
				break;
			case 40: 
				//$('#battle_ship').animate({queue: false});
				break;
			case 37:
				//$('#battle_ship').animate({queue: false});
				break;
			case 39:
				//$('#battle_ship').animate({queue: false});			
				break;
			case 83:  	// Shot key
				break;
			default:
				break;
		}
		
});	
			
// Set battle ship set position and return current y position 
var posX = function(divId, position){

	if(position)
	{
		return parseInt($("#" + divId).css("left", position));
	}
	else	
	{
		return parseInt($("#" + divId).css("left"));
	}
};

// Set battle ship set y position and return current y position 
var posY = function(divId, position){

	if(position)
	{
		return parseInt($("#" + divId).css("top", position));
	}
	else
	{
		return parseInt($("#" + divId).css("top"));
	}
};

		
// Create clockwise rotate transformation matrix function
function clockwiseRotateTransform(divId, curX, curY, radAngle)
{

	var sin = Math.cos(radAngle);
	var cos = Math.sin(radAngle);

	preX = posX("battle_ship", curX); // pre postion x, posX is 'current position X'
	preY = posY("battle_ship", curY); // pre postion y, posY is 'current postiion Y'

	postX = ((preX * cos) + (preY * (-sin)));
	postY = ((preX * sin) + (preY * (cos)));

	console.log("postX: " + postX + ", postY: " + postY);

	return [postX, postY];
}

// Create counter clockwise rotate tranformation matrix function
function counterClockwiseRotateTransform(divId, curX, curY, radAngle)
{	
	var sin = Math.cos(radAngle);
	var cos = Math.sin(radAngle);

	preX = posX("battle_ship", curX);
	preY = posY("battle_ship", curY);

	postX = ((preX * cos) + (preY * (sin)));
	postY = ((preX * sin) + (preY * (cos)));

	console.log("postX: " + postX + ", postY: " + postY);

	return [postX, postY];	
}

	
/*
function getPosition(divId, position)
{
	var coordinatePos = {

		divId : divId,
		position: position,
		
		posX = function(){

			if(this.position)
			{
				return parseInt($("#" + this.divId).css("left", this.position));
			}
			else
			{
				return parseInt($("#" + divId).css("left"));
			}
		},

		posY = function(){

			if(this.position)
			{
				return parseInt($("#" + this.divId).css("top", this.position));
			}
			else
			{
				return parseInt($("#" + this.divId).css("top"));
			}
		}
	};

	return coordinatePos;
}

function rotateTransMatrix(divId, curX, curY, ,preX, preY, postX, postY, radAngle) // Return below to obj
{
	var rotatePos = {

		divId : divId,
		curX : curX,
		curY : curY,
		radAngle : radAngle,
		preX : preX,
		preY : preY,
		postX : postX,
		postY : postY,

		clockwise : function() {        // Create clockwise method
	
			this.postX = ((this.preX * Math.cos(this.radAngle)) + (this.preY * (-Math.sin(this.radAngle)));
			this.postY = ((this.preX * Math.sin(this.radAngle)) + (this.preY * (Math.cos(this.radAngle))));
		
			console.log("postX: " + postX + ", postY: " + postY);
		},
	
		counterClockwise : function() { // Create counter clockwise method

			this.postX = ((this.preX * Math.cos(this.radAngle)) + (this.preY * (Math.sin(this.radAngle))));
			this.postY = ((this.preX * Math.sin(this.radAngle)) + (this.preY * (Math.cos(this.radAngle))));

			console.log("postX: " + postX + ", postY: " + postY);
		}
	};

	return rotatePos;
}
*/			
	
