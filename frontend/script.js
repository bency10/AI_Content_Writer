let keywords = [];
let titles = [];
let topics = [];

function generateKeywords() {
  const keyword = document.getElementById('seedKeyword').value;
  const statusDiv = document.getElementById('statusKeywords');
  statusDiv.textContent = "Generating...";

  fetch('https://web-production-8f74e8.up.railway.app/keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword })
  })
  .then(res => res.json())
  .then(data => {
    statusDiv.textContent = "";

    const raw = data.keywords || data.result || "";
    let lines = [];

    if (typeof raw === "string") {
      lines = raw.split("\n");
    } else if (Array.isArray(raw)) {
      lines = raw;
    } else {
      console.error("Unexpected format from API:", raw);
      return;
    }

    // Keep only numbered list lines (e.g., "1. office furniture")
    keywords = lines
      .map(line => line.trim())
      .filter(line => line && /^[0-9]+[.)]\s/.test(line));

    const list = document.getElementById('keywordSuggestions');
    const dropdown = document.getElementById('selectedKeyword');
    list.innerHTML = '';
    dropdown.innerHTML = '';

    keywords.forEach(kw => {
      const li = document.createElement('li');
      li.textContent = kw;
      list.appendChild(li);

      const cleanText = kw.replace(/^[0-9]+[.)]\s*/, '').trim();
      const option = document.createElement('option');
      option.value = cleanText;
      option.textContent = cleanText;
      dropdown.appendChild(option);
    });

    document.getElementById('step2').style.display = 'block';
  })
  .catch(error => {
    statusDiv.textContent = "Error fetching keywords.";
    console.error("Keyword generation error:", error);
  });
}


function generateTitles() {
  const keyword = document.getElementById('selectedKeyword').value;
  const statusDiv = document.getElementById('statusTitles');
  statusDiv.textContent = "Generating...";

  fetch('https://web-production-8f74e8.up.railway.app/titles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword })
  })
  .then(res => res.json())
  .then(data => {
    statusDiv.textContent = "";
    titles = data.titles;
    const list = document.getElementById('titleSuggestions');
    const dropdown = document.getElementById('selectedTitle');
    list.innerHTML = '';
    dropdown.innerHTML = '';
    titles.forEach(title => {
      const li = document.createElement('li');
      li.textContent = title;
      list.appendChild(li);

      const option = document.createElement('option');
      option.value = title;
      option.textContent = title;
      dropdown.appendChild(option);
    });
    document.getElementById('step3').style.display = 'block';
  });
}

function generateTopics() {
  const title = document.getElementById('selectedTitle').value;
  const statusDiv = document.getElementById('statusTopics');
  statusDiv.textContent = "Generating...";

  fetch('https://web-production-8f74e8.up.railway.app/topics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })
  .then(res => res.json())
  .then(data => {
    statusDiv.textContent = "";
    const container = document.getElementById('topicSuggestions');
    const dropdown = document.getElementById('selectedTopic');
    container.innerHTML = '';
    dropdown.innerHTML = '';

    const raw = data.topics || data.result || "";
    const lines = Array.isArray(raw) ? raw : raw.split('\n').filter(l => l.trim());

    // Display as one paragraph block
    const topicBox = document.createElement('div');
    topicBox.className = "topic-box-single";
    topicBox.textContent = lines.join('\n');
    container.appendChild(topicBox);

    // ✅ Populate dropdown with valid non-empty lines
    lines.forEach((line, index) => {
      const clean = line.trim();
      if (clean && !clean.toLowerCase().startsWith("option")) {
        const option = document.createElement('option');
        option.value = clean;
        option.textContent = `${index + 1}. ${clean}`;
        dropdown.appendChild(option);
      }
    });

    document.getElementById('step4').style.display = 'block';
  })
  .catch(error => {
    statusDiv.textContent = "Error generating topics.";
    console.error("Topic generation error:", error);
  });
}


function generateContent() {
  const topic = document.getElementById('selectedTopic').value;
  const keyword = document.getElementById('selectedKeyword').value;
  const statusDiv = document.getElementById('statusContent');
  statusDiv.textContent = "Generating...";

  fetch('https://web-production-8f74e8.up.railway.app/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, keyword })
  })
  .then(res => res.json())
  .then(data => {
    statusDiv.textContent = "";
    document.getElementById('contentResult').textContent = data.content;
  });
}

function copyContent() {
  const text = document.getElementById('contentResult').textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Content copied to clipboard!');
  });
}
