import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../config/axiosConfig';
import '../styles/Materials.css';

export default function AddMaterials() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [tab, setTab] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [materials, setMaterials] = useState([]);

  // Text input
  const [textInput, setTextInput] = useState('');

  // URL input
  const [urlInput, setUrlInput] = useState('');

  // File input
  const [fileInput, setFileInput] = useState(null);

  const handleAddText = async () => {
    if (!textInput.trim()) {
      setError('Please enter text');
      return;
    }

    const newMaterial = {
      type: 'text',
      content: textInput,
      addedAt: new Date().toISOString()
    };

    setMaterials([...materials, newMaterial]);
    setTextInput('');
    setError('');
  };

  const handleScrapeUrl = async () => {
    if (!urlInput.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Scraping URL:', urlInput);
      const response = await axiosInstance.post(`/api/materials/${projectId}/scrape`, {
        url: urlInput
      });

      console.log('Scrape response:', response.data);
      const newMaterial = {
        ...response.data,
        type: 'url'
      };
      setMaterials([...materials, newMaterial]);
      setUrlInput('');
      console.log('URL scraped successfully');
    } catch (err) {
      console.error('Scrape error:', err);
      setError(`Failed to scrape URL: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post(`/api/materials/${projectId}/upload`, formData);

      setMaterials([...materials, response.data]);
      setFileInput(null);
    } catch (err) {
      setError(`Failed to upload file: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleSaveMaterials = async () => {
    if (materials.length === 0) {
      setError('Please add at least one material');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`/api/materials/${projectId}/save`, {
        materials
      });

      // Navigate to analysis phase
      navigate(`/project/${projectId}/phase/2`);
    } catch (err) {
      setError(`Failed to save materials: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate(`/project/${projectId}/phase/3`);
  };

  return (
    <div className="materials-page">
      <div className="materials-container">
        <h1>📎 Add Materials</h1>
        <p>Collect what you want to promote and supporting materials</p>

        {error && <div className="error-message">{error}</div>}

        <div className="tabs">
          <button
            className={`tab ${tab === 'text' ? 'active' : ''}`}
            onClick={() => setTab('text')}
          >
            Paste Text
          </button>
          <button
            className={`tab ${tab === 'url' ? 'active' : ''}`}
            onClick={() => setTab('url')}
          >
            Scrape URL
          </button>
          <button
            className={`tab ${tab === 'file' ? 'active' : ''}`}
            onClick={() => setTab('file')}
          >
            Upload File
          </button>
        </div>

        <div className="tab-content">
          {tab === 'text' && (
            <div className="form-group">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your content here..."
                rows="6"
              />
              <button className="btn-secondary" onClick={handleAddText} disabled={loading}>
                Add Text
              </button>
            </div>
          )}

          {tab === 'url' && (
            <div className="form-group">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
              />
              <button className="btn-secondary" onClick={handleScrapeUrl} disabled={loading}>
                {loading ? 'Scraping...' : 'Scrape URL'}
              </button>
            </div>
          )}

          {tab === 'file' && (
            <div className="form-group">
              <input
                type="file"
                onChange={handleUploadFile}
                disabled={loading}
              />
              <small>PDF, Word, or image files accepted</small>
            </div>
          )}
        </div>

        <div className="materials-list">
          <h2>Collected Materials ({materials.length})</h2>
          {materials.length === 0 ? (
            <p className="empty">No materials added yet</p>
          ) : (
            <div className="material-items">
              {materials.map((material, idx) => (
                <div key={idx} className="material-item">
                  <div className="material-header">
                    <span className="material-type">
                      {material.type === 'text' && '📝'}
                      {material.type === 'url' && '🔗'}
                      {material.type === 'file' && '📄'}
                    </span>
                    <div className="material-info">
                      {material.type === 'text' && (
                        <>
                          <strong>Text</strong>
                          <p>{material.content.substring(0, 100)}...</p>
                        </>
                      )}
                      {material.type === 'url' && (
                        <>
                          <strong>{material.title || 'URL'}</strong>
                          <p>{material.description?.substring(0, 100) || material.url}</p>
                        </>
                      )}
                      {material.type === 'file' && (
                        <>
                          <strong>{material.filename}</strong>
                          <p>{material.mimeType}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveMaterial(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="button-group">
          <button
            className="btn-primary"
            onClick={handleSaveMaterials}
            disabled={loading || materials.length === 0}
          >
            {loading ? 'Saving...' : 'Continue to Analysis →'}
          </button>
          <button className="btn-secondary" onClick={handleSkip} disabled={loading}>
            Skip to Research →
          </button>
        </div>
      </div>
    </div>
  );
}
