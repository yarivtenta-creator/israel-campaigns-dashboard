const express = require('express');
const router = express.Router();
const analysisService = require('../services/analysis-service');

// Analyze materials
router.post('/:projectId/analyze', async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await analysisService.analyzeWithClaude(projectId);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing materials:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get analysis
router.get('/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;

    const result = analysisService.getAnalysis(projectId);
    if (!result) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
