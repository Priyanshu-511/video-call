# video-call

A simple video calling application using WebRTC for peer-to-peer media streaming, Socket.io for signaling, and Node.js with Express as the server.

---

## Features

- Real-time video and audio communication between two peers  
- Start/End call controls  
- Mute/Unmute microphone  
- Simple signaling server using Socket.io  
- Responsive UI with video display and control buttons

---

## Project Structure

/project-root
│
├── /public
│ ├── index.html
│ ├── style.css
│ └── script.js
│
├── server.js
├── package.json
└── README.md

---

## Setup and Run

1. **Clone the repo**

```bash
git clone <repo-url>
cd <repo-folder>
```
2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
node server.js
```
4. Open in browser

Go to http://localhost:3000

## Usage
Click Start Call to start your local video and initiate a connection.

If another user is connected, the call will establish and remote video will appear.

Use Mute button to mute/unmute your microphone.

Use End Call to end the call and stop the media streams.

## Dependencies
Express

Socket.io

WebRTC APIs (built into modern browsers)

## Notes
This app supports only two peers for the video call.

For production use, consider adding authentication, room management, and HTTPS support.

You need to access the app from two different browser windows or devices on the same network to test the call.
