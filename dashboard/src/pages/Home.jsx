import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2, GitCompare } from 'lucide-react';
import axios from 'axios';

function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/api/campaigns');
      setCampaigns(response.data.campaigns || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;

    try {
      await axios.delete(`/api/campaigns/${id}`);
      setCampaigns(campaigns.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const handleCompare = () => {
    if (selected.length < 2) {
      alert('Select at least 2 campaigns to compare');
      return;
    }
    navigate(`/compare?ids=${selected.join(',')}`);
  };

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎯 Israel Meta Campaigns</h1>
        <p>Manage bilingual ad campaigns for Israeli markets</p>
      </header>

      <div className="action-bar">
        <button className="btn btn-primary" onClick={() => navigate('/research')}>
          📊 Start Research
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/new')}>
          <Plus size={20} /> New Campaign
        </button>
        {selected.length >= 2 && (
          <button className="btn btn-secondary" onClick={handleCompare}>
            <GitCompare size={20} /> Compare ({selected.length})
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="empty-state">
          <h2>No campaigns yet</h2>
          <p>Create your first campaign to get started</p>
          <button className="btn btn-primary" onClick={() => navigate('/new')}>
            <Plus size={20} /> Create Campaign
          </button>
        </div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map(campaign => (
            <div
              key={campaign.id}
              className={`campaign-card ${selected.includes(campaign.id) ? 'selected' : ''}`}
              onClick={() => toggleSelect(campaign.id)}
            >
              <input
                type="checkbox"
                checked={selected.includes(campaign.id)}
                onChange={() => toggleSelect(campaign.id)}
                onClick={e => e.stopPropagation()}
              />

              <div className="campaign-content" onClick={() => navigate(`/campaign/${campaign.id}`)}>
                <h3>{campaign.topic}</h3>
                <p className="sector">{campaign.sector}</p>
                <p className="description">{campaign.description?.substring(0, 100)}...</p>
                <div className="meta">
                  <span className={`status ${campaign.status}`}>{campaign.status}</span>
                  <span className="date">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="campaign-actions" onClick={e => e.stopPropagation()}>
                <button
                  className="icon-btn"
                  title="View"
                  onClick={() => navigate(`/campaign/${campaign.id}`)}
                >
                  <Eye size={18} />
                </button>
                <button
                  className="icon-btn danger"
                  title="Delete"
                  onClick={() => handleDelete(campaign.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
