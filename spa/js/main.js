var ciett = ciett || {};

var getUserMedia = navigator.mediaDevices ?
    navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) :
    function (c) {
        return new Promise(function (f, r) {
            navigator.getUserMedia(c, f, r);
        });
    };

ciett.aContext = null;
ciett.recorder = null;
navigator.getUserMedia = navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

ciett.hasGetUserMedia_ = function() {
    ciett.userMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia || navigator.msGetUserMedia);
    return ciett.userMedia_ !== undefined;
};

/**
 * When a certain button is clicked on the page launch the audio access flow,
 * then start recording.
 */
ciett.onAudioIconClick = function() {
    if (ciett.hasGetUserMedia_()) {
	getUserMedia({audio: true})
	    .then(function(stream) {
		ciett.aContext = ciett.aContext || new AudioContext();
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		console.log('Given audio capture access. Providing input to recorder.');
		ciett.recorder = ciett.recorder || new Recorder(ciett.convertToMono(ciett.aContext.createMediaStreamSource(stream)));
		ciett.startRecording();
	    })
	    .catch(function(err) {
		console.error('Was not able to create audio stream.' + err);
	    });
    }
};

/**
 * Starts the recording.
 */
ciett.startRecording = function() {
    if (undefined !== ciett.recorder) {
	ciett.recorder.record();
	console.log('Recording...');
    }
};

/**
 * Stops the recording and then sends it for recording.
 */
ciett.stopRecording = function() {
    if (undefined !== ciett.recorder) {
	ciett.recorder.stop();
	console.log('Stopped Recording...');
	
	ciett.recorder.exportWAV(ciett.sendAudio);
    }
};

/*
 * Sends the data using a XHR to the Server for processing and suggestion 
 * creation.
 *@param{!Blob} blob - Holds the wav data. 
 */
ciett.sendAudio = function(blob){
    if (undefined !== ciett.recorder) {
	var xhr = new XMLHttpRequest();
	var form = new FormData();
	form.append('audio', blob);
	xhr.open('POST', '/process', true);
	xhr.send(form);
    ciett.recorder.clear();
    }
};

ciett.convertToMono = function(input) {
  var splitter = ciett.aContext.createChannelSplitter(2);
  var merger = ciett.aContext.createChannelMerger(2);

  input.connect(splitter);
  splitter.connect(merger, 0, 0);
  splitter.connect(merger, 0, 1);

  return merger;
}

