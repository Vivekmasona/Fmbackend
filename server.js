const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
app.use(cors());

// LiveKit WebSockets URL & Credentials (Bilkul sahi match hone chahiye)
const LIVEKIT_URL = 'wss://biharfm-p24tdm9r.livekit.cloud';
const API_KEY = 'APIVRpgLuv98HmK';  // <-- LiveKit Dashboard wali nayi API Key
const API_SECRET = 'PeQK52NbeeNf7eeEeMEabUPkrbZgp8VEm66Ab4Hcsrkd'; // <-- LiveKit Dashboard wali nayi Secret Key

app.get('/get-token', async (req, res) => {
  try {
    const roomName = 'bihar-fm-room';
    const participantName = req.query.name || (req.query.isHost === 'true' ? 'HostUser' : 'Listener_' + Math.floor(Math.random() * 1000));
    const isHost = req.query.isHost === 'true';

    // AccessToken generating using official LiveKit SDK
    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: participantName,
      ttl: '1d' // Token validity set to 24 hours
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: isHost,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    res.json({ token, url: LIVEKIT_URL });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
