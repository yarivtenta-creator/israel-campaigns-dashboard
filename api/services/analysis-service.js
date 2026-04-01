const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getProjectDir, updateProjectPhase } = require('./project-service');
const { getMaterials } = require('./materials-service');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

async function analyzeWithClaude(projectId) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const materials = getMaterials(projectId);
  const materialsText = materials.materials.map(m => {
    if (m.type === 'text') return m.content;
    if (m.type === 'url') return `URL: ${m.url}\n${m.title}\n${m.description}\n${m.content}`;
    return '';
  }).join('\n\n');

  if (!materialsText.trim()) {
    throw new Error('No materials to analyze');
  }

  const prompt = `Analyze these materials and extract marketing intelligence:

${materialsText}

Provide analysis in this exact JSON format:
{
  "keywords": {
    "primary": ["keyword1", "keyword2"],
    "longtail": ["long tail phrase 1"],
    "negative": ["what NOT to target"]
  },
  "positioning": {
    "unique_value": "Main value proposition",
    "target_audience": "Who is this for",
    "advantages": ["advantage1", "advantage2"],
    "pain_points": ["problem solved 1"]
  },
  "ad_angles": [
    "pain-point solving",
    "solution focused",
    "social proof",
    "urgency driven",
    "value proposition",
    "ease of use",
    "storytelling"
  ],
  "themes": ["theme1", "theme2"],
  "demographics": {
    "age_range": "20-45",
    "interests": ["interest1"],
    "behaviors": ["behavior1"]
  }
}`;

  try {
    const response = await axios.post(ANTHROPIC_URL, {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
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

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    // Save analysis
    const projectDir = getProjectDir(projectId);
    const analysisFile = path.join(projectDir, '01_Analysis', 'analysis.json');

    fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));

    // Update project phase
    updateProjectPhase(projectId, 2);

    return analysis;
  } catch (error) {
    console.error('Claude API error:', error.response?.data || error.message);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}

function getAnalysis(projectId) {
  const projectDir = getProjectDir(projectId);
  const analysisFile = path.join(projectDir, '01_Analysis', 'analysis.json');

  if (!fs.existsSync(analysisFile)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(analysisFile, 'utf-8'));
}

module.exports = {
  analyzeWithClaude,
  getAnalysis
};
