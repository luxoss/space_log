/**
	**File name: keyController.js
	**Writer: luxoss
	**File-explanation: Control key value with javascript
*/

var battleShip = $("#battle_ship").offset();	 	     		  // Current battleship obj offset(left, top)
var curX = 0, curY = 0, postX = 0, postY = 0, lastPosX = 0, lastPosY = 0; // Declare current(pre) position, next(post) position, last(if 'q' button || logout button click, send to the server) position
var speed = 10;								  // Declare variable that 10 speed 
var radAngle =  parseInt(30 * (Math.PI / 180)); 	  		  // Declare 30 radian angle variable  <radian formula> : degree * (pi / 180);
var misile = new Image();				  		  // Declare misile image object
var misileSpeed = 10;					  		  // Declare misile speed(10) variable
var misilePosArray = []; 			 	 		  // Declare misile x, y position array
var isKeyDown = [];							  // Declare array that key state

var stateKeyboard = function(){		  				  // Declare method that keyboard state 
	var KEY_NONE 		= 0;
	var KEY_LEFT 		= 1;
	var KEY_RIGHT 		= 2;
	var KEY_UP 		= 3;
	var KEY_DOWN 		= 4;
	var KEY_SHOOT 		= 5;
	var KEY_SPACE 		= 6;
	var KEY_BATTLE_SHIP 	= 7;
	var KEY_RANK 		= 8;
	var KEY_PLANET 		= 9;
	var KEY_LOGOUT 		= 10;

	var getKey = function(i){
		switch(i)
		{
		case 37:
			return KEY_LEFT;
			break;
		case 39:
			return KEY_RIGHT;
			break;
		case 38:
			return KEY_UP;
			break;
		case 40:
			return KEY_DOWN;
			break;
		case 83: 
			return KEY_SHOOT;
			break;
		case 32:
			return KEY_SPACE;
			break;
		case 66:
			return KEY_BATTLE_SHIP;
			break;
		case 82:
			return KEY_RANK;
			break;
		case 80:
			return KEY_PLANET;
			break;
		case 81:
			return KEY_LOGOUT;
			break;
		default:
			break;
		};
		
		return KEY_NONE;
	};

	$(document).keydown(function(e){  

		var keyState = getKey(e.keyCode);	
	
		switch(keyState)
		{
			case KEY_UP: 
				$('#battle_ship').css('transform',  'rotate(0deg)');
				posY("battle_ship", posY("battle_ship") - speed);
				break;

			case KEY_DOWN: 
				$('#battle_ship').css('transform',  'rotate(180deg)');
				posY("battle_ship", posY("battle_ship") + speed);
				break;

			case KEY_LEFT: 
				posX("battle_ship", posX("battle_ship") - speed);
				$('#battle_ship').css('transform',  'rotate(-90deg)');
				break;

			case KEY_RIGHT:
				posX("battle_ship", posX("battle_ship") + speed);
				$('#battle_ship').css('transform',  'rotate(90deg)');
				break;

			case KEY_SHOOT:
				console.log('Shot button');
				break;

			case KEY_SPACE:
				console.log('Space button');
				break;

			case KEY_BATTLE_SHIP:
				battleShipViewLayer(); 	  
				break;

			case KEY_RANK:
				rankViewLayer(); 	  
				break;

			case KEY_PLANET:
				planetViewLayer();	  
				break;

			case KEY_LOGOUT:
				lastPosX = postX;
				lastPosY = postY;
				logout(userId, lastPosX, lastPosY);
				break;

			default:
				break;
	
		}
	});
/*
	$(document).keyup(function(e){ 
		
		isKeyDown[e.keyCode] = false;
	});	
*/
};


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

/*
function keyControlState()
{
	if(){}
	else if(){}
	else if(){}
	else if(){}
	else{}
}
*/
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
	postX = parseInt((preX * cos) - (preY * sin));
	postY = parseInt((preX * sin) + (preY *cos));

	console.log("postX: " + postX + ", postY: " + postY);

}

// Create counter clockwise rotate tranformation matrix function
function counterClockwiseRotateTransform(divId, curX, curY, radAngle)
{	
	var sin = Math.cos(radAngle);
	var cos = Math.sin(radAngle);

	preX = curX;
	preY = curY;

	postX = parseInt((preX * cos) + (preY * sin));
	postY = parseInt((preY * cos) - (preX * sin));

	console.log("postX: " + postX + ", postY: " + postY);

}
	
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
	
