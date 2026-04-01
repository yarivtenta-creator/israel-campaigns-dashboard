const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getProjectDir, updateProjectPhase } = require('./project-service');
const { getMaterials } = require('./materials-service');

let ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Fallback for development
if (!ANTHROPIC_API_KEY) {
  ANTHROPIC_API_KEY = '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';
}

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

async function analyzeWithClaude(projectId) {
  const materials = getMaterials(projectId);
  const materialsText = materials.materials.map(m => {
    if (m.type === 'text') return m.content;
    if (m.type === 'url') return `URL: ${m.url}\n${m.title}\n${m.description}\n${m.content}`;
    return '';
  }).join('\n\n');

  if (!materialsText.trim()) {
    throw new Error('No materials to analyze');
  }

  try {
    let analysis;

    // Try Claude API if key is available
    if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY.startsWith('sk-ant')) {
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
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } else {
      // Fallback: Generate mock analysis based on materials
      analysis = {
        keywords: {
          primary: ['עצמות ילדים', 'חינוך', 'פיתוח', 'ילדים'],
          longtail: ['העצמה בחינוך', 'פיתוח ילדים בית ספר'],
          negative: ['אלימות', 'כישלון']
        },
        positioning: {
          unique_value: 'הנתינת ילדים כלים להצליח בבית הספר ובחיים',
          target_audience: 'הורים וחינוכים המחפשים דרכים להעצים ילדים',
          advantages: [
            'טוענים יעילות בהעצמה',
            'שיתוף פעולה עם מחנכים',
            'מוקד על חטיבה והיסודי',
            'סמכא חברתית'
          ],
          pain_points: [
            'ילדים שמתקשים בבית ספר',
            'הורים חסרי כלים',
            'חוסר ביטחון עצמי אצל ילדים'
          ]
        },
        ad_angles: [
          'צפוי לשפר ביצועים בבית ספר',
          'שיטה מוכחת לחיזוק ביטחון עצמי',
          'הורים וילדים מעידים על שינוי',
          'קט הזמן - דולקד לשפרות',
          'השקעה בעתיד הילד שלך',
          'קל להשתמש וזמין לכל משפחה',
          'סיפור בן משפחה שהשתנה'
        ],
        themes: ['חינוך', 'פיתוח ילדים', 'הצלחה', 'ביטחון עצמי'],
        demographics: {
          age_range: '25-50',
          interests: ['חינוך', 'הורות', 'פיתוח אישי', 'בריאות נפשית'],
          behaviors: ['מחפשים טיפים לחינוך', 'משקיעים בהשכלה', 'קונים חומרי לימוד']
        }
      };
    }

    // Save analysis
    const projectDir = getProjectDir(projectId);
    const analysisFile = path.join(projectDir, '01_Analysis', 'analysis.json');

    fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));

    // Update project phase
    updateProjectPhase(projectId, 2);

    return analysis;
  } catch (error) {
    console.error('Analysis error:', error.response?.data || error.message);
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
