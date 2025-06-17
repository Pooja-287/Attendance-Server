// // agent.js (run using: node agent.js)
// const express = require('express');
// const cors = require('cors');
// const { getConnectedWifiMac, getLocalDeviceMac } = require('./utils/macUtils');
// const axios = require('axios');

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post('/trigger-checkin', async (req, res) => {
//   try {
//     const wifiMac = getConnectedWifiMac();
//     const deviceMac = getLocalDeviceMac();
//     const token = req.body.token;

//     console.log("👉 wifiMac:", wifiMac);
//     console.log("👉 deviceMac:", deviceMac);
//     console.log("👉 token:", token);

//     const response = await axios.post('http://localhost:5000/api/attendance/checkin', {
//       wifiMac,
//       deviceMac
//     }, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     res.json(response.data);
//   } catch (err) {
//     console.error("❌ Agent Failed:", err.message);
//     if (err.response) {
//       console.error("👉 Backend Error:", err.response.status, err.response.data);
//     }
//     res.status(500).json({ message: err.response?.data?.message || "Agent Error" });
//   }





// agent.js (run using: node agent.js)
const express = require('express');
const cors = require('cors');
const { getConnectedWifiMac, getLocalDeviceMac } = require('./utils/macUtils');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ API Endpoint for Triggering Check-In
app.post('/trigger-checkin', async (req, res) => {
  try {
    const { wifiMac: reqWifiMac, deviceMac: reqDeviceMac, token } = req.body;

    // 🔒 Use local MAC if not passed in body
    const wifiMac = reqWifiMac || getConnectedWifiMac();
    const deviceMac = reqDeviceMac || getLocalDeviceMac();

    console.log("👉 wifiMac:", wifiMac);
    console.log("👉 deviceMac:", deviceMac);
    console.log("👉 token:", token);

    const response = await axios.post(
      'https://attendance-server-1-l2oz.onrender.com/api/attendance/checkin',
      {
        wifiMac,
        deviceMac
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ Agent Failed:", err.message);
    if (err.response) {
      console.error("👉 Backend Error:", err.response.status, err.response.data);
    }
    res.status(500).json({ message: err.response?.data?.message || "Agent Error" });
  }
});

// ✅ Start Agent on Port 3001
app.listen(3001, () => console.log("📡 MAC Agent running on http://localhost:3001"));

// });



// app.listen(3001, () => console.log("MAC Agent running on port 3001"));
