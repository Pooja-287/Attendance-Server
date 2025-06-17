// agent.js (run using: node agent.js)
const express = require('express');
const cors = require('cors');
const { getConnectedWifiMac, getLocalDeviceMac } = require('./utils/macUtils');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/trigger-checkin', async (req, res) => {
  try {
    const wifiMac = getConnectedWifiMac();
    const deviceMac = getLocalDeviceMac();
    const token = req.body.token;

    console.log("👉 wifiMac:", wifiMac);
    console.log("👉 deviceMac:", deviceMac);
    console.log("👉 token:", token);

    const response = await axios.post('http://localhost:5000/api/attendance/checkin', {
      wifiMac,
      deviceMac
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ Agent Failed:", err.message);
    if (err.response) {
      console.error("👉 Backend Error:", err.response.status, err.response.data);
    }
    res.status(500).json({ message: err.response?.data?.message || "Agent Error" });
  }



