import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Campaign.css';

export default function GenerateCopy() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [variations, setVariations] = useState([
    { id: 1, angle: 'Pain-Point', copy: 'Fed up with inefficient workflows? Our solution saves 30% on operational costs.' },
    { id: 2, angle: 'Solution', copy: 'Streamline your business with AI-powered automation. Deploy in minutes.' },
  ]);

  const handleNext = () => {
    navigate(`/project/${projectId}/phase/6`);
  };

  const handleBack = () => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="campaign-page">
      <button className="btn-back" onClick={handleBack}>← Back</button>

      <div className="campaign-container">
        <h1>✍️ Generate Ad Copy</h1>
        <p>Create multiple ad variations using different angles and tones</p>

        <div className="variations-section">
          <h2>Generated Variations ({variations.length})</h2>
          {variations.map((variation) => (
            <div key={variation.id} className="variation-card">
              <span className="angle-tag">{variation.angle}</span>
              <p>{variation.copy}</p>
            </div>
          ))}
        </div>

        <div className="info-section">
          <h2>Available Angles:</h2>
          <ul>
            <li>Pain-Point Solving</li>
            <li>Solution Focused</li>
            <li>Social Proof</li>
            <li>Urgency Driven</li>
            <li>Value Proposition</li>
            <li>Ease of Use</li>
            <li>Storytelling</li>
          </ul>
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={handleNext}>
            Continue to Image Prompts →
          </button>
          <button className="btn-secondary" onClick={handleBack}>
            Back to Project
          </button>
        </div>
      </div>
    </div>
  );
}
