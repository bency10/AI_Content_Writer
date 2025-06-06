const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { keyword, topic } = req.body;

  try {
    const response = await axios.post('https://web-production-8f74e8.up.railway.app/generate', {
      task: 'content',
      input: `${keyword} - ${topic}`
    });

    res.json({ content: response.data.result });
  } catch (error) {
    res.status(500).json({ error: 'Content generation failed' });
  }
});

module.exports = router;
