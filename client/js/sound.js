/**
	**File-name: sound.js
	**Writer: luxoss
	**File-explanation: THis file control the all sounds
*/

// Create sound object
var sound = function() {
	// Preload sound
	this.preload = function(url) {
		// TODO: Later...
	};

	// If sound is preloaded, return true
	this.isPreloaded = function() {
		// TODO: Later...
	};

	// Play this sound 
	// If turn on the loop, repeat infinit play sound until sound is paused 
	this.play = function(loop) {
		// TODO: Later...
	}; 

	// Pause this sound
	this.stop = function() {
		// TODO: Later...
	};
};

var initialize = function() {
	// TODO: Later...
	backgroundMusic = new sound();
	backgroundMusic.preload('http://203.237.179.21:8000/res/sound/Battle.mp3');
	waitForSound();
};


var waitForSound = function() {
	if(backgroundMusic.isPreloaded()) {
		// TODO: Later...
		backgroundMusic.play(true);
	} 
	else {
		setTimeout(arguments.callee, 100);
	}
};


