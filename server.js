const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
app.use(cors());

const LIVEKIT_URL = 'wss://biharfm-p24tdm9r.livekit.cloud';
const API_KEY = 'APIVRpgLuv98HmK';
const API_SECRET = 'PeQK52NbeeNf7eeEeMEabUPkrbZgp8VEm66Ab4Hcsrkd';

app.get('/get-token', async (req, res) => {
  try {
    const roomName = 'bihar-fm-room';
    const isHost = req.query.isHost === 'true';
    const participantName = isHost ? 'HostUser' : 'Listener_' + Math.floor(Math.random() * 1000);

    // Modern AccessToken Constructor
    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: participantName,
      name: participantName,
      ttl: '24h'
    });

    // Explicit Grant Object
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: isHost,
      canPublishData: isHost,
      canSubscribe: true
    });

    const token = await at.toJwt();
    res.json({ token, url: LIVEKIT_URL });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

