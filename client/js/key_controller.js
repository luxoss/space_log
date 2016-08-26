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

function keyHandler() {
	
	$(document).keydown(function(ev) {  
		isKeyDown[ev.keyCode] = true;
		shipMove();
		menuButton(ev);
	});

	$(document).keyup(function(ev) {
		isKeyDown[ev.keyCode] = false;
	});
}

var shipMove = function() {

	if(isKeyDown[37]) { // left
		posX("battle_ship", posX("battle_ship") - speed);
                $('#battle_ship').css('transform',  'rotate(-90deg)');  		
	}
	
	if(isKeyDown[39]) { // right
		posX("battle_ship", posX("battle_ship") + speed);
                $('#battle_ship').css('transform',  'rotate(90deg)');   
	
	}

	if(isKeyDown[38]) { // up
	        $('#battle_ship').css('transform',  'rotate(0deg)');
                posY("battle_ship", posY("battle_ship") - speed);
	
	}

	if(isKeyDown[40]) { // down
		$('#battle_ship').css('transform',  'rotate(180deg)');
                posY("battle_ship", posY("battle_ship") + speed);
	}
}
	
var menuButton = function(ev) {

	var KEY_SHOOT           = 1;
        var KEY_SPACE           = 2;
        var KEY_BATTLE_SHIP     = 3;
        var KEY_RANK            = 4;
        var KEY_PLANET          = 5;
        var KEY_LOGOUT          = 6;
	var KEY_NONE 		= null;

	var getKey = function(i) {

		switch(i)
		{
			case 32:
				return KEY_SPACE;
				break;
			case 66:
				return KEY_BATTLE_SHIP;
				break;
			case 80:
				return KEY_PLANET;
				break;
			case 81:
				return KEY_LOGOUT;
				break;
			case 82:
				return KEY_RANK;
				break;
			default:
				return KEY_NONE;
				break;
		}
	};

	var otherKeyState = getKey(ev.keyCode);

	switch(otherKeyState)
	{
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
};



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
	var dx = 0.0;
	var dy = 0.0;
	var angle = 0.0, _angle = 0;
	var launcharX = ship's x position;
	var launcharY = ship's y position;
 
	if(!isShoot) { return ; }

	if(angle < 0) {
		_angle = 100 + angle - 90;
		dy = Math.sin(_angle * Math.PI / 180);
		dx = -Math.cos(_angle * Math.PI / 180);
	}
	else {
		_angle = angle - 90;
		dy = -Math.sin(_angle * Math.PI / 180);
		dx = Math.cos(_angle * Math.PI / 180);
	}
	
	dx *= speed;
	dy *= speed;

	//translate css(bulletX += dx, bulletY -= dy);
	//rotate(angle * Math.PI / 180);

	if(bulletX && bulletY < 0) { isFire = false; }

	bulletX = launcherX;
	bulletY = launcherY;
	
	isFire = true;
};
*/
