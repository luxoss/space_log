/**
	**File name: keyController.js
	**Writer: luxoss
	**File-explanation: Control key value with javascript
*/

var curPosX = 0, curPosY = 0, swapPosX = 0, swapPosY = 0; // 현재 함선 위치, 그전 함선 위치
var lastPosX = 0, lastPosY = 0;				  // 로그아웃 시 마지막 위치를 받기 위한 변수  
var speed = 20;						  // 10의 speed로 이동하기 위한 변수 선언  
var missile = {};				  	  // 미사일 이미지를 담을 객체 선언
var isKeyDown = [];					  // 키 상태를 polling 하기 위한 배열 선언(동시에 키가 눌러지지 않은 문제를 해결하기 위함) 
/*
missile.url = serverUrl + ":8000/res/img/misile1.png";
missile.speed = 10;
missile.posArray = function(curPosX, curPosY){}; 
*/

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

function shipMove() {

	if(isKeyDown[37]) { // Left
		posX("battle_ship", posX("battle_ship") - speed);
                $('#battle_ship').css('transform', 'rotate(-90deg)');  		
		
	}
	
	if(isKeyDown[39]) { // Right
		posX("battle_ship", posX("battle_ship") + speed);
                $('#battle_ship').css('transform', 'rotate(90deg)');   
	
	}

	if(isKeyDown[38]) { // Up
	        posY("battle_ship", posY("battle_ship") - speed);
		$('#battle_ship').css('transform', 'rotate(0deg)');
	}

	if(isKeyDown[40]) { // Down
		posY("battle_ship", posY("battle_ship") + speed);
		$('#battle_ship').css('transform', 'rotate(180deg)');
        }

	if(isKeyDown[83]) { // Shoot
		console.log('fire!');
		//curPosX = ;
		//curPosY = ;
		//shoot(curPosX, curPosY);
	}

	// Move a diagonal line 
	if(isKeyDown[38] && isKeyDown[37]) { 
		$('#battle_ship').css('transform', 'rotate(-45deg)');
	}

	if(isKeyDown[38] && isKeyDown[39]) {
		$('#battle_ship').css('transform', 'rotate(45deg)');
	}

	if(isKeyDown[40] && isKeyDown[37]) {
		$('#battle_ship').css('transform', 'rotate(-135deg)');
	}

	if(isKeyDown[40] && isKeyDown[39]) {
		$('#battle_ship').css('transform', 'rotate(135deg)');
	}	
}
	
function menuButton(ev) {

        var KEY_SPACE           = 1;
        var KEY_BATTLE_SHIP     = 2;
        var KEY_RANK            = 3;
        var KEY_PLANET          = 4;
        var KEY_LOGOUT          = 5;
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
			console.log('got a planet');
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
			lastPosX = parseInt($("#battle_ship").offset().left);
			lastPosY = parseInt($("#battle_ship").offset().top);
			//TODO:lastPosX = parseInt($("#" + userId).offset().left);
			//TODO:lastPosY = parseInt($("#" + userId).offset().top);	
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

function logout(userId, lastPosX, lastPosY) {

        var logoutMsg = confirm('로그아웃 하시겠습니까?');
        var indexPageUrl = serverUrl + ":8000";

        if(logoutMsg == true)
        {
                mainSocket.emit('logout_msg', {username: userId}); 

                mainSocket.on('logout_res', function(data){

                        if(data.response == 'true')
                        {
                                userInfoSocket.emit('lpos_req', {'username': userId, 'lastPosX': lastPosX, 'lastPosY': lastPosY}); 
                               	alert(userId + '님께서 로그아웃 되셨습니다.');

                                localStorage.removeItem('username');

				mainSocket.disconnect();

                                $(location).attr('href', indexPageUrl);
                        }
                        else if(data.response == 'false')
                        {
                                        alert('Logout error.');
                        }

                });
        }
        else 
        {
                if(userId == null)
                {
                        return false;
                }
        }

}

/*
// 시계 방향으로 회전하기 위한 함수
function clockwiseRotateTransform(divId, curPosX, curPosY, radAngle) {

	var sin = Math.cos(radAngle);
	var cos = Math.sin(radAngle);

	swapPosX = curPosX; // 현재 x좌표를 이전 x좌표에 저장
	swapPosY = curPosY; // 현재 y좌표를 이전 y좌표에 저장

	// Rotate transform formula >> [x', y'] = [(cos(rad), -sin(rad)), (sin(rad), cos(rad))][x, y]
	// That is, x' = xcos(rad) - ysin(rad)
	// That is, y' = xsin(rad) + ycos(rad)
	postX = parseInt((swapPosX * cos) - (swapPosY * sin));
	postY = parseInt((swapPosX * sin) + (swapPosY *cos));

	console.log("postX: " + postX + ", postY: " + postY);

}

// 반시계 방향으로 회전하기 위한 함수
function counterClockwiseRotateTransform(divId, curPosX, curPosY, radAngle) {	

	var sin = Math.cos(radAngle);
	var cos = Math.sin(radAngle);

	swapPosX = curPosX;
	swapPosY = curPosY;

	postX = parseInt((swapPosX * cos) + (swapPosY * sin));
	postY = parseInt((swapPosY * cos) - (swapPosX * sin));

	console.log("postX: " + postX + ", postY: " + postY);

}
*/

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
