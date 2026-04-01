const express = require('express');
const router = express.Router();
const promptsService = require('../services/prompts-service');

// Generate prompts
router.post('/:projectId/generate', async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await promptsService.generateWithClaude(projectId);
    res.json(result);
  } catch (error) {
    console.error('Error generating prompts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get prompts
router.get('/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;

    const result = promptsService.getPrompts(projectId);
    res.json(result);
  } catch (error) {
    console.error('Error getting prompts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save custom prompts
router.post('/:projectId/save', (req, res) => {
  try {
    const { projectId } = req.params;
    const { formats } = req.body;

    if (!formats) {
      return res.status(400).json({ error: 'formats is required' });
    }

    const result = promptsService.saveCustomPrompts(projectId, formats);
    res.json(result);
  } catch (error) {
    console.error('Error saving prompts:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
