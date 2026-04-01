import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

const SECTORS = [
  'Education',
  'Legal Services',
  'E-commerce',
  'Healthcare',
  'Real Estate',
  'Fitness',
  'Finance',
  'Technology',
  'Other'
];

function NewCampaign() {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    sector: 'General',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.topic.trim() || !formData.description.trim()) {
      setError('Topic and description are required');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/campaigns', formData);
      const { campaignId } = response.data;
      navigate(`/campaign/${campaignId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create campaign');
      setLoading(false);
    }
  };

  return (
    <div className="page new-campaign-page">
      <header className="page-header">
        <button className="icon-btn back" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>Create New Campaign</h1>
          <p>Generate a bilingual Meta ad campaign brief</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="topic">Campaign Topic *</label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="e.g., Teachers age 28-40 interested in online education"
            required
          />
          <small>Who are you targeting?</small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Detailed Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the audience, their interests, pain points, and what you want them to do..."
            rows="6"
            required
          />
          <small>Provide as much context as possible</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sector">Sector</label>
            <select
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
            >
              {SECTORS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special requirements or considerations..."
            rows="3"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Campaign Brief'}
          </button>
        </div>
      </form>

      <div className="info-box">
        <h3>💡 Tips</h3>
        <ul>
          <li>Be specific about the audience age range and demographics</li>
          <li>Include interests, pain points, and behaviors</li>
          <li>Mention the desired outcome (leads, sales, signups, etc.)</li>
          <li>Note any geographic focus or budget constraints</li>
          <li>Describe the competitive landscape if relevant</li>
        </ul>
      </div>
    </div>
  );
}

export default NewCampaign;
