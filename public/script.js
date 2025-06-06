const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

const startCallBtn = document.getElementById('startCallBtn');
const endCallBtn = document.getElementById('endCallBtn');
const muteBtn = document.getElementById('muteBtn');

const socket = io();

let localStream;
let peerConnection;
const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

let isMuted = false;

startCallBtn.onclick = async () => {
    startCallBtn.disabled = true;

    try {
        // Get local media
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        // Create peer connection
        peerConnection = new RTCPeerConnection(config);

        // Add tracks to peer connection
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        // When remote stream arrives, show it
        peerConnection.ontrack = event => {
            // event.streams is an array of MediaStreams
            remoteVideo.srcObject = event.streams[0];
        };

        // Send ICE candidates to remote peer
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate);
            }
        };

        // Create and send offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer);

        endCallBtn.disabled = false;
        muteBtn.disabled = false;

    } catch (err) {
        console.error('Error starting call:', err);
        startCallBtn.disabled = false;
    }
};

endCallBtn.onclick = () => {
    if(peerConnection){
        peerConnection.close();
        peerConnection = null;
    }
    if(localStream){
        localStream.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null;
    }
    remoteVideo.srcObject = null;

    startCallBtn.disabled = false;
    endCallBtn.disabled = true;
    muteBtn.disabled = true;
    isMuted = false;
    muteBtn.textContent = "Mute";

    console.log('Call ended.');
};

muteBtn.onclick = () => {
    if (!localStream) return;

    isMuted = !isMuted;
    localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
    muteBtn.textContent = isMuted ? "Unmute" : "Mute";
};

// Socket.io signaling handlers:

socket.on('offer', async (offer) => {
    if(!peerConnection){
        peerConnection = new RTCPeerConnection(config);

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = event => {
            remoteVideo.srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = event => {
            if(event.candidate){
                socket.emit('ice-candidate', event.candidate);
            }
        };
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
});

socket.on('answer', async (answer) => {
    if(peerConnection){
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
});

socket.on('ice-candidate', async (candidate) => {
    if(peerConnection){
        try{
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }catch(e){
            console.error('Error adding received ice candidate', e);
        }
    }
});
