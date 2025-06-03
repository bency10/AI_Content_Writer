const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const keyword = req.body.keyword;

  try {
    const response = await axios.post('https://web-production-8f74e8.up.railway.app/generate', {
      task: 'titles',
      input: keyword
    });

    const list = response.data.result.split('\n').filter(line => line.trim() !== '');
    res.json({ titles: list });
  } catch (error) {
    res.status(500).json({ error: 'Title generation failed' });
  }
});

module.exports = router;
