/**
	**File name: audio_control.js
	**Writer: YONG-RYUL WON
	**File explanation : Cotrol background sound in main page 
*/
function mainAudioControl()
{
	var mainAudio = $(".main_audio");
/*	
	mainAudio.trigger('load');
	mainAudio.bind("load", function(){
		mainAudio.append();
	});		

	mainAudio.trigger("play");
	mainAudio.trigger("pause");
*/
		
}

function stopAudio(mainAudio)
{
	// Pause playing
	mainAudio.trigger("pause");
	// Set play time to 0
	mainAudio.prop("currentTime", 0);
}

function volumeUp(mainAudio)
{
	var volume = mainAudio.prop("volume") + 0.2;

	if(volume > 1)
	{
		volume = 1;
	}
	
	mainAudio.prop("volume", volume);
}

function volumeDown(mainAudio)
{
	var volume = mainAudio.prop("volume") - 0.2;

	if(volume < 0)
	{
		volume = 0;
	}
	
	mainAudio.prop("volume", volume);
}

function toggleMuteAudio(mainAudio)
{
	mainAudio.prop("muted",!mainAudio.prop("muted"));
}


