var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext("2d");


// Code to recieve Audio
navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
// monkeypatch Web Audio
window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
// grab an audio context
var audioContext = new AudioContext();
var meter = null;

// -- definations
var mh = ((canvas.height) / 2) - 100;
var MAXWIDTH = canvas.width;
var MAXHEIGHT = canvas.height;
var FREQ = 100;
var SPLITTER = 20;
var AMP = 60;
var DIST = -50;

// constant funcitons
function clear() {
	ctx.clearRect(0,0,MAXWIDTH, MAXHEIGHT);
}

// --- test
var startAngle = Math.PI/2;
var currentX = -Math.PI/2;
var t; 
var dir = -1;

var x = 0;

function draw() {
    if (meter && meter.volume > .01)
        AMP = 200*(meter.volume);
    else AMP = 10;

    if (SPLITTER < 40)
        SPLITTER++;
    
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.fillRect(0,0,MAXWIDTH,MAXHEIGHT);
	ctx.stroke();
    
    // draw the center line opacity  = 1
    
    ctx.beginPath();
	ctx.strokeStyle = "rgba(0,0,255,.1)";
	ctx.moveTo(0, mh);
    ctx.lineTo(MAXWIDTH, mh);
	ctx.stroke();
    
    
    
    // Draw the Sine Curve
	for (var i = AMP ; i > 0; i-=10) {

		ctx.beginPath();
		ctx.strokeStyle = "rgba(0,255,0," +(i/100+.2)%1 +")";
		ctx.moveTo(0,mh);
		var x = 0;
        
        ctx.moveTo(x, mh -(i*Math.sin(((currentX + x/SPLITTER)%360)/Math.PI)));
		while ( x < MAXWIDTH) {
			ctx.lineTo(x, mh -(i*Math.sin(((currentX + x/SPLITTER)%360)/Math.PI)));
			x++;
		}
		ctx.stroke();
	}
	
	currentX = (currentX-1 < 0)?(currentX-1):MAXWIDTH+90;
	t = setTimeout(function(){draw();}, FREQ);
}

function stop(){
    clearTimeout(t);
}
draw();


if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: true, video: false}, // Success callback
  function(stream) {
    source = audioContext.createMediaStreamSource(stream);
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
	meter = createAudioMeter(audioContext);
	mediaStreamSource.connect(meter);
    //visualize(stream);
  },

  // Error callback
  function(err) {
    console.log('The following gUM error occured: ' + err);
  });
}