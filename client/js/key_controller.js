/**
	**File name: keyController.js
	**Writer: luxoss
	**File-explanation: Control key value with javascript
*/
var battleShip = $("#battle_ship").offset();	 	  // Current battleship obj offset(left, top)
var curX = 0, curY = 0;			 		  // Current x, y position
var postX = 0, postY = 0;				  // Post postion X, Y
var angle = 30; 					  // Declare degree variable 
var radAngle =  parseInt(angle * (Math.PI / 180)); 	  // Declare radian angle variable 
var tempAngle = 0; 					  // Declare temporary angle variable
var misile = new Image();				  // Declare misile image object
var misileSpeed = 10;					  // Declare misile speed(10) variable
var misilePosArray = []; 			 	  // Declare misile x, y position array
var clockwise = clockwiseRotateTransform(); 	 	  // Declare clockwise method
var counterClockwise = counterClockwiseRotateTransform(); // Declare counterclockwise method
	
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

	console.log(typeof clockwise);
	console.log(typeof counterClockwise);

	curX = posX("battle_ship");//parseInt($("#battle_ship").offset().left); 
	curY = posY("battle_ship");//parseInt($("#battle_ship").offset().top);   
	
//	misile.src = ""; 				  
	
	switch(keyDownEvent)
	{
		case 38: // up key press down
			posY("battle_ship", posY("battle_ship") - 10);
			break;
		case 40: // down key press down
			posY("battle_ship", posY("battle_ship") + 10);
			break;
		case 37: // left key press down
			posX("battle_ship", clockwise[0]);
			posY("battle_ship", clockwise[1]);
			//posX("battle_ship", posX("battle_ship") - 10);
	        	//$('#battle_ship').css('transform',  'rotate(' + tempAngle + 'deg)');
			//tempAngle -= 30;
			break;
		case 39: // right key press down
			posX("battle_ship", counterClockwise[0]);
			posY("battle_ship", counterClockwise[1]);
			//posX("battle_ship", posX("battle_ship") + 10);
			//$('#battle_ship').css('transform',  'rotate(' + tempAngle + 'deg)');
			//tempAngle += 30;
			break;
		case 83:
			alert('shot button');
			break;
		case 66:
			battleShipViewLayer(); 	  // call method battle ship layer
			break;
		case 82:
			rankViewLayer(); 	  // call method rank layer
			break;
		case 80:
			planetViewLayer();	  // call method planet layer
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
/*
// TODO: Change to code line :: <prototype> chaining
// Create getPosition function	
function getPosition(divId, position, curX, curY, preX, preY, postX, postY, radAngle)
{
	this.divId = divId;
	this.position = position;
	this.curX = curX;
	this.curY = curY;
	this.preX = preX;
	this.preY = preY;
	this.postX = postX;
	this.postY = postY;
	this.radAngle = radAngle;

	console.log(
		this.divId + ", " +  this.position + ", " + this.curX + ", " + this.curY   
		+ this.preX + ", " + this.preY + ", " + this.postX + ", " + this.postY + ", " 
		+ this.radAngle
	);   
}

// Create posX method with getPosition function's prototype
getPosition.prototype.x = function(){
	
	if(this.position)
	{
		return parseInt($("#" + this.divId).css("left", this.position));
	}
	else
	{
		return parseInt($("#" + this.divId).css("left"));
	}
};

// Create posY method with getPosition function's prototype
getPosition.prototype.y = function(){
		
	if(this.position)
	{
		return parseInt($("#" + this.divId).css("top", this.position));
	}
	else
	{
		return parseInt($("#" + this.divId).css("top"));
	}
};

// Create clockwise rotate transform method with getPosition function's prototype
getPosition.prototype.clockwiseTransform = function(){

	this.postX = ((this.preX * Math.cos(this.radAngle)) + (this.preY * (-Math.sin(this.radAngle))));
	this.postY = ((this.preX * Math.sin(this.radAngle)) + (this.preY * (Math.cos(this.radAngle))));
		
	console.log("postX: " + postX + ", postY: " + postY);
};

// Create counter clockwise rotate  transform method with getPosition function's prototype
getPosition.prototype.counterClockwiseTransform = function(){

	this.postX = ((this.preX * Math.cos(this.radAngle)) + (this.preY * (Math.sin(this.radAngle))));
	this.postY = ((this.preX * Math.sin(this.radAngle)) + (this.preY * (Math.cos(this.radAngle))));

	onsole.log("postX: " + postX + ", postY: " + postY);
};	
*/		
			
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

	preX = curX; // pre postion x, posX is 'current position X'
	preY = curY; // pre postion y, posY is 'current postiion Y'

	// Rotate transform formula >> [x', y'] = [(cos(rad), -sin(rad)), (sin(rad), cos(rad))][x, y]
	// That is, x' = xcos(rad) - ysin(rad)
	// That is, y' = xsin(rad) + ycos(rad)
	postX = (preX * cos) - (preY * sin);
	postY = (preX * sin) + (preY *cos);

	console.log("postX: " + postX + ", postY: " + postY);

	return [postX, postY];
}

// Create counter clockwise rotate tranformation matrix function
function counterClockwiseRotateTransform(divId, curX, curY, radAngle)
{	
	var sin = Math.cos(radAngle);
	var cos = Math.sin(radAngle);

	preX = curX;
	preY = curY;

	postX = (preX * cos) + (preY * sin);
	postY = (preY * cos) - (preX * sin);

	console.log("postX: " + postX + ", postY: " + postY);

	return [postX, postY];	
}


	
