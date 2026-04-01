const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const campaignsRouter = require('./routes/campaigns');
const researchRouter = require('./routes/research');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dashboard/build')));

// API Routes
app.use('/api/campaigns', campaignsRouter);
app.use('/api/research', researchRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Dashboard server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
