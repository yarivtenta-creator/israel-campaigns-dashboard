import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Check } from 'lucide-react';
import axios from 'axios';

function CampaignView() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaign();
    const interval = setInterval(fetchCampaign, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`/api/campaigns/${id}`);
      setCampaign(response.data.campaign);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    try {
      const response = await axios.get(`/api/campaigns/${id}/export/${format}`);
      const element = document.createElement('a');
      element.href = URL.createObjectURL(new Blob([JSON.stringify(response.data, null, 2)]));
      element.download = `campaign-${id}.${format}`;
      element.click();
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(campaign.brief, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="loading">Loading campaign...</div>;
  if (!campaign) return <div className="error">Campaign not found</div>;

  const brief = campaign.brief?.campaign_brief || {};

  return (
    <div className="page campaign-view">
      <header className="page-header">
        <button className="icon-btn back" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>{campaign.metadata.topic}</h1>
          <p className="meta-info">
            <span>{campaign.metadata.sector}</span>
            <span className={`status ${campaign.metadata.status}`}>{campaign.metadata.status}</span>
          </p>
        </div>
      </header>

      <div className="campaign-actions">
        <button className="btn btn-secondary" onClick={handleCopy}>
          <Copy size={18} /> {copied ? 'Copied!' : 'Copy JSON'}
        </button>
        <button className="btn btn-secondary" onClick={() => handleDownload('json')}>
          <Download size={18} /> Export JSON
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`tab ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          Full JSON
        </button>
        <button
          className={`tab ${activeTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setActiveTab('keywords')}
        >
          Keywords ({brief.keywords?.primary?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === 'copy' ? 'active' : ''}`}
          onClick={() => setActiveTab('copy')}
        >
          Ad Copy Variants ({brief.ad_copy_variants?.length || 0})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'summary' && (
          <div className="summary">
            <section>
              <h3>📊 Campaign Overview</h3>
              <dl>
                <dt>Created</dt>
                <dd>{new Date(campaign.metadata.createdAt).toLocaleString()}</dd>
                <dt>Sector</dt>
                <dd>{campaign.metadata.sector}</dd>
                <dt>Status</dt>
                <dd className={`status ${campaign.metadata.status}`}>{campaign.metadata.status}</dd>
              </dl>
            </section>

            <section>
              <h3>🎯 Audience Targeting</h3>
              <p><strong>Estimated Reach:</strong> {brief.audience_targeting?.core_segment?.estimated_reach || 'N/A'}</p>
            </section>

            <section>
              <h3>💰 Bid Strategy</h3>
              <dl>
                <dt>Daily Budget (ILS)</dt>
                <dd>{brief.bid_strategy?.daily_budget_ils || 'N/A'}</dd>
                <dt>Bid Type</dt>
                <dd>{brief.bid_strategy?.recommendation || 'N/A'}</dd>
                <dt>Frequency Cap</dt>
                <dd>{brief.bid_strategy?.frequency_cap || 'N/A'}</dd>
              </dl>
            </section>

            <section>
              <h3>📈 Key Metrics</h3>
              <ul>
                <li>Keywords: {brief.keywords?.primary?.length || 0} primary, {brief.keywords?.longtail?.length || 0} long-tail</li>
                <li>Ad Copy Variants: {brief.ad_copy_variants?.length || 0}</li>
                <li>Ad Placements: {brief.performance_analysis?.placements?.length || 0}</li>
              </ul>
            </section>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="json-view">
            <pre>{JSON.stringify(brief, null, 2)}</pre>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="keywords-view">
            <h3>Primary Keywords</h3>
            <div className="keyword-grid">
              {brief.keywords?.primary?.map((kw, idx) => (
                <div key={idx} className="keyword-card">
                  <div className="keyword-en">{kw.english}</div>
                  <div className="keyword-he">{kw.hebrew}</div>
                  <div className="keyword-meta">
                    <span>{kw.search_intent}</span>
                    <span className={`priority ${kw.priority}`}>{kw.priority}</span>
                  </div>
                </div>
              ))}
            </div>

            {brief.keywords?.longtail?.length > 0 && (
              <>
                <h3 style={{ marginTop: '2rem' }}>Long-tail Variations</h3>
                <div className="keyword-list">
                  {brief.keywords.longtail.map((kw, idx) => (
                    <div key={idx} className="keyword-item">
                      <span>{kw.english}</span>
                      <span>{kw.hebrew}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'copy' && (
          <div className="copy-variants">
            {brief.ad_copy_variants?.map((variant, idx) => (
              <div key={idx} className="variant-card">
                <h3>Variant {variant.variant_id}: {variant.angle}</h3>
                <p className="funnel-stage">{variant.funnel_stage}</p>

                <div className="variant-section">
                  <h4>English</h4>
                  <p className="headline"><strong>Headline:</strong> {variant.english?.headline}</p>
                  <p className="body"><strong>Body:</strong> {variant.english?.body}</p>
                  <p className="cta"><strong>CTA:</strong> {variant.english?.cta}</p>
                </div>

                <div className="variant-section">
                  <h4>עברית (Hebrew)</h4>
                  <p className="headline"><strong>כותרת:</strong> {variant.hebrew?.headline}</p>
                  <p className="body"><strong>גוף:</strong> {variant.hebrew?.body}</p>
                  <p className="cta"><strong>CTA:</strong> {variant.hebrew?.cta}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignView;
