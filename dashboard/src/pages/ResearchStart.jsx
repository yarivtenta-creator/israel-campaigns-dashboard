import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResearchStart.css';

const SECTORS = [
  'Education',
  'Healthcare',
  'E-commerce',
  'Legal Services',
  'Real Estate',
  'Fitness',
  'Accounting',
  'Auto',
  'Technology',
  'Finance',
  'Hospitality',
  'Other'
];

const RESEARCH_DEPTHS = [
  { value: 'quick', label: 'Quick (1 hour)', description: '5 sources, basic insights' },
  { value: 'standard', label: 'Standard (2-3 hours)', description: '10 sources, detailed analysis' },
  { value: 'comprehensive', label: 'Comprehensive (half-day)', description: '15+ sources, deep insights' }
];

export default function ResearchStart() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(projectId ? true : false);
  const [error, setError] = useState('');
  const [suggestedCompetitors, setSuggestedCompetitors] = useState([]);
  const [autoDiscoverEnabled, setAutoDiscoverEnabled] = useState(false);

  const [formData, setFormData] = useState({
    topic: '',
    competitors: '',
    sector: 'Education',
    depth: 'standard',
    languages: ['Hebrew', 'English'],
    notes: ''
  });

  // Fetch and pre-fill analysis data if projectId provided
  useEffect(() => {
    if (projectId) {
      fetchAnalysisData();
    } else {
      setInitializing(false);
    }
  }, [projectId]);

  const fetchAnalysisData = async () => {
    try {
      const response = await axios.get(`/api/analysis/${projectId}`);
      const analysis = response.data;

      // Pre-fill topic from positioning
      const topic = analysis.positioning?.unique_value ||
                   analysis.themes?.[0] ||
                   analysis.positioning?.target_audience || '';

      // Determine sector from themes
      let sector = 'Education';
      if (analysis.themes?.length > 0) {
        const themeText = analysis.themes.join(' ').toLowerCase();
        if (themeText.includes('health') || themeText.includes('medical')) sector = 'Healthcare';
        else if (themeText.includes('tech') || themeText.includes('software')) sector = 'Technology';
        else if (themeText.includes('real estate') || themeText.includes('property')) sector = 'Real Estate';
        else if (themeText.includes('finance') || themeText.includes('investment')) sector = 'Finance';
        else if (themeText.includes('shop') || themeText.includes('ecommerce')) sector = 'E-commerce';
      }

      // Extract suggested competitors from themes
      const competitors = analysis.themes?.filter(t =>
        t.length > 2 && !t.includes(' ') && t !== topic
      )?.slice(0, 3) || [];

      setFormData(prev => ({
        ...prev,
        topic,
        sector,
        competitors: ''
      }));

      setSuggestedCompetitors(competitors);
      setAutoDiscoverEnabled(true);
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError('Could not load analysis data');
    } finally {
      setInitializing(false);
    }
  };

  const addSuggestedCompetitor = (competitor) => {
    setFormData(prev => {
      const existing = prev.competitors
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (!existing.includes(competitor)) {
        existing.push(competitor);
      }

      return {
        ...prev,
        competitors: existing.join(', ')
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'languages') {
      setFormData(prev => ({
        ...prev,
        languages: checked
          ? [...prev.languages, value]
          : prev.languages.filter(lang => lang !== value)
      }));
    } else if (type === 'checkbox' && name === 'autoDiscover') {
      setAutoDiscoverEnabled(checked);
      if (checked && suggestedCompetitors.length > 0) {
        setFormData(prev => ({
          ...prev,
          competitors: suggestedCompetitors.join(', ')
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkip = () => {
    if (projectId) {
      navigate(`/project/${projectId}/phase/4`);
    } else {
      navigate('/new');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.topic.trim()) {
        throw new Error('Please enter a research topic');
      }
      if (!formData.competitors.trim()) {
        throw new Error('Please enter at least one competitor');
      }

      // Parse competitors (comma-separated)
      const competitors = formData.competitors
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (competitors.length === 0) {
        throw new Error('Please enter valid competitor names');
      }

      // Start research
      const response = await axios.post('/api/research/conduct', {
        topic: formData.topic,
        competitors,
        sector: formData.sector,
        depth: formData.depth,
        languages: formData.languages,
        projectId: projectId || null
      });

      if (response.data.researchId) {
        // Navigate to results page (or next phase if projectId)
        if (projectId) {
          navigate(`/project/${projectId}/phase/4`, {
            state: { researchId: response.data.researchId }
          });
        } else {
          navigate(`/research/${response.data.researchId}`);
        }
      } else {
        throw new Error('Failed to start research');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error starting research');
      console.error('Research error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="research-start">
        <div className="research-container">
          <div className="research-header">
            <h1>🔍 Loading Analysis...</h1>
            <p>Retrieving campaign data to pre-fill research fields</p>
          </div>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="research-start">
      <div className="research-container">
        <div className="research-header">
          <h1>🔍 Research Your Market</h1>
          <p>Comprehensive audience, competitor, and market research with bilingual support</p>
        </div>

        <form onSubmit={handleSubmit} className="research-form">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Topic Input */}
          <div className="form-group">
            <label htmlFor="topic">Research Topic *</label>
            <textarea
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Teachers age 28-45 interested in online education tools"
              rows="3"
              disabled={loading}
            />
            <small>Describe your target audience and what you want to research</small>
          </div>

          {/* Competitors Input */}
          <div className="form-group">
            <label htmlFor="competitors">Competitors *</label>
            {autoDiscoverEnabled && suggestedCompetitors.length > 0 && (
              <div className="suggested-competitors">
                <small>Suggested from analysis:</small>
                <div className="competitor-chips">
                  {suggestedCompetitors.map((comp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="competitor-chip"
                      onClick={() => addSuggestedCompetitor(comp)}
                    >
                      + {comp}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <textarea
              id="competitors"
              name="competitors"
              value={formData.competitors}
              onChange={handleChange}
              placeholder="e.g., Wix, Squarespace, WordPress"
              rows="2"
              disabled={loading}
            />
            <small>Comma-separated list of 2-5 competitors to analyze</small>
          </div>

          {/* Auto-discover Checkbox */}
          {suggestedCompetitors.length > 0 && (
            <div className="form-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="autoDiscover"
                  checked={autoDiscoverEnabled}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Auto-discover competitors from analysis</span>
              </label>
            </div>
          )}

          {/* Sector Selection */}
          <div className="form-group">
            <label htmlFor="sector">Industry Sector</label>
            <select
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              disabled={loading}
            >
              {SECTORS.map(sector => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Research Depth */}
          <div className="form-group">
            <label>Research Depth</label>
            <div className="depth-options">
              {RESEARCH_DEPTHS.map(option => (
                <label key={option.value} className="radio-option">
                  <input
                    type="radio"
                    name="depth"
                    value={option.value}
                    checked={formData.depth === option.value}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <div className="option-content">
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="form-group">
            <label>Languages</label>
            <div className="language-options">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="languages"
                  value="Hebrew"
                  checked={formData.languages.includes('Hebrew')}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Hebrew (עברית)</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="languages"
                  value="English"
                  checked={formData.languages.includes('English')}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>English</span>
              </label>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any specific research focus or questions? (optional)"
              rows="2"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Starting Research...
                </>
              ) : (
                '▶ Start Research'
              )}
            </button>
            {projectId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleSkip}
                disabled={loading}
              >
                ⊳ Skip to Campaign
              </button>
            )}
          </div>
        </form>

        {/* Info Section */}
        <div className="research-info">
          <h3>📊 What You'll Get</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>🎯 Competitive Intelligence</h4>
              <p>Extract competitor ads from Meta and Google with messaging analysis</p>
            </div>
            <div className="info-card">
              <h4>📚 Market Insights</h4>
              <p>10+ sources analyzed for trends, statistics, and audience segments</p>
            </div>
            <div className="info-card">
              <h4>🧠 Synthesized Findings</h4>
              <p>Patterns identified across all sources with actionable recommendations</p>
            </div>
            <div className="info-card">
              <h4>🌍 Bilingual Report</h4>
              <p>Complete research in Hebrew and English with full citations</p>
            </div>
            <div className="info-card">
              <h4>💬 Messaging Framework</h4>
              <p>Primary and supporting angles with proof points and CTAs</p>
            </div>
            <div className="info-card">
              <h4>🎨 Ad Suggestions</h4>
              <p>AI-generated ad copy variations based on research findings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
