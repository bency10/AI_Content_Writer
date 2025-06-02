const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const keyword = req.body.keyword;
  console.log("🔹 Keyword received at Node.js:", keyword);

  try {
    const response = await axios.post('http://localhost:7000/generate', {
      task: 'keywords',
      input: keyword
    });

    console.log("✅ Response from Flask:", response.data);

    const list = response.data.result.split('\n').filter(line => line.trim() !== '');
    res.json({ keywords: list });

  } catch (error) {
    console.error("❌ Error in /keywords route:", error.message);
    if (error.response && error.response.data) {
      console.error("❌ Flask returned:", error.response.data);
    }
    res.status(500).json({ error: 'Keyword generation failed' });
  }
});

module.exports = router;
