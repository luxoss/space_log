/**
	** File-name: index.js
	** File-explanation: Contorl index html page with javascript
	** Author: luxoss 
*/
$(document).ready(function() {

   var userInfoSocket = io.connect('http://game.smuc.ac.kr:5001');  
   var selectButton = new Audio();
  
   selectButton.src = "http://game.smuc.ac.kr:8000/res/sound/effect/menu_selection.wav";

   selectTeam();

   $(window).resize(function(){

      $('body').css({
         'width' : $(window).width(),
         'height': $(window).height()
      });
      
      $('#main_container').css({
	      left: ($(window).width() - $('#main_container').outerWidth()) / 2, 
	      top : ($(window).height() - $('#main_container').outerHeight()) / 2
      });
      
      $('#index_pop_up_view').css({
         left: ($(window).width() - $('#index_pop_up_view').outerWidth()) / 2,
         top : ($(window).height() - $('#index_pop_up_view').outerHeight()) / 2
      });

   }).resize();		

   $("#username").mouseover(function(event) {
      $("#username").css('border', '2px solid rgba(0, 255, 0, 0.7)');

      event.stopImmediatePropagation();
   });

   $("#username").mouseout(function(event) {
      $("#username").css('border', '2px solid rgba(255, 255, 255, 1)');

      event.stopImmediatePropagation();
   });

   $("#password").mouseover(function(event) {
      $("#password").css('border', '2px solid rgba(0, 255, 0, 0.7)');

      event.stopImmediatePropagation();
   });

   $("#password").mouseout(function(event) {
      $("#password").css('border', '2px solid rgba(255, 255, 255, 1)');

      event.stopImmediatePropagation();
   });

   $("#select_red_team").click(function(event){
      selectButton.play();
      $("#select_blue_team").css('background-color', 'transparent');
      $("#select_red_team").css('background-color', 'rgba(255, 0, 0, 0.3)');
      selectButton.currentTime = 0;

      event.stopImmediatePropagation();
   });

   $("#select_blue_team").click(function(event){
      selectButton.play();
      $("#select_red_team").css('background-color', 'transparent');
      $("#select_blue_team").css('background-color', 'rgba(0, 0, 255, 0.3)');
      selectButton.currentTime = 0;

      event.stopImmediatePropagation();
   });

   $("#join_submit").mouseover(function(event) {
      selectButton.play();
      $("#join_submit").css('background-color', 'rgba(255, 0, 0, 0.3)');
      selectButton.currentTime = 0;

      event.stopImmediatePropagation();
   });

   $("#join_submit").mouseout(function(event) {
      $("#join_submit").css('background-color', 'rgba(0, 0, 0, 0.3)');

      event.stopImmediatePropagation();
   });

   $("#join_cancel").mouseover(function(event) {
      selectButton.play();
      $("#join_cancel").css('background-color', 'rgba(0, 0, 255, 0.3)');
      selectButton.currentTime = 0;

      event.stopImmediatePropagation();
   });

   $("#join_cancel").mouseout(function(event) {
      $("#join_cancel").css('background-color', 'rgba(0, 0, 0, 0.3)');

      event.stopImmediatePropagation();
   });

   $("#login_btn").mouseover(function(event) {
      selectButton.play();
      $("#login_btn").css('background-color', 'rgba(0, 0, 255, 0.3)');
      selectButton.currentTime = 0;

      event.stopImmediatePropagation();
   });

   $("#login_btn").mouseout(function(event) {
      $("#login_btn").css('background-color', 'rgba(0, 0, 0, 0.3)');

      event.stopImmediatePropagation();
   });

   $("#join_btn").mouseover(function(event) {
      selectButton.play();
      $("#join_btn").css('background-color', 'rgba(255, 0, 0, 0.3)');
      selectButton.currentTime = 0;
      event.stopImmediatePropagation();
   });

   $("#join_btn").mouseout(function(event) {
      $("#join_btn").css('background-color', 'rgba(0, 0, 0, 0.3)');
      event.stopImmediatePropagation();
   });

   $("#join_btn").click(function(event){ //.on('click', function() {
      joinView(userInfoSocket);
      event.stopImmediatePropagation();      
   });

   $("#login_btn").click(function(event){ //.on('click', function(){ 
      var user = {};
      var mainPageUrl = './main.html';

      user.name = $.trim($('#username').val());
      user.password = $.trim($('#password').val());
 
      userInfoSocket.emit('login_msg', {
         username : user.name, 
         password : user.password,
      });

      userInfoSocket.on('login_res', function(data){         
         if(data.response == "true") 
         {
            popUpMsg("Loading...");
            getUserItems(userInfoSocket, user);		
            $(location).attr('href', mainPageUrl);
	      } 
         else 
         {
            popUpMsg("해당 아이디가 이미 있거나 틀립니다.");
         }
      });

      event.stopImmediatePropagation();
   });

   $("#sound_control").click(function(event){ //.on('click', function() {
      var bgSound = document.getElementById('bg_sound');

      if(bgSound.paused)
      {
         $("#sound_control").css('color', 'rgba(255, 255, 255, 0.7)');
         $("#sound_control").text("SOUND |  ON");
         bgSound.play();
      }
      else
      {
         $("#sound_control").css('color', 'rgba(207, 47, 77, 0.7)');
         $("#sound_control").text("SOUND | OFF");
         bgSound.pause();
         bgSound.currentTime = 0;
      }
      event.stopImmediatePropagation();
   });
   
   $(document).keydown(function(ev){

      var keyCode = ev.keyCode;
      var TAB = 9, ENTER = 13, SHIFT = 16, F5 = 116, CTRL = 17; 
      
      if(keyCode == ENTER) 
      {
         var user = {}; 		
         var mainPageUrl = './main.html';
        
		   user.name = $.trim($("#username").val());
	      user.password = $.trim($("#password").val());
	      
	      userInfoSocket.emit('login_msg', {
	         username : user['name'],
            password: user['password']
         });
         
         userInfoSocket.on('login_res', function(data){                       
            if(data.response == "true") 
            {
               popUpMsg("Loading...");

               getUserItems(userInfoSocket, user);
               $(location).attr('href', mainPageUrl);
	         }
            else 
            {
               popUpMsg("해당 아이디가 이미 있거나 비밀번호가 틀립니다.");
	            //window.location.reload();
	         }
	      });
      }	
      //if(keyCode == TAB) { return false; }
      //if(keyCode == BACK_SPACE) { return false; }
      if(keyCode == SHIFT) { return false; }
      //if(keyCode == F5) { return false; }
      //if(keyCode == CTRL) { return false; }
      ev.stopImmediatePropagation();
   });
   
   $("#login_btn").css('background-color', 'rgba(0, 0, 0, 0.3)');
   $("#join_btn").css('background-color', 'rgba(0, 0, 0, 0.3)');
});

function getUserItems(userInfoSocket, user) 
{
   if(!localStorage) 
   {
      popUpMsg("This brower isn't support localStorage.");
   }
   else 
   {	
      userInfoSocket.on('user_info', function(data) {
	      		
         if(data.username == user['name'])
         {
            user['name'] = data.username;
            user['score'] = data.score;
            user['mineral'] = data.mineral;
            user['gas'] = data.gas;
            user['unknown'] = data.unknown;
            user['x'] = data.location_x;
            user['y'] = data.location_y;
            user['ticket'] = data.ticket;

            localStorage.setItem('username', user['name']); 
            localStorage.setItem('score', user['score']);
            localStorage.setItem('mineral', user['mineral']);
            localStorage.setItem('gas', user['gas']);
            localStorage.setItem('unknown', user['unknown']);
            localStorage.setItem('x', user['x']);
            localStorage.setItem('y', user['y']);
            localStorage.setItem('ticket', user['ticket']);
         }
         else
         {
            console.log("[Client log] UserInfoSocket isn't available.");
         }
      });
   }
}

function joinView(userInfoSocket) 
{
   var state = $('#join_info').css('display');
   var joinSocket = userInfoSocket;
   var footer = $('#footer').html();

   if(state === 'none')
   { 
      $('#join_info').css({
         left: ($(window).width() - $('#join_info').outerWidth()) / 2, 
         top : Number($("#header").offset().top) + 150 
      });

      $("#select_red_team").css('background-color', 'rgba(255, 0, 0, 0.3)');

      $('#login_info').hide();
      $('#footer').hide();
      $('#join_info').show();
   }
   
   $('#join_submit').click(function(event){
      var user = {};

      user.name = $.trim($("#join_username").val());
      user.password = $.trim($("#join_password").val());
      user.email = $.trim($("#join_email").val());

      if((user.name == '' ) || (user.password == '') || (user.email == ''))
      {
         popUpMsg("빠진 것이 없는지 다시 한 번 확인해주세요. :)");
      }
      else 
      {
         joinSocket.emit('join_msg', {    
            username : user.name, 
            password : user.password,
            email    : user.email
         }); 

	      joinSocket.on('join_res', function(data){		
	         if(data.response == 'true') 
            {
               popUpMsg("회원가입이 완료 되었습니다. :)");
	         }
            else 
            {
               popUpMsg("해당 정보가 이미 있습니다. :("); 
	         }
	      });
      }
      event.stopImmediatePropagation();
   });

   $('#join_cancel').click(function(event){
      $('#join_info').hide();
      $("#select_blue_team").css('background-color', 'transparent');
      $('#login_info').show();
      $('#footer').show();

      event.stopImmediatePropagation();
   });
}

function selectTeam()
{
   var red = $("#select_red_team").text();
   var blue = $("#select_blue_team").text();

   console.log(red, blue);
}

function popUpMsg(msg)
{
   var state = $("#index_pop_up_view").css('display');

   if(state == 'none') 
   {
      $("#index_pop_up_view").show();
      $("#index_pop_up_msg").text(msg);
      $("#index_pop_up_view").fadeOut(1400);
   
      // Before code is ':text:not([id=username])' that cleared except id=username. 
      // But, it is wrong. so I changed this code lines
      $("#username").val('');
      $("#password").val(''); 
      $("#join_username").val('');
      $("#join_password").val('');
      $("#join_email").val('');
   }
}

/*
function validate(selector) 
{
   fail += validateUsername(selector.val());
   fail += validatePassword(selector.val());

   if(fail == '') { return false; }
   else 
   { 
      popUpMsg(fail); 
      return false;
   }
}

function validateUsername(field) 
{
   if(field == '') { return popUpMsg("유저명을 입력하시오."); }
   else if(field.length < 5)
   {
      return popUpMsg("유저 명은 5~12 길이로 작성 해주세요.");
   }
   else if(/[^a-zA-Z0-9_-]/.test(feild)
   {
      return popUpMsg("숫자 또는 영문자만을 지원합니다.");
   }

   return '';
}

function validatePassword(field) 
{
   if(field == '') { return popUpMsg("비밀번호를 입력하시오."); }
   else if(field.length < 6) 
   {
      return popUpMsg("비밀번호는6~12 길이로 작성 해주세요."); 
   }
   else if(!/[a-z]/.test(field) || !/[A-Z]/.test(field) || !/[0-9]/.test(field))
   {
      return popUpMsg("비밀번호는 숫자 또는 영문자의 조합을 필요로 합니다.");
   }
   
   return '';
}
   
      
(function(){ // 사운드 지원 포맷 검출.
   var audio = new Audio();
   var canPlayOggVorbis = audio.canPlayType('audio/ogg; codecs="vorbis"');
   var canPlayMP3 = audio.canPlayType('audio/mpeg; codecs="mp3"');

   if(canPlayOggVorbis == 'probably' || (canPlayOggVorbis == "maybe" && canPlayMP3 != "probably"))
   {
      sound.ext = ".ogg";
   }
   else { sound.ext = ".mp3"; }
})();

var sound = function() {
   
   this.preload = function(url) {
      this.audio = new Audio();
      this.audio.preload = "auto";
      this.audio.src = url + sound.txt;
      this.audio.load();
   };

   this.isPreloaded = function() {
      return (this.audio.readyState == 4)
   }
   
   this.play = function(loop) {
      if(this.audio.loop === undefined) {
         this.audio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
         }, false);
      }
      else {
         this.audio.loop = loop;
      }
      this.audio.play();
   };

   this.stop = function() {
      this.audio.pause();
      this.audio.currrentTime = 0;
   };
};
*/

	
