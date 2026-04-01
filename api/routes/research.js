/**
 * Research API Routes
 *
 * Endpoints for conducting research, managing research sessions,
 * and accessing research results
 */

const express = require('express');
const router = express.Router();
const researchEngine = require('../services/research-engine');
const metaIntelligence = require('../services/meta-intelligence');
const googleInsights = require('../services/google-insights');
const workspaceService = require('../services/workspace');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/research/start
 * Start a new research session
 */
router.post('/start', async (req, res) => {
  try {
    const { topic, competitors, sector, depth, languages } = req.body;

    if (!topic || !competitors || !Array.isArray(competitors)) {
      return res.status(400).json({
        error: 'Invalid request: topic (string) and competitors (array) required'
      });
    }

    const result = await researchEngine.startResearch({
      topic,
      competitors,
      sector: sector || 'General',
      depth: depth || 'standard',
      languages: languages || ['Hebrew', 'English']
    });

    res.json({
      success: true,
      researchId: result.researchId,
      status: 'initialized',
      config: result.scope
    });
  } catch (error) {
    console.error('Start research error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/research/conduct
 * Conduct full research workflow
 */
router.post('/conduct', async (req, res) => {
  try {
    const { topic, competitors, sector, depth, languages } = req.body;

    if (!topic || !competitors || !Array.isArray(competitors)) {
      return res.status(400).json({
        error: 'Invalid request: topic and competitors required'
      });
    }

    // Start conducting research (will complete in background)
    const result = await researchEngine.conductResearch({
      topic,
      competitors,
      sector: sector || 'General',
      depth: depth || 'standard',
      languages: languages || ['Hebrew', 'English']
    });

    res.json({
      success: true,
      researchId: result.researchId,
      status: result.status,
      summary: result.summary
    });
  } catch (error) {
    console.error('Conduct research error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/research/:id/export/:format
 * Export research as JSON or PDF
 */
router.get('/:id/export/:format', (req, res) => {
  try {
    const { id, format } = req.params;

    // Validate format
    if (!['json', 'pdf'].includes(format)) {
      return res.status(400).json({ error: 'Format must be json or pdf' });
    }

    // Export research
    const exported = workspaceService.exportResearch(id, format);

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.json(exported);
    } else if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="research-${id}.pdf"`);
      res.send(exported);
    }
  } catch (error) {
    console.error('Export research error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/research/:id/status
 * Get research status
 */
router.get('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const status = researchEngine.getResearchStatus(id);

    if (status.error) {
      return res.status(404).json(status);
    }

    res.json(status);
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/research/:id/results
 * Get research results
 */
router.get('/:id/results', (req, res) => {
  try {
    const { id } = req.params;
    const { section } = req.query;

    const results = researchEngine.getResearchResults(id, section);

    if (results.error) {
      return res.status(404).json(results);
    }

    res.json(results);
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/research/:id/meta
 * Get Meta competitive intelligence
 */
router.get('/:id/meta', (req, res) => {
  try {
    const { id } = req.params;
    const results = researchEngine.getResearchResults(id);

    if (!results.competitive_analysis) {
      return res.status(404).json({ error: 'Competitive analysis not found' });
    }

    res.json({
      section: 'Meta Competitive Intelligence',
      data: results.competitive_analysis
    });
  } catch (error) {
    console.error('Get meta data error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/research/:id/google
 * Get Google insights (articles and trends)
 */
router.get('/:id/google', (req, res) => {
  try {
    const { id } = req.params;
    const results = researchEngine.getResearchResults(id);

    if (!results.articles_analysis) {
      return res.status(404).json({ error: 'Articles analysis not found' });
    }

    res.json({
      section: 'Google Insights',
      data: results.articles_analysis
    });
  } catch (error) {
    console.error('Get google insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/research/:id/insights
 * Get synthesized insights
 */
router.get('/:id/insights', (req, res) => {
  try {
    const { id } = req.params;
    const results = researchEngine.getResearchResults(id);

    if (!results.synthesis) {
      return res.status(404).json({ error: 'Synthesis not found' });
    }

    res.json({
      section: 'Synthesized Insights',
      data: results.synthesis
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/research/:id/report
 * Get final research report
 */
router.get('/:id/report', (req, res) => {
  try {
    const { id } = req.params;
    const results = researchEngine.getResearchResults(id);

    if (!results.research_report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({
      section: 'Research Report',
      data: results.research_report
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/research/:id
 * Delete research session
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = researchEngine.deleteResearch(id);

    if (result.error) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Delete research error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/research
 * List all research sessions
 */
router.get('/', (req, res) => {
  try {
    const sessions = researchEngine.listResearch();
    res.json({
      total: sessions.length,
      sessions
    });
  } catch (error) {
    console.error('List research error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/research/:id/save-to-campaign
 * Save research to a new campaign
 */
router.post('/:id/save-to-campaign', async (req, res) => {
  try {
    const { id } = req.params;

    // Get all research results
    const researchData = researchEngine.getResearchResults(id);

    if (!researchData) {
      return res.status(404).json({ success: false, error: 'Research not found' });
    }

    // Convert research to campaign brief
    const campaignBrief = workspaceService.convertResearchToCampaign(id, researchData);

    // Create new campaign
    const campaignId = uuidv4();
    const timestamp = new Date().toISOString();

    // Create workspace
    workspaceService.createWorkspace(campaignId, {
      topic: researchData.research_scope?.topic || 'Research-derived campaign',
      description: `Generated from research: ${id}`,
      sector: researchData.research_scope?.sector || 'General',
      notes: `Research-backed campaign. Source research ID: ${id}`,
      createdAt: timestamp,
      status: 'completed',
      completedAt: timestamp,
      researchId: id
    });

    // Save brief
    workspaceService.saveBrief(campaignId, campaignBrief);

    res.json({
      success: true,
      campaignId,
      message: 'Campaign created from research',
      topic: researchData.research_scope?.topic,
      sector: researchData.research_scope?.sector
    });
  } catch (error) {
    console.error('Save to campaign error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/research/competitive-analysis
 * Get competitive analysis for specific competitors
 */
router.post('/competitive-analysis', async (req, res) => {
  try {
    const { topic, competitors } = req.body;

    if (!topic || !competitors || !Array.isArray(competitors)) {
      return res.status(400).json({
        error: 'Invalid request: topic and competitors array required'
      });
    }

    const analysis = await metaIntelligence.analyzeCompetitors(topic, competitors);

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Competitive analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/research/sources
 * Collect source materials for research
 */
router.post('/sources', async (req, res) => {
  try {
    const { topic, languages } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'topic required' });
    }

    const sources = await googleInsights.collectSources(
      topic,
      languages || ['Hebrew', 'English']
    );

    res.json({
      success: true,
      sources
    });
  } catch (error) {
    console.error('Collect sources error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/research/search-trends/:keyword
 * Get search trends for keyword
 */
router.get('/search-trends/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;

    const trends = await googleInsights.getSearchTrends(keyword);

    res.json({
      success: true,
      keyword,
      trends
    });
  } catch (error) {
    console.error('Get search trends error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/research/pain-points/:topic
 * Get pain points for topic
 */
router.get('/pain-points/:topic', (req, res) => {
  try {
    const { topic } = req.params;

    const painPoints = googleInsights.analyzePainPoints(topic);

    res.json({
      success: true,
      topic,
      painPoints
    });
  } catch (error) {
    console.error('Get pain points error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
