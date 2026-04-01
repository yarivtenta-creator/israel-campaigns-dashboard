const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { getProjectDir } = require('./project-service');

async function scrapeUrl(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Extract title
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';

    // Extract description
    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       '';

    // Extract main content
    const content = $('main').text() || $('article').text() || $('body').text() || '';

    return {
      type: 'url',
      url,
      title: title.substring(0, 200),
      description: description.substring(0, 500),
      content: content.substring(0, 2000),
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
}

function saveUploadedFile(projectId, file) {
  const projectDir = getProjectDir(projectId);
  const uploadsDir = path.join(projectDir, '00_Materials', 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, file.filename);
  fs.writeFileSync(filePath, file.buffer);

  return {
    type: 'file',
    filename: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    savedAt: new Date().toISOString()
  };
}

function saveMaterials(projectId, materials) {
  const projectDir = getProjectDir(projectId);
  const materialsFile = path.join(projectDir, '00_Materials', 'materials.json');

  const materialsData = {
    projectId,
    materials: materials || [],
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(materialsFile, JSON.stringify(materialsData, null, 2));

  return materialsData;
}

function getMaterials(projectId) {
  const projectDir = getProjectDir(projectId);
  const materialsFile = path.join(projectDir, '00_Materials', 'materials.json');

  if (!fs.existsSync(materialsFile)) {
    return { projectId, materials: [], lastUpdated: null };
  }

  return JSON.parse(fs.readFileSync(materialsFile, 'utf-8'));
}

module.exports = {
  scrapeUrl,
  saveUploadedFile,
  saveMaterials,
  getMaterials
};
