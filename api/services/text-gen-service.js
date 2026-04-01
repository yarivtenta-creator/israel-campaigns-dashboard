const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getProjectDir } = require('./project-service');
const { getAnalysis } = require('./analysis-service');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

async function generateWithClaude(projectId, campaignData) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const analysis = getAnalysis(projectId);
  if (!analysis) {
    throw new Error('Analysis data not found. Run analysis first.');
  }

  const angles = analysis.ad_angles || [];
  const tones = ['formal', 'casual', 'premium'];
  const formats = ['carousel', 'single', 'story', 'video', 'collection'];

  const prompt = `Generate 5 different ad copy variations for an Israeli product/service.

Campaign: ${campaignData.campaignName || 'Product Campaign'}
Target: ${analysis.positioning?.target_audience || 'Target audience'}
Key points: ${analysis.positioning?.advantages?.join(', ') || 'Key advantages'}
Ad angles available: ${angles.join(', ')}

For each variation, create:
- Different ad angle (rotate through available angles)
- Different tone (formal/casual/premium)
- Different format hint
- Bilingual content (Hebrew + English)

Generate exactly 5 variations with this JSON structure:
[
  {
    "id": 1,
    "angle": "pain-point",
    "tone": "casual",
    "format": "carousel",
    "hebrew": {
      "headline": "כותרת בעברית",
      "body": "תוכן גוף בעברית",
      "cta": "קריאה לפעולה"
    },
    "english": {
      "headline": "English Headline",
      "body": "English body content",
      "cta": "Call to action"
    }
  }
]`;

  try {
    const response = await axios.post(ANTHROPIC_URL, {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    const responseText = response.data.content[0].text;
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    const variations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    // Save variations
    const projectDir = getProjectDir(projectId);
    const copyFile = path.join(projectDir, '04_Copy', 'generated_variations.json');

    fs.writeFileSync(copyFile, JSON.stringify(variations, null, 2));

    return variations;
  } catch (error) {
    console.error('Claude API error:', error.response?.data || error.message);
    throw new Error(`Generation failed: ${error.message}`);
  }
}

function getVariations(projectId) {
  const projectDir = getProjectDir(projectId);
  const copyFile = path.join(projectDir, '04_Copy', 'generated_variations.json');

  if (!fs.existsSync(copyFile)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(copyFile, 'utf-8'));
}

function saveApprovedVariations(projectId, approvedIds) {
  const projectDir = getProjectDir(projectId);
  const variations = getVariations(projectId);
  const approved = variations.filter(v => approvedIds.includes(v.id));

  const approvedFile = path.join(projectDir, '04_Copy', 'approved_variations.json');
  fs.writeFileSync(approvedFile, JSON.stringify(approved, null, 2));

  return approved;
}

module.exports = {
  generateWithClaude,
  getVariations,
  saveApprovedVariations
};
