const express = require('express');
const router = express.Router();
const projectService = require('../services/project-service');

// Create new project
router.post('/', (req, res) => {
  try {
    const { projectName } = req.body;

    if (!projectName || !projectName.trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = projectService.createProject(projectName);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// List all projects
router.get('/', (req, res) => {
  try {
    const projects = projectService.listProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error listing projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projectService.getProject(projectId);
    res.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
