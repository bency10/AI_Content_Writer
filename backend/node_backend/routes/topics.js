const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const title = req.body.title;

  try {
    const response = await axios.post('http://localhost:7000/generate', {
      task: 'topics',
      input: title
    });

    const list = response.data.result.split('\n').filter(line => line.trim() !== '');
    res.json({ topics: list });
  } catch (error) {
    res.status(500).json({ error: 'Topic generation failed' });
  }
});

module.exports = router;
