/**====================================================
   코드의 무덤에 오신 것을 환영합니다.
   당신은 이제부터 쓸모없는 코드 또는 
   기타 다시 쓰고 싶은 생각이 들려고 하나
   그 코드가 어디에 있는지 생각이 안날 것입니다.
   
   이러한 것은 문제가 되지 않습니다!

   이 코드 무덤에서 찾아볼 수 있으니까요. :)
=====================================================*/
/*
//아이템과 캐릭터 충돌처리 한재선 xml 게임 코드 일부
var imgWhite = document.getElementById("white");

imgWhite.src = "white.png";
context.drawImage(imgWhite, x1, y1);

//흰공 먹었을때 점수올리기
if (y1+25 >= chary && y1 <= (chary+112))
{
   if(x1+25>=charx && x1<=(charx+95))
   {
      score_cur += score_whiteBall;
      gauge += gauge_whiteBall;

      context.beginPath();
      context.font="bold 25pt Batang";
      context.strokeStyle="white";
      context.lineWidth=2;
      context.strokeText("SCORE: "+ score_cur, 20, 80);
      context.closePath();	

      y1 = 35;	
      x1 = Math.floor(Math.random()*770);
   }
}

function isCollision(otherObj, player) 
{
   return (otherObj.x < player.x + player.width) && (otherObj.x + otherObj.width > player.x) && 
          (otherObj.y < player.y + player.height) && (otherObj.y + otherObj.height > player.y);
}

function boxModel(x, y, width, height) 
{
   this.x = x;
   this.y = y;
   this.width = width;
   this.height = height;
}

var shoot = function() {
   var dx = 0.0;
   var dy = 0.0;
   var angle = 0.0, _angle = 0;
   var launcharX = ship's x position;
   var launcharY = ship's y position;
    
   if(!isShoot) { return ; }

   if(angle < 0) 
   {
       _angle = 100 + angle - 90;
       dy = Math.sin(_angle * Math.PI / 180);
       dx = -Math.cos(_angle * Math.PI / 180);
   }
   else 
   {
       _angle = angle - 90;
       dy = -Math.sin(_angle * Math.PI / 180);
       dx = Math.cos(_angle * Math.PI / 180);
   }

   dx *= speed;
   dy *= speed;
   
   translate css(bulletX += dx, bulletY -= dy);
   rotate(angle * Math.PI / 180);
   
   if(bulletX && bulletY < 0) { isFire = false; }
                                             
   bulletX = launcherX;
   bulletY = launcherY;
                                                      
   isFire = true;
};

// 키 입력 상태를 서버에 전송하기 위한 코드
$('body').on('keydown', function(ev){
      socket.userPos.emit('keydown', ev.keycode);
});
$('body').on('keyup', function(ev){
      socket.userPos.emit('keyup', ev.keycode);
});

// 마우스 위치 확인하기 위한 코드 
$(document).mousemove(function(e){
      console.log(e.pageX + ',' + e.pageY);
});

// 숫자 타입인지 아닌지 체크하기 위한 함수 
function isNumber(str) 
{
   str += '';             // 문자열 타입으로 변환 
   str = str.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거 
   
   if (str == '' || isNaN(str)) { return false };
   
   return true;
}

// Move a diagonal line 
if(isKeyDown[38] && isKeyDown[37]) 
{ 
   $("#" + divId1).css('transform', 'rotate(-45deg)');
}

if(isKeyDown[38] && isKeyDown[39]) 
{
   $("#" + divId1).css('transform', 'rotate(45deg)');
}

if(isKeyDown[40] && isKeyDown[37]) 
{
   $("#" + divId1).css('transform', 'rotate(-135deg)');
}

if(isKeyDown[40] && isKeyDown[39]) 
{
   $("#" + divId1).css('transform', 'rotate(135deg)');
}  

// get a current div offset
lastPosX = parseInt($("#" + user.name).offset().left);
lastPosY = parseInt($("#" + user.name).offset().top); 
                                                                                       
posX(divId1, posX(divId1) - speed); 
$("#" + user.name).css('transform', 'rotate(-90deg)');

posX(divId1, posX(divId1) + speed);
$("#" + user.name).css('transform', 'rotate(90deg)');   
                                                                                                                                                              
posY(divId1, posY(divId1) - speed);
$("#" + user.name).css('transform', 'rotate(0deg)');

posY(divId1, posY(divId1) + speed);
$("#" + user.name).css('transform', 'rotate(180deg)');


