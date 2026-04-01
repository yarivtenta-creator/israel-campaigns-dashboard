const express = require('express');
const router = express.Router();
const multer = require('multer');
const materialsService = require('../services/materials-service');

const upload = multer({ storage: multer.memoryStorage() });

// Save collected materials
router.post('/:projectId/save', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { materials } = req.body;

    const result = materialsService.saveMaterials(projectId, materials);
    res.json(result);
  } catch (error) {
    console.error('Error saving materials:', error);
    res.status(500).json({ error: error.message });
  }
});

// Scrape URL
router.post('/:projectId/scrape', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const result = await materialsService.scrapeUrl(url);
    res.json(result);
  } catch (error) {
    console.error('Error scraping URL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload file
router.post('/:projectId/upload', upload.single('file'), (req, res) => {
  try {
    const { projectId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const result = materialsService.saveUploadedFile(projectId, req.file);
    res.json(result);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get materials
router.get('/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    const result = materialsService.getMaterials(projectId);
    res.json(result);
  } catch (error) {
    console.error('Error getting materials:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
