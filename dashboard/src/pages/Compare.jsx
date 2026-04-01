import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

function Compare() {
  const [searchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || [];
    if (ids.length < 2) {
      navigate('/');
      return;
    }

    fetchComparison(ids);
  }, [searchParams, navigate]);

  const fetchComparison = async (campaignIds) => {
    try {
      const response = await axios.post('/api/campaigns/compare', {
        campaignIds
      });
      setComparison(response.data.comparison);
      setCampaigns(response.data.comparison.campaigns);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch comparison:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading comparison...</div>;
  if (!comparison) return <div className="error">Failed to load comparison</div>;

  return (
    <div className="page compare-page">
      <header className="page-header">
        <button className="icon-btn back" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>Campaign Comparison</h1>
          <p>Comparing {campaigns.length} campaigns</p>
        </div>
      </header>

      <div className="comparison-grid">
        <section className="comparison-section">
          <h2>📊 Overview</h2>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                {campaigns.map(c => (
                  <th key={c.id}>{c.topic.substring(0, 20)}...</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Sector</strong></td>
                {campaigns.map(c => (
                  <td key={c.id}>{c.sector}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Keywords</strong></td>
                {campaigns.map(c => (
                  <td key={c.id}>{c.keywords_count}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Audience Reach</strong></td>
                {campaigns.map(c => (
                  <td key={c.id}>{c.audience_reach || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Daily Budget (ILS)</strong></td>
                {campaigns.map(c => (
                  <td key={c.id}>{c.daily_budget_ils || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Ad Variants</strong></td>
                {campaigns.map(c => (
                  <td key={c.id}>{c.ad_variants}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        {comparison.common_interests?.length > 0 && (
          <section className="comparison-section">
            <h2>🎯 Common Interests</h2>
            <p>Audience interests that overlap across all campaigns:</p>
            <div className="tag-list">
              {comparison.common_interests.map((interest, idx) => (
                <span key={idx} className="tag">{interest}</span>
              ))}
            </div>
          </section>
        )}

        {comparison.budget_differences && (
          <section className="comparison-section">
            <h2>💰 Budget Analysis</h2>
            <dl>
              <dt>Minimum Daily Budget</dt>
              <dd>₪{comparison.budget_differences.min_daily_budget}</dd>
              <dt>Maximum Daily Budget</dt>
              <dd>₪{comparison.budget_differences.max_daily_budget}</dd>
              <dt>Difference</dt>
              <dd>₪{comparison.budget_differences.difference}</dd>
              <dt>Highest Budget Campaign</dt>
              <dd>{comparison.budget_differences.highest?.topic}</dd>
              <dt>Lowest Budget Campaign</dt>
              <dd>{comparison.budget_differences.lowest?.topic}</dd>
            </dl>
          </section>
        )}

        {comparison.unique_keywords?.length > 0 && (
          <section className="comparison-section">
            <h2>🔑 Unique Keywords</h2>
            {comparison.unique_keywords.map((item, idx) => (
              <div key={idx} className="unique-keywords">
                <h4>{item.topic}</h4>
                <div className="keyword-list">
                  {item.unique_keywords.length > 0 ? (
                    item.unique_keywords.slice(0, 5).map((kw, i) => (
                      <span key={i} className="keyword-badge">{kw}</span>
                    ))
                  ) : (
                    <p className="text-muted">No unique keywords</p>
                  )}
                  {item.unique_keywords.length > 5 && (
                    <span className="keyword-badge">+{item.unique_keywords.length - 5} more</span>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      <div className="info-box">
        <h3>💡 Insights</h3>
        <ul>
          <li>Common interests can be used to create lookalike audiences</li>
          <li>Budget differences suggest varying scope and target market size</li>
          <li>Unique keywords help identify sector-specific targeting opportunities</li>
          <li>Compare these results to optimize your overall campaign strategy</li>
        </ul>
      </div>
    </div>
  );
}

export default Compare;
