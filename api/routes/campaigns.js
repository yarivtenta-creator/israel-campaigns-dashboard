const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const workspaceService = require('../services/workspace');
const skillRunner = require('../services/skill-runner');

// Get all campaigns
router.get('/', (req, res) => {
  try {
    const campaigns = workspaceService.listCampaigns();
    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single campaign
router.get('/:id', (req, res) => {
  try {
    const campaign = workspaceService.getCampaign(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new campaign
router.post('/', async (req, res) => {
  try {
    const { topic, description, sector, notes } = req.body;

    if (!topic || !description) {
      return res.status(400).json({ success: false, error: 'Topic and description required' });
    }

    const campaignId = uuidv4();
    const timestamp = new Date().toISOString();

    // Create workspace folder
    workspaceService.createWorkspace(campaignId, {
      topic,
      description,
      sector: sector || 'General',
      notes: notes || '',
      createdAt: timestamp,
      status: 'generating'
    });

    // Generate brief using skill (async)
    skillRunner.generateBrief(campaignId, topic, description, sector).then(brief => {
      workspaceService.saveBrief(campaignId, brief);
      workspaceService.updateMetadata(campaignId, { status: 'completed', completedAt: new Date().toISOString() });
    }).catch(error => {
      workspaceService.updateMetadata(campaignId, { status: 'failed', error: error.message });
    });

    res.json({ success: true, campaignId, status: 'generating' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get comparison of multiple campaigns
router.post('/compare', (req, res) => {
  try {
    const { campaignIds } = req.body;

    if (!campaignIds || campaignIds.length < 2) {
      return res.status(400).json({ success: false, error: 'At least 2 campaigns required for comparison' });
    }

    const comparison = workspaceService.compareCampaigns(campaignIds);
    res.json({ success: true, comparison });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete campaign
router.delete('/:id', (req, res) => {
  try {
    workspaceService.deleteCampaign(req.params.id);
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export campaign as JSON/PDF
router.get('/:id/export/:format', (req, res) => {
  try {
    const { id, format } = req.params;
    const exported = workspaceService.exportCampaign(id, format);

    if (format === 'json') {
      res.json(exported);
    } else if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="campaign-${id}.pdf"`);
      res.send(exported);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
