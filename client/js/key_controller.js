/**
	**File name: keyController.js
	**Writer: luxoss
	**File-explanation: Control key value with javascript
*/

var battleShip = $("#battle_ship").offset();	 	     		  // 현재 함선의 객체 offset(left, top)
var curX = 0, curY = 0, postX = 0, postY = 0, lastPosX = 0, lastPosY = 0; // 현재 함선 위치, 그전 함선 위치, 마지막 함선위치를 담을 변수 선언
var speed = 10;								  // 10의 speed로 이동하기 위한 변수 선언  
var radAngle =  parseInt(30 * (Math.PI / 180)); 	  		  // 30 라디안 각도를 주기 위한 변수 선언
var misile = {};				  		 	  // 미사일 이미지를 담을 객체 선언
var misileSpeed = 10;					  		  // 미사일 스피드(10)를 설정하기 위한 변수 선언 
var misilePosArray = []; 			 	 		  // 미사일의 x, y 좌표를 담을 배열 선언 
var isKeyDown = [];							  // 키 상태를 polling 하기 위한 배열 선언(동시에 키가 눌러지지 않은 문제를 해결하기 위함) 

var stateKeyboard = function() { // 키 상태에 관한 매서드 

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

	var getKey = function(i) {

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

	$(document).keydown(function(e) {  

		var keyState = getKey(e.keyCode);	
	
		switch(keyState)
		{
			case KEY_UP: 
				$('#battle_ship').css('transform',  'rotate(0deg)');
				posY("battle_ship", posY("battle_ship") - speed);
				isKeyDown[keyState] = true;
				break;

			case KEY_DOWN: 
				$('#battle_ship').css('transform',  'rotate(180deg)');
				posY("battle_ship", posY("battle_ship") + speed);
				isKeyDown[keyState] = true;
				break;

			case KEY_LEFT: 
				posX("battle_ship", posX("battle_ship") - speed);
				$('#battle_ship').css('transform',  'rotate(-90deg)');	
				isKeyDown[keyState] = true;
				break;

			case KEY_RIGHT:
				posX("battle_ship", posX("battle_ship") + speed);
				$('#battle_ship').css('transform',  'rotate(90deg)');	
				isKeyDown[keyState] = true;
				break;

			case KEY_SHOOT:
				console.log('Shot button');
				isKeyDown[keyState] = true;
				break;

			case KEY_SPACE:
				console.log('Space button');
				//shoot();
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

	$(document).keyup(function(e) { 

		var keyState = getKey(e.keyCode);	
	
		switch(keyState)
		{
			case KEY_UP: 
				isKeyDown[keyState] = false;
				break;

			case KEY_DOWN: 
				isKeyDown[keyState] = false;
				break;

			case KEY_LEFT: 
				isKeyDown[keyState] = false;
				break;

			case KEY_RIGHT:
				isKeyDown[keyState] = false;
				break;

			case KEY_SHOOT:
				console.log('Shot button');
				isKeyDown[keyState] = false;
				break;

			default:
				break;
		}
	
	});	
};

/*
function checkByKey(keyState) { // keyState is 'e.keyCode' ? true : false; 
	if()
	{
		$('#battle_ship').css('transform',  'rotate(0deg)');
		posY("battle_ship", posY("battle_ship") - speed);	
	}	
	else if()
	{
		$('#battle_ship').css('transform',  'rotate(180deg)');
		posY("battle_ship", posY("battle_ship") + speed);	
	}
	else if()
	{
		posX("battle_ship", posX("battle_ship") - speed);
		$('#battle_ship').css('transform',  'rotate(-90deg)');	
	}
	else if()
	{
		posX("battle_ship", posX("battle_ship") + speed);
		$('#battle_ship').css('transform',  'rotate(90deg)');	
	}
	else if()
	{
		// TODO: 미사일 발사 키를 눌렀을 시에 제어할 로직 
	}
	return ; // default 'undefined'
}
*/

// x좌표에 관한 셋팅을 위함(아무런 값이 들어오지 않을 시 현재 좌표 반환)  
var posX = function(divId, position) {

	if(position)
	{
		return parseInt($("#" + divId).css("left", position));
	}
	else	
	{
		return parseInt($("#" + divId).css("left"));
	}
};

var posY = function(divId, position) { 

	if(position)
	{
		return parseInt($("#" + divId).css("top", position));
	}
	else
	{
		return parseInt($("#" + divId).css("top"));
	}
};

// 시계 방향으로 회전하기 위한 함수
function clockwiseRotateTransform(divId, curX, curY, radAngle) {

	var sin = Math.cos(radAngle);
	var cos = Math.sin(radAngle);

	preX = curX; // 현재 x좌표를 이전 x좌표에 저장
	preY = curY; // 현재 y좌표를 이전 y좌표에 저장

	// Rotate transform formula >> [x', y'] = [(cos(rad), -sin(rad)), (sin(rad), cos(rad))][x, y]
	// That is, x' = xcos(rad) - ysin(rad)
	// That is, y' = xsin(rad) + ycos(rad)
	postX = parseInt((preX * cos) - (preY * sin));
	postY = parseInt((preX * sin) + (preY *cos));

	console.log("postX: " + postX + ", postY: " + postY);

}

// 반시계 방향으로 회전하기 위한 함수
function counterClockwiseRotateTransform(divId, curX, curY, radAngle) {	

	var sin = Math.cos(radAngle);
	var cos = Math.sin(radAngle);

	preX = curX;
	preY = curY;

	postX = parseInt((preX * cos) + (preY * sin));
	postY = parseInt((preY * cos) - (preX * sin));

	console.log("postX: " + postX + ", postY: " + postY);

}

/*
var shoot = function() {

};
	
// TODO: prototype chaining 형태로 다시 코드를 짜기 위함
// Create getPosition function	
function getPosition(divId, position, curX, curY, preX, preY, postX, postY, radAngle) {
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
getPosition.prototype.x = function() {
	
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
getPosition.prototype.clockwiseTransform = function() {

	this.postX = ((this.preX * Math.cos(this.radAngle)) + (this.preY * (-Math.sin(this.radAngle))));
	this.postY = ((this.preX * Math.sin(this.radAngle)) + (this.preY * (Math.cos(this.radAngle))));
		
	console.log("postX: " + postX + ", postY: " + postY);
};

// Create counter clockwise rotate  transform method with getPosition function's prototype
getPosition.prototype.counterClockwiseTransform = function() {

	this.postX = ((this.preX * Math.cos(this.radAngle)) + (this.preY * (Math.sin(this.radAngle))));
	this.postY = ((this.preX * Math.sin(this.radAngle)) + (this.preY * (Math.cos(this.radAngle))));

	onsole.log("postX: " + postX + ", postY: " + postY);
};	
*/		
	
