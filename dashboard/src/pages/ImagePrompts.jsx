import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Campaign.css';

export default function ImagePrompts() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [prompts] = useState([
    { id: 1, format: 'Carousel', prompt: 'Modern tech dashboard, Israeli design, professional gradient' },
    { id: 2, format: 'Single Image', prompt: 'CEO at desk, thoughtful expression, startup office' },
  ]);

  const handleNext = () => {
    navigate(`/project/${projectId}/phase/7`);
  };

  const handleBack = () => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="campaign-page">
      <button className="btn-back" onClick={handleBack}>← Back</button>

      <div className="campaign-container">
        <h1>🎨 Image Prompts</h1>
        <p>Generate AI image prompts for different ad formats</p>

        <div className="prompts-section">
          <h2>Generated Prompts ({prompts.length})</h2>
          {prompts.map((prompt) => (
            <div key={prompt.id} className="prompt-card">
              <span className="format-tag">{prompt.format}</span>
              <p>{prompt.prompt}</p>
            </div>
          ))}
        </div>

        <div className="info-section">
          <h2>Supported Formats:</h2>
          <ul>
            <li>Carousel Ads (Multiple images)</li>
            <li>Single Image Ads</li>
            <li>Story Ads (Vertical)</li>
            <li>Video Thumbnails</li>
            <li>Collection Ads</li>
          </ul>
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={handleNext}>
            Continue to Generate Assets →
          </button>
          <button className="btn-secondary" onClick={handleBack}>
            Back to Project
          </button>
        </div>
      </div>
    </div>
  );
}
