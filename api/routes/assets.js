const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini-service');

// Generate assets
router.post('/:projectId/generate', async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await geminiService.generateAssets(projectId);
    res.json(result);
  } catch (error) {
    console.error('Error generating assets:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get assets
router.get('/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;

    const result = geminiService.getAssets(projectId);
    if (!result) {
      return res.status(404).json({ error: 'Assets not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting assets:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
