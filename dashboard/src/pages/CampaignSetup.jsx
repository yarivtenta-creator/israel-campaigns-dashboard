import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Campaign.css';

export default function CampaignSetup() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [campaignName, setCampaignName] = useState('');

  const handleNext = () => {
    navigate(`/project/${projectId}/phase/5`);
  };

  const handleBack = () => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="campaign-page">
      <button className="btn-back" onClick={handleBack}>← Back</button>

      <div className="campaign-container">
        <h1>🎯 Campaign Setup</h1>
        <p>Define your campaign parameters and ad strategy</p>

        <div className="form-group">
          <label htmlFor="campaignName">Campaign Name</label>
          <input
            id="campaignName"
            type="text"
            placeholder="e.g., Q2 Product Launch"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </div>

        <div className="info-section">
          <h2>Campaign Strategy:</h2>
          <ul>
            <li>Define campaign objectives</li>
            <li>Set target audience segments</li>
            <li>Choose ad formats and platforms</li>
            <li>Plan budget allocation</li>
          </ul>
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={handleNext}>
            Continue to Copy Generation →
          </button>
          <button className="btn-secondary" onClick={handleBack}>
            Back to Project
          </button>
        </div>
      </div>
    </div>
  );
}
