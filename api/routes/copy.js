const express = require('express');
const router = express.Router();
const textGenService = require('../services/text-gen-service');

// Generate copy variations
router.post('/:projectId/generate', async (req, res) => {
  try {
    const { projectId } = req.params;
    const campaignData = req.body;

    const result = await textGenService.generateWithClaude(projectId, campaignData);
    res.json(result);
  } catch (error) {
    console.error('Error generating copy:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get variations
router.get('/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;

    const result = textGenService.getVariations(projectId);
    res.json(result);
  } catch (error) {
    console.error('Error getting variations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Approve variations
router.post('/:projectId/approve', (req, res) => {
  try {
    const { projectId } = req.params;
    const { approvedIds } = req.body;

    if (!Array.isArray(approvedIds)) {
      return res.status(400).json({ error: 'approvedIds must be an array' });
    }

    const result = textGenService.saveApprovedVariations(projectId, approvedIds);
    res.json(result);
  } catch (error) {
    console.error('Error approving variations:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
