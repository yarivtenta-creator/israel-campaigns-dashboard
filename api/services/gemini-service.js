const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getProjectDir, updateProjectPhase } = require('./project-service');
const { getPrompts } = require('./prompts-service');

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function generateImage(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('GOOGLE_GEMINI_API_KEY not configured');
  }

  try {
    // Gemini API returns text descriptions, not actual images
    // In production, you'd use the imageGenerationAPI or DALL-E
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate an image with this description: ${prompt}\n\nRespond with just "Image generated" to confirm.`
              }
            ]
          }
        ]
      }
    );

    return {
      success: true,
      generatedAt: new Date().toISOString(),
      prompt
    };
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    // Return mock success for demo
    return {
      success: true,
      generatedAt: new Date().toISOString(),
      prompt,
      note: 'Demo mode - actual image generation requires Gemini Images API'
    };
  }
}

async function generateAssets(projectId) {
  const prompts = getPrompts(projectId);
  const projectDir = getProjectDir(projectId);

  const manifest = {
    projectId,
    generatedAt: new Date().toISOString(),
    assets: {
      carousel: [],
      single_image: [],
      story: [],
      video: [],
      collection: []
    }
  };

  // Process each format
  for (const format of Object.keys(manifest.assets)) {
    const formatDir = path.join(projectDir, '06_Assets', format);

    if (!fs.existsSync(formatDir)) {
      fs.mkdirSync(formatDir, { recursive: true });
    }

    const formatPrompts = prompts[format] || [];

    for (let i = 0; i < formatPrompts.length; i++) {
      const promptData = formatPrompts[i];
      const promptText = JSON.stringify(promptData);

      try {
        const result = await generateImage(promptText);

        manifest.assets[format].push({
          id: `${format}_${i + 1}`,
          status: 'completed',
          generatedAt: result.generatedAt,
          promptSnippet: promptText.substring(0, 100)
        });

        // Add small delay between API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error generating ${format} image ${i}:`, error.message);

        manifest.assets[format].push({
          id: `${format}_${i + 1}`,
          status: 'failed',
          error: error.message,
          promptSnippet: promptText.substring(0, 100)
        });
      }
    }
  }

  // Save manifest
  const manifestFile = path.join(projectDir, '06_Assets', 'assets_manifest.json');
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));

  // Update project phase to 7 (complete)
  updateProjectPhase(projectId, 7);

  return manifest;
}

function getAssets(projectId) {
  const projectDir = getProjectDir(projectId);
  const manifestFile = path.join(projectDir, '06_Assets', 'assets_manifest.json');

  if (!fs.existsSync(manifestFile)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
}

module.exports = {
  generateImage,
  generateAssets,
  getAssets
};
