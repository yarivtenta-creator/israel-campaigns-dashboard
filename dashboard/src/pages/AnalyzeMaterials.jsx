import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Analysis.css';

export default function AnalyzeMaterials() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [tab, setTab] = useState('positioning');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, [projectId]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/analysis/${projectId}`);
      setAnalysis(response.data);
    } catch (err) {
      // Analysis hasn't been done yet - show button to trigger
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const response = await axios.post(`/api/analysis/${projectId}/analyze`);
      setAnalysis(response.data);
    } catch (err) {
      setError(`Analysis failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleContinue = () => {
    navigate(`/project/${projectId}/phase/3`);
  };

  const handleSkip = () => {
    navigate(`/project/${projectId}/phase/4`);
  };

  if (loading) {
    return <div className="analysis-page"><div className="loading">Loading analysis...</div></div>;
  }

  if (!analysis) {
    return (
      <div className="analysis-page">
        <div className="analysis-container">
          <h1>📊 Analyze Materials</h1>
          <p>System extracts keywords, positioning, and ad angles from your materials</p>

          {error && <div className="error-message">{error}</div>}

          <div className="action-card">
            <p>Ready to analyze your materials and extract key insights?</p>
            <button
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? <>
                <span className="spinner"></span>
                Analyzing...
              </> : '▶ Start Analysis'}
            </button>
          </div>

          <div className="info-section">
            <h2>What will be extracted:</h2>
            <div className="info-grid">
              <div className="info-item">Keywords</div>
              <div className="info-item">Positioning</div>
              <div className="info-item">Ad Angles</div>
              <div className="info-item">Themes</div>
              <div className="info-item">Demographics</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <div className="analysis-container">
        <h1>📊 Analysis Results</h1>

        <div className="tabs">
          <button className={`tab ${tab === 'positioning' ? 'active' : ''}`} onClick={() => setTab('positioning')}>
            Positioning
          </button>
          <button className={`tab ${tab === 'keywords' ? 'active' : ''}`} onClick={() => setTab('keywords')}>
            Keywords
          </button>
          <button className={`tab ${tab === 'angles' ? 'active' : ''}`} onClick={() => setTab('angles')}>
            Ad Angles
          </button>
          <button className={`tab ${tab === 'audience' ? 'active' : ''}`} onClick={() => setTab('audience')}>
            Audience
          </button>
        </div>

        <div className="tab-content">
          {tab === 'positioning' && (
            <div>
              <h2>Value Proposition</h2>
              <p>{analysis.positioning?.unique_value || 'Not available'}</p>

              <h2>Target Audience</h2>
              <p>{analysis.positioning?.target_audience || 'Not available'}</p>

              <h2>Advantages</h2>
              <ul>
                {analysis.positioning?.advantages?.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                )) || <li>Not available</li>}
              </ul>

              <h2>Pain Points</h2>
              <ul>
                {analysis.positioning?.pain_points?.map((pain, idx) => (
                  <li key={idx}>{pain}</li>
                )) || <li>Not available</li>}
              </ul>
            </div>
          )}

          {tab === 'keywords' && (
            <div>
              <h2>Primary Keywords</h2>
              <div className="keyword-tags">
                {analysis.keywords?.primary?.map((kw, idx) => (
                  <span key={idx} className="tag primary">{kw}</span>
                )) || <span>None</span>}
              </div>

              <h2>Long-Tail Keywords</h2>
              <div className="keyword-tags">
                {analysis.keywords?.longtail?.map((kw, idx) => (
                  <span key={idx} className="tag longtail">{kw}</span>
                )) || <span>None</span>}
              </div>

              <h2>Negative Keywords</h2>
              <div className="keyword-tags">
                {analysis.keywords?.negative?.map((kw, idx) => (
                  <span key={idx} className="tag negative">{kw}</span>
                )) || <span>None</span>}
              </div>
            </div>
          )}

          {tab === 'angles' && (
            <div>
              <h2>7 Ad Angles</h2>
              <div className="angles-list">
                {analysis.ad_angles?.map((angle, idx) => (
                  <div key={idx} className="angle-item">{angle}</div>
                )) || <p>Not available</p>}
              </div>
            </div>
          )}

          {tab === 'audience' && (
            <div>
              <h2>Demographics</h2>
              {analysis.demographics ? (
                <>
                  <p><strong>Age Range:</strong> {analysis.demographics.age_range}</p>
                  <p><strong>Interests:</strong></p>
                  <ul>
                    {analysis.demographics.interests?.map((interest, idx) => (
                      <li key={idx}>{interest}</li>
                    ))}
                  </ul>
                  <p><strong>Behaviors:</strong></p>
                  <ul>
                    {analysis.demographics.behaviors?.map((behavior, idx) => (
                      <li key={idx}>{behavior}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Not available</p>
              )}

              <h2>Themes</h2>
              <div className="keyword-tags">
                {analysis.themes?.map((theme, idx) => (
                  <span key={idx} className="tag theme">{theme}</span>
                )) || <span>None</span>}
              </div>
            </div>
          )}
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={handleContinue}>
            Continue to Research →
          </button>
          <button className="btn-secondary" onClick={handleSkip}>
            Skip to Campaign →
          </button>
        </div>
      </div>
    </div>
  );
}
