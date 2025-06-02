
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const PYTHON_API = 'http://localhost:7000/generate';

app.post('/keywords', async (req, res) => {
  const keyword = req.body.keyword;
  const response = await axios.post(PYTHON_API, {
    task: 'keywords',
    input: keyword
  });
  const list = response.data.result.split('\n').filter(x => x.trim() !== '');
  res.json({ keywords: list });
});

app.post('/titles', async (req, res) => {
  const keyword = req.body.keyword;
  const response = await axios.post(PYTHON_API, {
    task: 'titles',
    input: keyword
  });
  const list = response.data.result.split('\n').filter(x => x.trim() !== '');
  res.json({ titles: list });
});

app.post('/topics', async (req, res) => {
  const title = req.body.title;
  const response = await axios.post(PYTHON_API, {
    task: 'topics',
    input: title
  });
  const list = response.data.result.split('\n').filter(x => x.trim() !== '');
  res.json({ topics: list });
});

app.post('/content', async (req, res) => {
  const { topic, keyword } = req.body;
  const response = await axios.post(PYTHON_API, {
    task: 'content',
    input: `${keyword} - ${topic}`
  });
  res.json({ content: response.data.result });
});

app.listen(5000, () => {
  console.log('Node server running at http://localhost:5000');
});
