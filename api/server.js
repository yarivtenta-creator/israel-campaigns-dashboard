// Polyfill for Node.js - define File class stub used by unidici
if (typeof global.File === 'undefined') {
  global.File = class File {
    constructor(bits, filename, options = {}) {
      this.name = filename;
      this.type = options.type || '';
    }
  };
}

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const campaignsRouter = require('./routes/campaigns');
const researchRouter = require('./routes/research');
const projectsRouter = require('./routes/projects');
const materialsRouter = require('./routes/materials');
const analysisRouter = require('./routes/analysis');
const copyRouter = require('./routes/copy');
const promptsRouter = require('./routes/prompts');
const assetsRouter = require('./routes/assets');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dashboard/build')));

// API Routes
// New workflow routes
app.use('/api/projects', projectsRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/copy', copyRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/assets', assetsRouter);

// Legacy routes
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
