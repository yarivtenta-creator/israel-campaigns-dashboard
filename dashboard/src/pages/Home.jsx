import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2 } from 'lucide-react';
import axios from 'axios';
import '../styles/Home.css';

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const response = await axios.post('/api/projects', {
        projectName: projectName.trim()
      });

      setProjectName('');
      setShowModal(false);

      // Navigate to the new project's first phase
      navigate(`/project/${response.data.projectId}/phase/1`);
    } catch (err) {
      setError(`Failed to create project: ${err.response?.data?.error || err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete this project and all its data?')) return;

    try {
      // TODO: Implement delete endpoint
      alert('Delete functionality coming soon');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <div className="home-page">
      <header className="dashboard-header">
        <h1>🎯 Israel Meta Campaigns Dashboard</h1>
        <p>Create bilingual ad campaigns - 7-phase workflow</p>
      </header>

      <div className="action-bar">
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h2>No projects yet</h2>
          <p>Create your first project to start the 7-phase workflow</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} /> Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div
              key={project.projectId}
              className="project-card"
              onClick={() => navigate(`/project/${project.projectId}`)}
            >
              <div className="project-content">
                <h3>{project.projectName}</h3>
                <div className="project-meta">
                  <span className="phase-badge">Phase {project.currentPhase}/7</span>
                  <span className="date">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="project-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(project.currentPhase / 7) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="project-actions"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="icon-btn"
                  title="Open"
                  onClick={() => navigate(`/project/${project.projectId}`)}
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Create New Project</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label htmlFor="projectName">Project Name *</label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Israeli Tech Startup Campaign"
                  disabled={creating}
                  autoFocus
                />
                <small>Client or project name - used to organize all phases</small>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating || !projectName.trim()}
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
