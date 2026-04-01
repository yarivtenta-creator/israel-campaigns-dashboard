import React, { useState } from 'react';
import '../styles/AdSuggestions.css';

export default function AdSuggestions({
  suggestions,
  customAds = [],
  onDeleteCustom,
  onUpdateCustom
}) {
  const [selectedAds, setSelectedAds] = useState(new Set());
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  if (!suggestions && customAds.length === 0) {
    return (
      <div className="ad-suggestions empty">
        <p>No ad suggestions yet. Generate suggestions using the messaging angles.</p>
      </div>
    );
  }

  const toggleSelectAd = (adId) => {
    const newSelected = new Set(selectedAds);
    if (newSelected.has(adId)) {
      newSelected.delete(adId);
    } else {
      newSelected.add(adId);
    }
    setSelectedAds(newSelected);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const allAds = [
    ...(suggestions?.suggestions || []),
    ...customAds
  ];

  return (
    <div className="ad-suggestions">
      <div className="suggestions-header">
        <div className="header-info">
          <h3>💡 Ad Variations</h3>
          <p>{allAds.length} ads generated</p>
        </div>
        <div className="language-selector">
          <label>Language:</label>
          <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="hebrew">Hebrew (עברית)</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      <div className="suggestions-grid">
        {allAds.map((ad) => (
          <div key={ad.id} className={`ad-card ${ad.isCustom ? 'custom' : ''}`}>
            <div className="ad-header">
              <div className="ad-meta">
                <span className="angle-badge">{formatAngle(ad.angle)}</span>
                {ad.confidence && (
                  <span className={`confidence ${getConfidenceClass(ad.confidence)}`}>
                    {(ad.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>
              <button className="btn-options" title="More options">
                ⋯
              </button>
            </div>

            {(selectedLanguage === 'english' || selectedLanguage === 'both') && (
              <div className="ad-version english">
                <h4>English</h4>
                <div className="ad-content">
                  <div className="ad-part">
                    <label>Headline</label>
                    <p className="headline">{ad.english.headline}</p>
                    <button
                      className="btn-copy"
                      onClick={() => copyToClipboard(ad.english.headline)}
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>

                  <div className="ad-part">
                    <label>Body</label>
                    <p className="body">{ad.english.body}</p>
                    <button
                      className="btn-copy"
                      onClick={() => copyToClipboard(ad.english.body)}
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>

                  <div className="ad-part">
                    <label>CTA Button</label>
                    <div className="cta-preview">
                      <button className="cta-button">{ad.english.cta}</button>
                    </div>
                    <button
                      className="btn-copy"
                      onClick={() => copyToClipboard(ad.english.cta)}
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(selectedLanguage === 'hebrew' || selectedLanguage === 'both') && (
              <div className="ad-version hebrew">
                <h4>Hebrew (עברית)</h4>
                <div className="ad-content">
                  <div className="ad-part">
                    <label>כותרת</label>
                    <p className="headline" dir="rtl">
                      {ad.hebrew.headline}
                    </p>
                    <button
                      className="btn-copy"
                      onClick={() => copyToClipboard(ad.hebrew.headline)}
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>

                  <div className="ad-part">
                    <label>גוף</label>
                    <p className="body" dir="rtl">
                      {ad.hebrew.body}
                    </p>
                    <button
                      className="btn-copy"
                      onClick={() => copyToClipboard(ad.hebrew.body)}
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>

                  <div className="ad-part">
                    <label>כפתור קריאה</label>
                    <div className="cta-preview">
                      <button className="cta-button" dir="rtl">
                        {ad.hebrew.cta}
                      </button>
                    </div>
                    <button
                      className="btn-copy"
                      onClick={() => copyToClipboard(ad.hebrew.cta)}
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            )}

            {ad.reasoning && (
              <div className="ad-reasoning">
                <label>Why this works</label>
                <p>{ad.reasoning}</p>
              </div>
            )}

            {ad.isCustom && (
              <button
                onClick={() => onDeleteCustom(ad.id)}
                className="btn-delete-ad"
              >
                🗑️ Delete
              </button>
            )}

            <label className="ad-select">
              <input
                type="checkbox"
                checked={selectedAds.has(ad.id)}
                onChange={() => toggleSelectAd(ad.id)}
              />
              <span>Select</span>
            </label>
          </div>
        ))}
      </div>

      {selectedAds.size > 0 && (
        <div className="selection-toolbar">
          <p>{selectedAds.size} ads selected</p>
          <button className="btn-primary">📤 Export Selected</button>
        </div>
      )}
    </div>
  );
}

function formatAngle(angle) {
  return angle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getConfidenceClass(confidence) {
  if (confidence >= 0.85) return 'high';
  if (confidence >= 0.75) return 'medium';
  return 'low';
}
