const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
app.use(cors());

const LIVEKIT_URL = 'wss://biharfm-p24tdm9r.livekit.cloud';
const API_KEY = 'APIVRpgLuv98HmK';
const API_SECRET = 'PeQK52NbeeNf7eeEeMEabUPkrbZgp8VEm66Ab4Hcsrkd';

app.get('/', (req, res) => {
  res.json({ message: "Bihar FM Backend Active" });
});

// HOST TOKEN (Full Permissions)
app.get('/get-host-token', async (req, res) => {
  try {
    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: 'HostStudio_' + Math.floor(Math.random() * 100),
      name: 'HostStudio',
      ttl: '24h'
    });

    // Explicit Grants Configuration
    at.addGrant({
      room: 'bihar-fm-room',
      roomJoin: true,
      roomCreate: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true
    });

    const token = await at.toJwt();
    res.json({ token, url: LIVEKIT_URL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LISTENER TOKEN (Read Only Permissions)
app.get('/get-listener-token', async (req, res) => {
  try {
    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: 'Listener_' + Math.floor(Math.random() * 1000),
      name: 'Listener',
      ttl: '24h'
    });

    at.addGrant({
      room: 'bihar-fm-room',
      roomJoin: true,
      canPublish: false,
      canPublishData: false,
      canSubscribe: true
    });

    const token = await at.toJwt();
    res.json({ token, url: LIVEKIT_URL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

