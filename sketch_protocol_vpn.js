let myVideo;
let otherVideo;
let noise;
let noiseAmp;
let osc;
let env;
let filter;
let mic;
let narrative;

let showFetchaddress = false;
let showMaskedroutes = false;
let showQuote1 = false;
let showQuote2 = false;

let fobVideo;
let edgeVideo;
let tunnelVideo;
let walkVideo;
let fobvideoPlaying = false;
let edgevideoPlaying = false;
let tunnelvideoPlaying = false;
let walkvideoPlaying = false;

let p5l;
let signalingServer = "wss://floating-fob.live:443/socket.io/"; // Client-side WebSocket URL


function setup() {
  createCanvas(windowWidth, windowHeight);

  
  let constraints = {audio: true, video: true};
  myVideo = createCapture(constraints, 
    function(stream) {
      // Modify this part to include STUN/TURN servers and signaling server
      let iceServers = [
        { urls: "stun:stun.l.google.com:19302" }, // Example STUN server
        { 
          urls: "turns:floating-fob.live:3478", // Replace with your TURN server details
          username: "TurnVPN", // Replace with your TURN server username
          credential: "TurnVPNCredential" // Replace with your TURN server credential
        }
      ];

      let config = {
        iceServers: iceServers,
        iceTransportPolicy: 'all', // or 'relay' if you want to restrict to TURN only
        iceCandidatePoolSize: 0 // Adjust based on your needs
      };
      
      let peerConnection = new RTCPeerConnection(config);
    
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
            // Send the candidate to the remote peer through your signaling server
            signalingServer.send({ type: 'candidate', candidate: event.candidate });
        }
      };
      
      // let signalingServer = "wss://152.42.216.84:3000/socket.io/"; // Replace with your signaling server URL

  // set socket.io client config 
         // Connect to the Socket.IO server
         const socket = io('https://floating-fob.live:443', {
          transports: ['websocket', 'polling']
          });
          
         // Handle connection
         socket.on('connect', () => {
             console.log('Connected to server');
         });
 
         // Handle custom events
         socket.on('signal', (data) => {
             console.log('Received signal:', data);
             // Handle the signal data here
         });
 
         // Example function to send a signal
         function sendSignal(peerId, signal) {
             socket.emit('signal', { peerId, signal });
         }
 
         // Example function to join a room
         function joinRoom(roomId, peerId) {
             socket.emit('join', roomId, peerId);
         }
 
         // Handle disconnection
         socket.on('disconnect', () => {
             console.log('Disconnected from server');
         });


      // Create p5LiveMedia instance with STUN/TURN servers and signaling server
      p5l = new p5LiveMedia(this, "CAPTURE", stream, "BLENDEDVIDEO", signalingServer, { iceServers: iceServers });
      p5l.on('stream', gotStream);
    }
  );  
  myVideo.elt.muted = true;     
  myVideo.hide();

  // Set up mic input for sound processing
  mic = new p5.AudioIn();
  mic.start();

  // filter = new p5.LowPass(); // Adjust filter type as needed (e.g., p5.HighPass, p5.BandPass)
  // Create a custom notch filter
  filter = new p5.Filter('bandstop');
  filter.disconnect(); // Disconnect from default output
  filter.setType('bandstop'); // Set filter type to bandstop
  
  // Parameters for the notch filter
  let centerFreq = 1000; // Adjust as needed
  let qFactor = 50; // Adjust as needed
  
  // Setup the notch filter
  filter.set(centerFreq, qFactor);
  
  
  mic.connect(filter); // Connect microphone input to the filter

  noise = new p5.Noise('brown'); // Create white noise generator
  noise.start(); // Start the noise generator
  noise.amp(0); // Set initial amplitude to 0

  osc = new p5.Oscillator('triangle'); // Create a sine wave oscillator
  osc.start(); // Start the oscillator
  osc.amp(0); // Set initial amplitude to 0

  env = new p5.Envelope(); // Create an envelope for controlling the amplitude
  env.setADSR(0.01, 0.05, 0.1, 0.05); // Set attack, decay, sustain, release for faster oscillation

  let narrative = new p5.Speech();
  narrative.setVolume(1.0);

  // Text to speech narratives
  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("hello.");
  }, 5000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("please, seek, for another, address to join the virtual private network.");
  }, 10000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("please wait for another address to join you in the virtual private network.");
  }, 18000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("please look into the camera.");
  }, 28000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("what do you see?");
  }, 35000);

  // setTimeout(() => {
  //   narrative.setVoice('Vicki');
  //   narrative.speak("what can you hear?");
  // }, 40000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("please move closer to the camera.");
  }, 49000);

    // Set showFetchaddress between certain durations
    setTimeout(() => { showFetchaddress = true; }, 50000);
    setTimeout(() => { showFetchaddress = false; }, 52000);
    setTimeout(() => { showFetchaddress = true; }, 53000);
    setTimeout(() => { showFetchaddress = false; }, 55000);
    setTimeout(() => { showFetchaddress = true; }, 56000);
    setTimeout(() => { showFetchaddress = false; }, 61000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("your IP address now is: 10.8.0.1");
  }, 60000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("where, are you from?");
  }, 70000);

    // Load the video 'fob' 
    setTimeout(() => {
      fobVideo = createVideo(['fob.mp4'], fobvideoLoaded);
      fobVideo.hide();
      fobVideo.onended(() => {
        fobVideo.hide();
        fobvideoPlaying = false;
      });
      }, 61000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("what, are, your, tactics?");
  }, 82000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("now, you two, shall, greet, each other.");
  }, 97000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("wave, at each, other");
  }, 101000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("shake hands");
  }, 104000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("listen, to the edge, in-between, you.");
  }, 108000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("go in for a hug");
  }, 113000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("share a touch");
  }, 116000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("touch the camera");
  }, 121000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("can you see each other now?");
  }, 130000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("take a deeper look at each other");
  }, 140000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("move closer to the camera,");
  }, 150000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("or move farther away from the screen.");
  }, 154000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("you are now routed through each other.");
  }, 160000);

    // Load video 'edge' 
    setTimeout(() => {
      edgeVideo = createVideo(['edge.mp4'], edgevideoLoaded);
      edgeVideo.hide();
      edgeVideo.onended(() => {
        edgeVideo.hide();
        edgevideoPlaying = false;
      });
      }, 161000);

    setTimeout(() => {
      edgeVideo.stop();
      edgeVideo.hide();
      edgevideoPlaying = false;
    }, 181000);

    // Set showFetchaddress between certain durations
    setTimeout(() => { showFetchaddress = true; }, 170000);
    setTimeout(() => { showFetchaddress = false; }, 172000);
    setTimeout(() => { showFetchaddress = true; }, 173000);
    setTimeout(() => { showFetchaddress = false; }, 175000);
    setTimeout(() => { showFetchaddress = true; }, 176000);
    setTimeout(() => { showFetchaddress = false; }, 181000);
  
  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("your, address now is: ***. **. **. **.");
  }, 181000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("where would you go now?");
  }, 191000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("you will only see better if you hide yourself… ");
  }, 198000);

    // Load video 'edge' 
    setTimeout(() => {
      edgeVideo = createVideo(['edge.mp4'], edgevideoLoaded);
      edgeVideo.hide();
      edgeVideo.onended(() => {
        edgeVideo.hide();
        edgevideoPlaying = false;
      });
    }, 198000);

    setTimeout(() => {
      edgeVideo.stop();
      edgeVideo.hide();
      edgevideoPlaying = false;
    }, 225000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("block your camera");
  }, 204000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("block your camera");
  }, 208000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("reroute yourself. displace yourself.");
  }, 215000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("shhh that’s our secret…");
  }, 225000);

    // Load video 'walk' 
    setTimeout(() => {
      walkVideo = createVideo(['walk.mp4'], walkvideoLoaded);
      walkVideo.hide();
      walkVideo.onended(() => {
        walkVideo.hide();
        walkvideoPlaying = false;
      });
    }, 225000);

    setTimeout(() => {
        walkVideo.stop();
        walkVideo.hide();
        walkvideoPlaying = false;
    }, 265000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("you only see, more, if you are masked.");
  }, 238000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("you only see, more, when you pretend to be, another identity.");
  }, 258000);

    // Set showMaskedroutes between certain durations
    setTimeout(() => { showMaskedroutes = true; }, 245000);
    setTimeout(() => { showMaskedroutes = false; }, 265000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("now, your, encrypted, addresses are, 0. x. *.*.*.*.*.*.");
  }, 265000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("where would you like to, float, to now? ");
  }, 277000);

    // Load video 'walk' 
    setTimeout(() => {
      walkVideo = createVideo(['walk.mp4'], walkvideoLoaded);
      walkVideo.hide();
      walkVideo.onended(() => {
        walkVideo.hide();
        walkvideoPlaying = false;
      });
      }, 276000);

    setTimeout(() => {
      walkVideo.stop();
      walkVideo.hide();
      walkvideoPlaying = false;
    }, 315000);


  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("it’s only temporary for, when, you see you, you see through you; you hear you");
  }, 283000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("for tricksters, for witches, for not existing but moving forward.");
  }, 291000);

  // Set showMaskedroutes between certain durations 
  setTimeout(() => { showQuote1 = true; }, 315000);
  setTimeout(() => { showQuote1 = false; }, 340000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("do you declare love for each other?");
  }, 299000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("do you declare love for each other?");
  }, 305000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("or have you, gripped for the war?");
  }, 315000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("you have been, protest-ing, haven’t you?  ");
  }, 320000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("walking, on edges");
  }, 325000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("being with the edges");
  }, 330000);

    // Load video 'edge' 
    setTimeout(() => {
      edgeVideo = createVideo(['edge.mp4'], edgevideoLoaded);
      edgeVideo.hide();
      edgeVideo.onended(() => {
        edgeVideo.hide();
        edgevideoPlaying = false;
      });
    }, 330000);

    setTimeout(() => {
      edgeVideo.stop();
      edgeVideo.hide();
      edgevideoPlaying = false;
    }, 356000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("my pixels are viruses..");
  }, 340000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("i want to crawl, over your screen, lurking, damping, all across… multiplying");
  }, 350000);

    // Load video 'walk' 
    setTimeout(() => {
      walkVideo = createVideo(['walk.mp4'], walkvideoLoaded);
      walkVideo.hide();
      walkVideo.onended(() => {
        walkVideo.hide();
        walkvideoPlaying = false;
      });
    }, 355000);

    setTimeout(() => {
        walkVideo.stop();
        walkVideo.hide();
        walkvideoPlaying = false;
    }, 367000);

    // Load video 'edge' 
    setTimeout(() => {
      edgeVideo = createVideo(['edge.mp4'], edgevideoLoaded);
      edgeVideo.hide();
      edgeVideo.onended(() => {
        edgeVideo.hide();
        edgevideoPlaying = false;
      });
    }, 356000);

    setTimeout(() => {
      edgeVideo.stop();
      edgeVideo.hide();
      edgevideoPlaying = false;
    }, 367000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("crawl, lurk, under your screen, damp... multiply,");
  }, 362000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("do you, love, each other, now?");
  }, 370000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("i am the virus.. blinking, at you.");
  }, 375000);

    // // Load video 'edge' 
    // setTimeout(() => {
    //   edgeVideo = createVideo(['edge.mp4'], edgevideoLoaded);
    //   edgeVideo.hide();
    //   edgeVideo.onended(() => {
    //     edgeVideo.hide();
    //     edgevideoPlaying = false;
    //   });
    // }, 375000);

    // setTimeout(() => {
    //   edgeVideo.stop();
    //   edgeVideo.hide();
    //   edgevideoPlaying = false;
    // }, 420000);

      // Load video 'tunnel' 
      setTimeout(() => {
        tunnelVideo = createVideo(['tunnel.mp4'], tunnelvideoLoaded);
        tunnelVideo.hide();
        tunnelVideo.onended(() => {
          tunnelVideo.hide();
          tunnelvideoPlaying = false;
        });
      }, 362000);
  
      setTimeout(() => {
        tunnelVideo.stop();
        tunnelVideo.hide();
        tunnelvideoPlaying = false;
      }, 420000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("do you love me?");
  }, 385000);

  // Set showMaskedroutes between certain durations 
  setTimeout(() => { showQuote2 = true; }, 385000);
  setTimeout(() => { showQuote2 = false; }, 400000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("now, where shall we float to?");
  }, 400000);

    // Load the video 'fob' 
    setTimeout(() => {
      fobVideo = createVideo(['fob.mp4'], fobvideoLoaded);
      fobVideo.hide();
      fobVideo.onended(() => {
        fobVideo.hide();
        fobvideoPlaying = false;
      });
      }, 410000);

    // setTimeout(() => {
    //   fobVideo.stop();
    //   fobVideo.hide();
    //   fobvideoPlaying = false;
    // }, 400000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("without, me telling you, or you telling me, what the destination is?");
  }, 405000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("do you love, me?");
  }, 420000);

  setTimeout(() => {
    narrative.setVoice('Vicki');
    narrative.speak("where shall we float, to, now?");
  }, 440000);


}

function fobvideoLoaded() {
  fobVideo.play();
  // fobVideo.show();
  fobvideoPlaying = true;
}

function edgevideoLoaded() {
  edgeVideo.play();
  edgevideoPlaying = true;
}

function walkvideoLoaded() {
  walkVideo.play();
  edgeVideo.loop();
  walkvideoPlaying = true;
}

function tunnelvideoLoaded() {
  tunnelVideo.play();
  edgeVideo.loop();
  tunnelvideoPlaying = true;
}


function draw() {
  background(220);
  stroke(255);
  image(myVideo,0,0,windowWidth,windowHeight);
  if (otherVideo) {
    blend(otherVideo, 0, 0, otherVideo.width, otherVideo.height, 0, 0, width, height, MULTIPLY);
  }

  if (edgevideoPlaying) {
    // Calculate the position to center the video
    let edgeVideoWidth = edgeVideo.width;
    let edgeVideoHeight = edgeVideo.height;
    let x = (windowWidth - edgeVideoWidth) / 2;
    let y = (windowHeight - edgeVideoHeight) / 2;

    tint(255, 255); // Set opacity to 50%
    blend(edgeVideo, 0, 0, edgeVideoWidth, edgeVideoHeight, 0, 0, width, height, MULTIPLY);
    noTint(); // Reset tint after use
  }

  if (walkvideoPlaying) {
    // Calculate the position to center the video
    let walkVideoWidth = walkVideo.width;
    let walkVideoHeight = walkVideo.height;
    let x = (windowWidth - walkVideoWidth) / 2;
    let y = (windowHeight - walkVideoHeight) / 2;

    tint(255, 255); // Set opacity to 50%
    blend(walkVideo, 0, 0, walkVideoWidth, walkVideoHeight, 0, 0, width, height, MULTIPLY);
    noTint(); // Reset tint after use
  }

  if (tunnelvideoPlaying) {
    // Calculate the position to center the video
    let tunnelVideoWidth = tunnelVideo.width;
    let tunnelVideoHeight = tunnelVideo.height;
    let x = (windowWidth - tunnelVideoWidth) / 2;
    let y = (windowHeight - tunnelVideoHeight) / 2;

    tint(255, 255); // Set opacity to 50%
    blend(tunnelVideo, 0, 0, tunnelVideoWidth, tunnelVideoHeight, 0, 0, width, height, MULTIPLY);
    noTint(); // Reset tint after use
  }


  // Apply sound processing based on mic input
  let micLevel = mic.getLevel();
  let modFreq = map(micLevel, 0, 1, 0, 10); // Map mic input level to modulation frequency
  osc.freq(modFreq); // Set oscillator frequency based on mic input

  let modDepth = map(micLevel, 0, 0.5, 0, 0.1); // Map mic input level to modulation depth
  noiseAmp = map(micLevel, 0, 0.5, 0, 0.1); // Map mic input level to noise amplitude
  noise.amp(noiseAmp); // Adjust noise amplitude based on mic input

  // Trigger the envelope based on mic input to create sound effect
  env.play(osc, 0, 0.05, modDepth * 2); // Trigger the envelope with a short duration

  
  // Do the threshold 1 time in setup
  loadPixels();
  let totalBrightness = 0;
  let numPixels = pixels.length / 4;

  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i+1];
    let b = pixels[i+2];
    let brightness = (r + g + b) / 3;
    totalBrightness += brightness;

    if (r+b+g > 50) {
      pixels[i] = 255;
      pixels[i+1] = 255;
      pixels[i+2] = 255;
    } else {
      pixels[i] = 255 - pixels[i];     // Invert Red
      pixels[i + 1] = 255 - pixels[i + 1]; // Invert Green
      pixels[i + 2] = 255 - pixels[i + 2]; // Invert Blue
    }
  }
  updatePixels();

  if (fobvideoPlaying) {
    // Calculate the position to center the video
    let fobVideoWidth = fobVideo.width;
    let fobVideoHeight = fobVideo.height;
    let x = (windowWidth - fobVideoWidth) / 2;
    let y = (windowHeight - fobVideoHeight) / 2;

    tint(1, 1); // Set opacity to 50%
    blend(fobVideo, 0, 0, width, height, x, y, width, height, MULTIPLY);
    noTint(); // Reset tint after use
  }




  // Calculate average brightness
  let avgBrightness = totalBrightness / numPixels;

  // Map average brightness to noise amplitude
  noiseAmp = map(avgBrightness, 0, 255, 0, 0.5);
  noise.amp(noiseAmp);


  // Map average brightness to oscillator frequency and amplitude
  let freq = map(avgBrightness, 0, 255, 50, 200); // Low frequency range
  let amp = map(avgBrightness, 0, 255, 1, 0); // Invert the amplitude to make dark pixels louder

  osc.freq(freq);

  // Trigger the envelope to create glitchy sound effect
  if (frameCount % 3 == 0) { // Create a glitchy effect by triggering the envelope periodically
    env.play(osc, 0, 0.05, amp * 1); // Trigger the envelope with a short duration
  }

  if (showFetchaddress) {
  fill(0, 0, 255, 60); 
  textSize(20);
  // textAlign(CENTER, CENTER);
  text('fetching node addresses...', width / 2 - 100, height / 2, 500);
  }

  if (showMaskedroutes) {
  fill(0, 0, 255, 60); 
  textSize(20);
  // textAlign(CENTER, CENTER);
  text('tracing masked routes and edges...', width / 2 - 100, height / 2, 500);
  }

  if (showQuote1) {
    fill(0, 0, 255, 60); 
    textSize(20);
    // textAlign(CENTER, CENTER);
    text('He said,\n\n"Interactions over networks will be untraceable, via extensive re-routing of encrypted packets and tamper-proof boxes which implement cryptographic protocols with nearly perfect assurance against any tampering... \n\n Arise, you have nothing to lose but your barbed wire fences!" \n\n (Timothy C. May)', width / 2 - 480, height / 2, 1050);
    }

  if (showQuote2) {
    fill(0, 0, 255, 60); 
    textSize(20);
    textAlign(CENTER, CENTER);
    text('She said,\n\n "All that you touch\n You Change.\n\n All that you Change\nChanges you.\n\n The only lasting truth\n Is change.\n\n God\nIs Change.\n\nEARTHSEED: THE BOOKS OF THE LIVING\n by Lauren Oya Olamina" ', width / 2 - 500, height / 2 - 250, 1050);
    }
 
}

// function notifyUser() {
//   narrative.setVoice('Vicki');
//   narrative.speak("Another user has joined.");
// }


// We got a new stream!
function gotStream(stream, id) {
  // This is just like a video/stream from createCapture(VIDEO)
  otherVideo = stream;
  //otherVideo.id and id are the same and unique identifiers
  otherVideo.hide();
  // notifyUser(); // Notify the user when otherVideo is streamed
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function mousePressed() {
  userStartAudio();
}

