const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getProjectDir } = require('./project-service');
const { getVariations } = require('./text-gen-service');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

async function generateWithClaude(projectId) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const variations = getVariations(projectId);
  if (!variations.length) {
    throw new Error('No approved copy found. Generate copy first.');
  }

  const sampleCopy = variations[0];

  const prompt = `Generate detailed image generation prompts for 5 ad formats in English and Hebrew.

Sample copy:
- Headline: ${sampleCopy.english?.headline || ''}
- Body: ${sampleCopy.english?.body || ''}

Create image prompts for these 5 formats (3 images for carousel, 1 for single, 1 for story, 1 for video scenes, 1 for collection):

Respond with this exact JSON structure:
{
  "carousel": [
    {
      "image_1": "Detailed visual description for first carousel image with Israeli cultural elements, style, colors, mood",
      "image_2": "Detailed visual description for second carousel image",
      "image_3": "Detailed visual description for third carousel image"
    }
  ],
  "single_image": [
    {
      "prompt": "Single powerful image visual specification with composition, colors, mood, cultural relevance"
    }
  ],
  "story": [
    {
      "prompt": "Vertical mobile story format image - portrait orientation, visual flow, style guide"
    }
  ],
  "video": [
    {
      "scene_1": "Scene description and visual flow",
      "scene_2": "Second scene description",
      "scene_3": "Third scene and transitions"
    }
  ],
  "collection": [
    {
      "tile_1": "First grid position image description",
      "tile_2": "Second grid position image description",
      "tile_3": "Third grid position image description",
      "tile_4": "Fourth grid position image description"
    }
  ]
}`;

  try {
    const response = await axios.post(ANTHROPIC_URL, {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2500,
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
    const prompts = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    // Save prompts
    const projectDir = getProjectDir(projectId);
    const promptsFile = path.join(projectDir, '05_Prompts', 'image_prompts.json');

    fs.writeFileSync(promptsFile, JSON.stringify(prompts, null, 2));

    return prompts;
  } catch (error) {
    console.error('Claude API error:', error.response?.data || error.message);
    throw new Error(`Prompt generation failed: ${error.message}`);
  }
}

function getPrompts(projectId) {
  const projectDir = getProjectDir(projectId);
  const promptsFile = path.join(projectDir, '05_Prompts', 'image_prompts.json');

  if (!fs.existsSync(promptsFile)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(promptsFile, 'utf-8'));
}

function saveCustomPrompts(projectId, prompts) {
  const projectDir = getProjectDir(projectId);
  const promptsFile = path.join(projectDir, '05_Prompts', 'image_prompts.json');

  fs.writeFileSync(promptsFile, JSON.stringify(prompts, null, 2));

  return prompts;
}

module.exports = {
  generateWithClaude,
  getPrompts,
  saveCustomPrompts
};
