var ciett = ciett || {};

ciett.aContext = null;
ciett.recorder = null;

ciett.hasGetUserMedia_ = function() {
   return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
};

/**
 * When a certain button is clicked on the page launch the audio access flow,
 * then start recording.
 */
ciett.onAudioIconClick = function() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  ciett.aContext = client.aContext || new AudioContext();
  if (ciett.hasGetUserMedia_()) {
    navigator.getUserMedia({audio: true}, function(stream) {
      console.log('Given audio capture access. Providing input to recorder.');
      ciett.recorder = ciett.recorder || new Recorder(ciett.aContext.createMediaStreamSource(stream));
      ciett.startRecording();
    }, function(err) {
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
  if (undefined !== ciet.recorder) {
    var xhr = new XMLHttpRequest();
    var form = new FormData();
    form.append('audio', blob,'audio.wav');
    request.open('POST','/process',true);
    request.send(form);
  }
};
