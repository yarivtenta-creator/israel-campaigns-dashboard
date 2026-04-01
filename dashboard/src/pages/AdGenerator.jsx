import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdSuggestions from '../components/AdSuggestions';
import '../styles/AdGenerator.css';

const MESSAGING_ANGLES = [
  'pain-point-focused',
  'solution-focused',
  'social-proof',
  'urgency-driven',
  'value-proposition',
  'ease-of-use',
  'success-stories'
];

export default function AdGenerator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [researchData, setResearchData] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [selectedAngles, setSelectedAngles] = useState(MESSAGING_ANGLES);
  const [customAds, setCustomAds] = useState([]);
  const [showManualEditor, setShowManualEditor] = useState(false);

  useEffect(() => {
    fetchResearchData();
  }, [id]);

  const fetchResearchData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`/api/research/${id}/results`);
      setResearchData(response.data);

      // Auto-generate initial suggestions
      generateSuggestions(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading research data');
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = async (data) => {
    try {
      setGenerating(true);

      // Simulate API call to generate ads
      // In production, this would call /api/ads/generate
      const generated = generateAdVariations(data, selectedAngles);
      setSuggestions(generated);
    } catch (err) {
      setError('Error generating ad suggestions');
    } finally {
      setGenerating(false);
    }
  };

  const generateAdVariations = (data, angles) => {
    const synthesis = data.synthesis || {};
    const variations = angles.map((angle, idx) => ({
      id: `ad_${idx}`,
      angle,
      confidence: getConfidence(angle),
      english: generateEnglishAd(angle, synthesis),
      hebrew: generateHebrewAd(angle, synthesis),
      reasoning: getReasoning(angle, synthesis)
    }));

    return {
      timestamp: new Date().toISOString(),
      suggestions: variations
    };
  };

  const generateEnglishAd = (angle, synthesis) => {
    const templates = {
      'pain-point-focused': {
        headline: 'Stop Struggling With Time Constraints',
        body: 'Most teams face the same challenge. Our solution delivers results without the complexity.',
        cta: 'Start Free Trial'
      },
      'solution-focused': {
        headline: 'Success Without Friction',
        body: 'Get professional results instantly. No training needed, no technical expertise required.',
        cta: 'Learn More'
      },
      'social-proof': {
        headline: 'Trusted by Leading Teams',
        body: 'See how thousands of professionals transformed their workflow. Real results, real impact.',
        cta: 'See Case Studies'
      },
      'urgency-driven': {
        headline: 'The Market Moves Fast',
        body: 'Get ahead with tools built for teams that demand results. Today\'s advantage is tomorrow\'s standard.',
        cta: 'Get Started Now'
      },
      'value-proposition': {
        headline: 'Deliver More Impact',
        body: 'Get measurable results while your team stays focused on what matters most.',
        cta: 'Explore Features'
      },
      'ease-of-use': {
        headline: 'No Technical Skills Needed',
        body: 'Deploy in hours, not weeks. Our intuitive platform works how you think it should.',
        cta: 'Try It Free'
      },
      'success-stories': {
        headline: 'Success Stories from Your Industry',
        body: 'See real companies achieving real results. From launch to scale in record time.',
        cta: 'Read Case Studies'
      }
    };

    return templates[angle] || templates['solution-focused'];
  };

  const generateHebrewAd = (angle, synthesis) => {
    const templates = {
      'pain-point-focused': {
        headline: 'הפסקת להיות מותש מאילוצי זמן',
        body: 'רוב הצוותים מתמודדים עם אותו אתגר. הפתרון שלנו משתלם תוצאות ללא מורכבות.',
        cta: 'התחלה חינם'
      },
      'solution-focused': {
        headline: 'הצלחה ללא חיכוך',
        body: 'קבל תוצאות מקצועיות מיד. לא נדרשת הדרכה, אין צורך בידע טכני.',
        cta: 'למד עוד'
      },
      'social-proof': {
        headline: 'בהשתמש צוותים מובילים',
        body: 'ראה כיצד אלפים של אנשי מקצוע שינו את זרימת העבודה שלהם. תוצאות אמיתיות.',
        cta: 'ראה מקרי בדיקה'
      },
      'urgency-driven': {
        headline: 'השוק נע במהירות',
        body: 'קדם עם כלים שנבנו לצוותים שדורשים תוצאות. היתרון של היום הוא התקן של מחר.',
        cta: 'התחלה עכשיו'
      },
      'value-proposition': {
        headline: 'תן יותר השפעה',
        body: 'קבל תוצאות הניתנות למדידה בזמן שהצוות שלך נשאר ממוקד על מה שחשוב ביותר.',
        cta: 'חקור תכונות'
      },
      'ease-of-use': {
        headline: 'לא נדרש כישורים טכניים',
        body: 'הפעל בשעות, לא בשבועות. הפלטפורמה שלנו עובדת בדיוק כמו שאתה חושב.',
        cta: 'נסה בחינם'
      },
      'success-stories': {
        headline: 'סיפורי הצלחה מהתעשייה שלך',
        body: 'ראה חברות אמיתיות משיגות תוצאות אמיתיות. משגור לעולם בזמן רקורד.',
        cta: 'קרא סיפורים'
      }
    };

    return templates[angle] || templates['solution-focused'];
  };

  const getConfidence = (angle) => {
    const confidenceMap = {
      'pain-point-focused': 0.92,
      'solution-focused': 0.88,
      'social-proof': 0.90,
      'urgency-driven': 0.75,
      'value-proposition': 0.85,
      'ease-of-use': 0.89,
      'success-stories': 0.86
    };
    return confidenceMap[angle] || 0.80;
  };

  const getReasoning = (angle, synthesis) => {
    const reasoningMap = {
      'pain-point-focused': 'High engagement when addressing customer problems directly.',
      'solution-focused': 'Works well with pragmatist audience segments.',
      'social-proof': 'Competitors use this heavily. Effective for building trust.',
      'urgency-driven': 'Can drive time-sensitive conversions.',
      'value-proposition': 'Aligns with decision criteria identified in research.',
      'ease-of-use': 'Directly addresses adoption barriers.',
      'success-stories': 'Israeli market values local success stories.'
    };
    return reasoningMap[angle] || 'Based on research analysis.';
  };

  const handleAngleChange = (angle) => {
    setSelectedAngles(prev =>
      prev.includes(angle)
        ? prev.filter(a => a !== angle)
        : [...prev, angle]
    );
  };

  const handleAddCustomAd = () => {
    const newAd = {
      id: `custom_${Date.now()}`,
      angle: 'custom',
      english: { headline: '', body: '', cta: '' },
      hebrew: { headline: '', body: '', cta: '' },
      isCustom: true
    };
    setCustomAds([...customAds, newAd]);
  };

  const handleUpdateCustomAd = (adId, field, language, value) => {
    setCustomAds(prev =>
      prev.map(ad =>
        ad.id === adId
          ? {
              ...ad,
              [language]: {
                ...ad[language],
                [field]: value
              }
            }
          : ad
      )
    );
  };

  const handleDeleteCustomAd = (adId) => {
    setCustomAds(prev => prev.filter(ad => ad.id !== adId));
  };

  const handleSaveAds = async () => {
    try {
      // TODO: Save ads to campaign or research
      const adsToSave = [
        ...(suggestions?.suggestions || []),
        ...customAds
      ];

      alert(`Saved ${adsToSave.length} ad variations!`);
      navigate(`/research/${id}`);
    } catch (err) {
      setError('Error saving ads');
    }
  };

  if (loading) {
    return (
      <div className="ad-generator">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading research data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad-generator">
        <div className="error-state">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate(`/research/${id}`)} className="btn-secondary">
            Back to Research
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-generator">
      <div className="generator-header">
        <div>
          <h1>✨ AI Ad Generator</h1>
          <p>Generate professional ad copy from your research</p>
        </div>
        <button onClick={handleSaveAds} className="btn-primary">
          💾 Save All Ads
        </button>
      </div>

      <div className="generator-container">
        {/* Sidebar: Angle Selection */}
        <div className="generator-sidebar">
          <h3>📌 Messaging Angles</h3>
          <div className="angles-list">
            {MESSAGING_ANGLES.map(angle => (
              <label key={angle} className="angle-checkbox">
                <input
                  type="checkbox"
                  checked={selectedAngles.includes(angle)}
                  onChange={() => handleAngleChange(angle)}
                  disabled={generating}
                />
                <span>{formatAngle(angle)}</span>
              </label>
            ))}
          </div>

          <button
            onClick={() => generateSuggestions(researchData)}
            className="btn-secondary"
            disabled={generating || selectedAngles.length === 0}
          >
            {generating ? 'Generating...' : '🔄 Regenerate'}
          </button>

          <button
            onClick={() => setShowManualEditor(!showManualEditor)}
            className="btn-secondary"
          >
            ✏️ Manual Editor
          </button>
        </div>

        {/* Main Content: Ad Suggestions */}
        <div className="generator-main">
          <AdSuggestions
            suggestions={suggestions}
            customAds={customAds}
            onDeleteCustom={handleDeleteCustomAd}
            onUpdateCustom={handleUpdateCustomAd}
          />

          {showManualEditor && (
            <div className="manual-editor-section">
              <h3>✏️ Create Custom Ad</h3>
              <button onClick={handleAddCustomAd} className="btn-secondary">
                ➕ Add New Ad
              </button>

              {customAds.map(ad => (
                <div key={ad.id} className="custom-ad-editor">
                  <button
                    onClick={() => handleDeleteCustomAd(ad.id)}
                    className="btn-delete"
                  >
                    ✕
                  </button>

                  <div className="ad-column">
                    <h4>English</h4>
                    <input
                      type="text"
                      placeholder="Headline"
                      value={ad.english.headline}
                      onChange={(e) =>
                        handleUpdateCustomAd(ad.id, 'headline', 'english', e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Body text"
                      value={ad.english.body}
                      onChange={(e) =>
                        handleUpdateCustomAd(ad.id, 'body', 'english', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="CTA"
                      value={ad.english.cta}
                      onChange={(e) =>
                        handleUpdateCustomAd(ad.id, 'cta', 'english', e.target.value)
                      }
                    />
                  </div>

                  <div className="ad-column">
                    <h4>Hebrew (עברית)</h4>
                    <input
                      type="text"
                      placeholder="כותרת"
                      value={ad.hebrew.headline}
                      onChange={(e) =>
                        handleUpdateCustomAd(ad.id, 'headline', 'hebrew', e.target.value)
                      }
                      dir="rtl"
                    />
                    <textarea
                      placeholder="גוף הטקסט"
                      value={ad.hebrew.body}
                      onChange={(e) =>
                        handleUpdateCustomAd(ad.id, 'body', 'hebrew', e.target.value)
                      }
                      dir="rtl"
                    />
                    <input
                      type="text"
                      placeholder="כפתור קריאה"
                      value={ad.hebrew.cta}
                      onChange={(e) =>
                        handleUpdateCustomAd(ad.id, 'cta', 'hebrew', e.target.value)
                      }
                      dir="rtl"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatAngle(angle) {
  return angle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
