import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Campaign.css';

export default function GenerateAssets() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [assets] = useState([
    { id: 1, type: 'Image', status: 'Generated', size: '1200x628' },
    { id: 2, type: 'Image', status: 'Generated', size: '1200x628' },
  ]);

  const handleBack = () => {
    navigate(`/project/${projectId}`);
  };

  const handleExport = () => {
    alert('Export functionality coming soon!');
  };

  return (
    <div className="campaign-page">
      <button className="btn-back" onClick={handleBack}>← Back</button>

      <div className="campaign-container">
        <h1>🖼️ Generate Assets</h1>
        <p>Create final ad assets ready for deployment</p>

        <div className="assets-section">
          <h2>Generated Assets ({assets.length})</h2>
          {assets.map((asset) => (
            <div key={asset.id} className="asset-card">
              <span className="type-tag">{asset.type}</span>
              <div className="asset-info">
                <p><strong>Status:</strong> {asset.status}</p>
                <p><strong>Size:</strong> {asset.size}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="info-section">
          <h2>Campaign Summary:</h2>
          <ul>
            <li>✅ Phase 1: Materials Collected</li>
            <li>⏭️ Phase 2: Analysis Skipped</li>
            <li>⏭️ Phase 3: Research Skipped</li>
            <li>✅ Phase 4: Campaign Setup</li>
            <li>✅ Phase 5: Copy Generated</li>
            <li>✅ Phase 6: Image Prompts</li>
            <li>✅ Phase 7: Assets Generated</li>
          </ul>
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={handleExport}>
            📥 Export Campaign
          </button>
          <button className="btn-secondary" onClick={handleBack}>
            Back to Project
          </button>
        </div>
      </div>
    </div>
  );
}
