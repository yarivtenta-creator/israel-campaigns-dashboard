const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PROJECTS_DIR = path.join(__dirname, '../../campaigns');

// Ensure projects directory exists
if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

// Create folder structure for a new project
function createProjectFolders(projectDir) {
  const folders = [
    '00_Materials',
    '01_Analysis',
    '02_Research',
    '03_Campaign',
    '04_Copy',
    '05_Prompts',
    '06_Assets',
    '07_Final'
  ];

  folders.forEach(folder => {
    const folderPath = path.join(projectDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });
}

function createProject(projectName) {
  const projectId = uuidv4();
  const projectDir = path.join(PROJECTS_DIR, projectId);

  fs.mkdirSync(projectDir, { recursive: true });
  createProjectFolders(projectDir);

  const metadata = {
    projectId,
    projectName,
    createdAt: new Date().toISOString(),
    currentPhase: 1,
    completedPhases: []
  };

  fs.writeFileSync(
    path.join(projectDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );

  return { projectId, ...metadata };
}

function getProject(projectId) {
  const projectDir = path.join(PROJECTS_DIR, projectId);
  const metadataFile = path.join(projectDir, 'metadata.json');

  if (!fs.existsSync(metadataFile)) {
    throw new Error(`Project ${projectId} not found`);
  }

  return JSON.parse(fs.readFileSync(metadataFile, 'utf-8'));
}

function listProjects() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    return [];
  }

  const projects = [];
  const dirs = fs.readdirSync(PROJECTS_DIR);

  dirs.forEach(dir => {
    try {
      const metadataFile = path.join(PROJECTS_DIR, dir, 'metadata.json');
      if (fs.existsSync(metadataFile)) {
        const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf-8'));
        projects.push(metadata);
      }
    } catch (err) {
      console.error(`Error reading project ${dir}:`, err);
    }
  });

  // Sort by creation date, newest first
  return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getProjectDir(projectId) {
  return path.join(PROJECTS_DIR, projectId);
}

function updateProjectPhase(projectId, phase) {
  const project = getProject(projectId);
  project.currentPhase = phase;

  if (!project.completedPhases.includes(phase - 1)) {
    project.completedPhases.push(phase - 1);
  }

  const projectDir = getProjectDir(projectId);
  fs.writeFileSync(
    path.join(projectDir, 'metadata.json'),
    JSON.stringify(project, null, 2)
  );

  return project;
}

module.exports = {
  createProject,
  getProject,
  listProjects,
  getProjectDir,
  updateProjectPhase
};
