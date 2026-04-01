import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResearchViewer from '../components/ResearchViewer';
import '../styles/ResearchResults.css';

const TABS = [
  { id: 'overview', label: '📋 Overview', icon: '📊' },
  { id: 'meta', label: '🎯 Meta Intelligence', icon: '📱' },
  { id: 'google', label: '🔍 Google Insights', icon: '📈' },
  { id: 'synthesis', label: '🧠 Insights & Strategy', icon: '💡' },
  { id: 'report', label: '📄 Full Report', icon: '📑' }
];

export default function ResearchResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    fetchResearchData();
  }, [id]);

  const fetchResearchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get research status
      const statusRes = await axios.get(`/api/research/${id}/status`);
      setMetadata(statusRes.data);

      // Get all research results
      const resultsRes = await axios.get(`/api/research/${id}/results`);
      setData(resultsRes.data);
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Error loading research';
      setError(message);
      console.error('Error fetching research:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAds = () => {
    navigate(`/research/${id}/ads`);
  };

  const handleSaveToCampaign = async () => {
    try {
      setActionLoading(true);
      setError('');

      const response = await axios.post(`/api/research/${id}/save-to-campaign`);
      const { campaignId } = response.data;

      // Redirect to new campaign
      navigate(`/campaign/${campaignId}`);
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to save campaign';
      setError(message);
      alert(`Error: ${message}`);
      console.error('Save to campaign error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setActionLoading(true);
      setError('');

      const format = 'json'; // Default to JSON export

      const response = await axios.get(
        `/api/research/${id}/export/${format}`,
        { responseType: 'json' }
      );

      // Download file
      const element = document.createElement('a');
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });

      element.href = URL.createObjectURL(blob);
      element.download = `research-${id}.${format}`;
      element.click();

      // Cleanup
      URL.revokeObjectURL(element.href);
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to export research';
      setError(message);
      alert(`Error: ${message}`);
      console.error('Export research error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading research data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/research')} className="btn-secondary">
            Back to Research
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <TabOverview data={data} metadata={metadata} />;
      case 'meta':
        return <ResearchViewer data={data.competitive_analysis} title="Meta Competitive Intelligence" />;
      case 'google':
        return <ResearchViewer data={data.articles_analysis} title="Google Insights" />;
      case 'synthesis':
        return <TabSynthesis data={data.synthesis} />;
      case 'report':
        return <ResearchViewer data={data.research_report} title="Full Research Report" />;
      default:
        return null;
    }
  };

  if (!data && !loading && !error) {
    return (
      <div className="research-results">
        <div className="empty-state">
          <p>No research data available</p>
          <button onClick={() => navigate('/research')} className="btn-primary">
            Start New Research
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="research-results">
      <div className="research-header">
        <div className="header-content">
          <h1>📊 Research Results</h1>
          {metadata && (
            <div className="header-meta">
              <p className="topic">{metadata.topic}</p>
              <p className="status">Status: <strong>{metadata.status}</strong></p>
            </div>
          )}
        </div>
        <div className="header-actions">
          <button onClick={handleGenerateAds} className="btn-primary" disabled={actionLoading}>
            ✨ Generate Ads
          </button>
          <button onClick={handleSaveToCampaign} className="btn-secondary" disabled={actionLoading}>
            {actionLoading ? '⏳ Saving...' : '💾 Save to Campaign'}
          </button>
          <button onClick={handleExport} className="btn-secondary" disabled={actionLoading}>
            {actionLoading ? '⏳ Exporting...' : '📥 Export'}
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
}

// Tab: Overview
function TabOverview({ data, metadata }) {
  return (
    <div className="tab-overview">
      <div className="overview-grid">
        <div className="overview-card">
          <h3>📋 Research Summary</h3>
          {metadata && (
            <div className="summary-content">
              <p><strong>Topic:</strong> {metadata.topic}</p>
              <p><strong>Status:</strong> {metadata.status}</p>
              <p><strong>Completed:</strong> {new Date(metadata.timestamp).toLocaleString()}</p>
            </div>
          )}
        </div>

        {data?.synthesis && (
          <div className="overview-card">
            <h3>💡 Primary Insight</h3>
            <p className="insight-text">{data.synthesis.primaryInsight}</p>
            <p className="confidence">Confidence: {(data.synthesis.confidence * 100).toFixed(0)}%</p>
          </div>
        )}

        {data?.synthesis?.competitiveDifferentiation && (
          <div className="overview-card">
            <h3>🎯 Competitive Gap</h3>
            <p>{data.synthesis.competitiveDifferentiation.gapIdentified}</p>
          </div>
        )}

        {data?.synthesis?.recommendations && (
          <div className="overview-card">
            <h3>🚀 Top Recommendation</h3>
            <p><strong>{data.synthesis.recommendations[0]?.action}</strong></p>
            <p className="description">{data.synthesis.recommendations[0]?.rationale}</p>
          </div>
        )}

        {data?.competitive_analysis && (
          <div className="overview-card">
            <h3>🏆 Competitors Analyzed</h3>
            <div className="competitor-list">
              {Object.keys(data.competitive_analysis.competitors || {}).map(name => (
                <div key={name} className="competitor-badge">
                  {name}
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.articles_analysis && (
          <div className="overview-card">
            <h3>📚 Sources Analyzed</h3>
            <p className="stat">{data.articles_analysis.articlesAnalyzed} articles</p>
            <p className="stat">{data.articles_analysis.statistics?.length || 0} statistics</p>
            <p className="stat">{data.articles_analysis.trends?.length || 0} trends identified</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Tab: Synthesis
function TabSynthesis({ data }) {
  if (!data) {
    return <div className="no-data">No synthesis data available</div>;
  }

  return (
    <div className="tab-synthesis">
      <div className="synthesis-section">
        <h3>🎯 Market Opportunity</h3>
        <p>{data.marketOpportunity}</p>
      </div>

      {data.recommendations && (
        <div className="synthesis-section">
          <h3>📌 Strategic Recommendations</h3>
          <div className="recommendations-list">
            {data.recommendations.map((rec, idx) => (
              <div key={idx} className="recommendation-card">
                <div className="priority-badge">Priority {rec.priority}</div>
                <h4>{rec.action}</h4>
                <p className="rationale">{rec.rationale}</p>
                <div className="rec-meta">
                  <span>Timeline: {rec.timeline}</span>
                  <span>Impact: {rec.expectedImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.marketOpportunities && (
        <div className="synthesis-section">
          <h3>🌱 Market Opportunities</h3>
          <div className="opportunities-grid">
            {data.marketOpportunities.map((opp, idx) => (
              <div key={idx} className="opportunity-card">
                <h4>{opp.opportunity}</h4>
                <p><strong>Size:</strong> {opp.size}</p>
                <p><strong>Competition:</strong> {opp.competition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
