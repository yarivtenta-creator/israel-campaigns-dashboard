import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProjectHome.css';

const PHASES = [
  { num: 1, name: 'Materials', icon: '📎', path: '/phase/1', optional: false },
  { num: 2, name: 'Analysis', icon: '📊', path: '/phase/2', optional: true },
  { num: 3, name: 'Research', icon: '🔍', path: '/phase/3', optional: true },
  { num: 4, name: 'Campaign', icon: '🎯', path: '/phase/4', optional: true },
  { num: 5, name: 'Copy', icon: '✍️', path: '/phase/5', optional: true },
  { num: 6, name: 'Prompts', icon: '🎨', path: '/phase/6', optional: true },
  { num: 7, name: 'Assets', icon: '🖼️', path: '/phase/7', optional: false }
];

export default function ProjectHome() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load project');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="project-home">
        <div className="loading">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-home">
        <div className="error">{error || 'Project not found'}</div>
      </div>
    );
  }

  const handlePhaseClick = (phase) => {
    navigate(`/project/${projectId}${phase.path}`);
  };

  return (
    <div className="project-home">
      <div className="project-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <div>
          <h1>{project.projectName}</h1>
          <p>Phase {project.currentPhase} of 7</p>
        </div>
      </div>

      <div className="phases-timeline">
        {PHASES.map((phase) => {
          const isCompleted = project.completedPhases?.includes(phase.num - 1);
          const isCurrent = project.currentPhase === phase.num;

          return (
            <div
              key={phase.num}
              className={`phase-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => handlePhaseClick(phase)}
            >
              <div className="phase-icon">{phase.icon}</div>
              <div className="phase-info">
                <div className="phase-name">{phase.name}</div>
                <div className="phase-num">Phase {phase.num}</div>
                {phase.optional && <span className="optional-badge">Optional</span>}
                {isCompleted && <span className="completed-badge">✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="phase-description">
        <h2>Current Phase</h2>
        <div className="description-card">
          {PHASES[project.currentPhase - 1] && (
            <>
              <h3>{PHASES[project.currentPhase - 1].icon} {PHASES[project.currentPhase - 1].name}</h3>
              <p>
                {project.currentPhase === 1 && 'Upload or paste materials to promote. URLs, text, or files.'}
                {project.currentPhase === 2 && 'System analyzes materials to extract keywords, positioning, and ad angles.'}
                {project.currentPhase === 3 && 'Research competitors and market landscape.'}
                {project.currentPhase === 4 && 'Create campaign configuration from analysis data.'}
                {project.currentPhase === 5 && 'Generate 5 different ad copy variations.'}
                {project.currentPhase === 6 && 'Create image generation prompts for each ad format.'}
                {project.currentPhase === 7 && 'Generate and organize final assets.'}
              </p>
              <button
                className="btn-primary"
                onClick={() => handlePhaseClick(PHASES[project.currentPhase - 1])}
              >
                Start Phase {project.currentPhase}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
