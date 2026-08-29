const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// ---------- Visit counter persistence ----------
// Stored as data/visits.json: { "count": <number>, "updatedAt": "<ISO date>" }
const DATA_DIR = path.join(__dirname, 'data');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');

function ensureVisitsFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(VISITS_FILE)) {
    fs.writeFileSync(VISITS_FILE, JSON.stringify({ count: 0, updatedAt: null }, null, 2));
  }
}
ensureVisitsFile();

function readVisits() {
  try {
    return JSON.parse(fs.readFileSync(VISITS_FILE, 'utf8'));
  } catch (err) {
    return { count: 0, updatedAt: null };
  }
}

function writeVisits(data) {
  fs.writeFileSync(VISITS_FILE, JSON.stringify(data, null, 2));
}

app.use(express.static(path.join(__dirname)));

// GET current visit count without incrementing it
app.get('/api/visits', (req, res) => {
  res.json(readVisits());
});

// POST increments the counter by one (called once per page load)
app.post('/api/visits', (req, res) => {
  const data = readVisits();
  data.count += 1;
  data.updatedAt = new Date().toISOString();
  writeVisits(data);
  res.json(data);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Portfolio running on port ${PORT}`);
});
