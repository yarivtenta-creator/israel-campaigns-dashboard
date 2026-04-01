const fs = require('fs');
const path = require('path');

const CAMPAIGNS_DIR = path.join(__dirname, '../../campaigns');

// Ensure campaigns directory exists
if (!fs.existsSync(CAMPAIGNS_DIR)) {
  fs.mkdirSync(CAMPAIGNS_DIR, { recursive: true });
}

const FOLDERS = ['01_Ads', '02_Copy', '03_Campaign_Setup', '04_Audience_Targeting', '05_Links_and_WhatsApp', '06_Reports', '07_Client_Delivery', '08_Backups'];

const workspaceService = {
  // Create isolated workspace for a campaign
  createWorkspace: (campaignId, metadata) => {
    const campaignDir = path.join(CAMPAIGNS_DIR, campaignId);

    // Create campaign folder
    fs.mkdirSync(campaignDir, { recursive: true });

    // Create subfolder structure
    FOLDERS.forEach(folder => {
      const folderPath = path.join(campaignDir, folder);
      fs.mkdirSync(folderPath, { recursive: true });
    });

    // Save metadata
    fs.writeFileSync(
      path.join(campaignDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    return campaignDir;
  },

  // Save generated brief to workspace
  saveBrief: (campaignId, brief) => {
    const campaignDir = path.join(CAMPAIGNS_DIR, campaignId);
    const briefPath = path.join(campaignDir, 'campaign_brief.json');

    fs.writeFileSync(
      briefPath,
      JSON.stringify(brief, null, 2)
    );

    // Also save to 03_Campaign_Setup folder for organization
    fs.writeFileSync(
      path.join(campaignDir, '03_Campaign_Setup', 'brief.json'),
      JSON.stringify(brief, null, 2)
    );

    return briefPath;
  },

  // Get campaign data
  getCampaign: (campaignId) => {
    const campaignDir = path.join(CAMPAIGNS_DIR, campaignId);

    if (!fs.existsSync(campaignDir)) {
      return null;
    }

    const metadata = JSON.parse(
      fs.readFileSync(path.join(campaignDir, 'metadata.json'), 'utf8')
    );

    let brief = null;
    const briefPath = path.join(campaignDir, 'campaign_brief.json');
    if (fs.existsSync(briefPath)) {
      brief = JSON.parse(fs.readFileSync(briefPath, 'utf8'));
    }

    return { id: campaignId, metadata, brief };
  },

  // List all campaigns
  listCampaigns: () => {
    if (!fs.existsSync(CAMPAIGNS_DIR)) {
      return [];
    }

    const campaigns = fs.readdirSync(CAMPAIGNS_DIR)
      .filter(file => fs.statSync(path.join(CAMPAIGNS_DIR, file)).isDirectory())
      .map(campaignId => {
        const campaignDir = path.join(CAMPAIGNS_DIR, campaignId);
        const metadataPath = path.join(campaignDir, 'metadata.json');

        if (fs.existsSync(metadataPath)) {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          return { id: campaignId, ...metadata };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return campaigns;
  },

  // Update campaign metadata
  updateMetadata: (campaignId, updates) => {
    const campaignDir = path.join(CAMPAIGNS_DIR, campaignId);
    const metadataPath = path.join(campaignDir, 'metadata.json');

    const current = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const updated = { ...current, ...updates };

    fs.writeFileSync(
      metadataPath,
      JSON.stringify(updated, null, 2)
    );

    return updated;
  },

  // Compare multiple campaigns
  compareCampaigns: (campaignIds) => {
    const campaigns = campaignIds.map(id => workspaceService.getCampaign(id)).filter(Boolean);

    if (campaigns.length < 2) {
      throw new Error('At least 2 valid campaigns required');
    }

    return {
      campaigns: campaigns.map(c => ({
        id: c.id,
        topic: c.metadata.topic,
        sector: c.metadata.sector,
        keywords_count: c.brief?.keywords?.primary?.length || 0,
        audience_reach: c.brief?.audience_targeting?.core_segment?.estimated_reach,
        daily_budget_ils: c.brief?.bid_strategy?.daily_budget_ils,
        ad_variants: c.brief?.ad_copy_variants?.length || 0
      })),
      comparison: {
        common_interests: workspaceService.findCommonInterests(campaigns),
        budget_differences: workspaceService.calculateBudgetDifferences(campaigns),
        unique_keywords: workspaceService.findUniqueKeywords(campaigns)
      }
    };
  },

  // Find common interests across campaigns
  findCommonInterests: (campaigns) => {
    if (campaigns.length < 2) return [];

    const interests = campaigns.map(c =>
      c.brief?.audience_targeting?.facebook_interests || []
    );

    const common = interests[0].filter(interest =>
      interests.every(arr => arr.includes(interest))
    );

    return common;
  },

  // Calculate budget differences
  calculateBudgetDifferences: (campaigns) => {
    const budgets = campaigns.map(c => ({
      topic: c.metadata.topic,
      budget: c.brief?.bid_strategy?.daily_budget_ils
    }));

    const min = Math.min(...budgets.map(b => parseFloat(b.budget) || 0));
    const max = Math.max(...budgets.map(b => parseFloat(b.budget) || 0));

    return {
      min_daily_budget: min,
      max_daily_budget: max,
      difference: max - min,
      highest: budgets.find(b => parseFloat(b.budget) === max),
      lowest: budgets.find(b => parseFloat(b.budget) === min)
    };
  },

  // Find unique keywords in each campaign
  findUniqueKeywords: (campaigns) => {
    const allKeywordArrays = campaigns.map(c =>
      c.brief?.keywords?.primary?.map(k => k.english) || []
    );

    return campaigns.map((c, idx) => ({
      topic: c.metadata.topic,
      unique_keywords: allKeywordArrays[idx].filter(
        keyword => !allKeywordArrays.some((arr, i) => i !== idx && arr.includes(keyword))
      )
    }));
  },

  // Delete campaign
  deleteCampaign: (campaignId) => {
    const campaignDir = path.join(CAMPAIGNS_DIR, campaignId);

    if (!fs.existsSync(campaignDir)) {
      throw new Error('Campaign not found');
    }

    // Recursive delete
    fs.rmSync(campaignDir, { recursive: true, force: true });
  },

  // Export campaign
  exportCampaign: (campaignId, format) => {
    const campaign = workspaceService.getCampaign(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (format === 'json') {
      return campaign.brief;
    } else if (format === 'pdf') {
      // TODO: Implement PDF export using a library like pdfkit
      return Buffer.from('PDF export not yet implemented');
    }

    throw new Error('Unsupported export format');
  },

  // Convert research data to campaign brief
  convertResearchToCampaign: (researchId, researchData) => {
    const synthesis = researchData.synthesis || {};
    const competitiveAnalysis = researchData.competitive_analysis || {};
    const articlesAnalysis = researchData.articles_analysis || {};
    const researchReport = researchData.research_report || {};
    const researchScope = researchData.research_scope || {};

    // Extract primary keywords from synthesis recommendations and articles analysis
    const primaryKeywords = [];
    const longtailKeywords = [];

    // From synthesis recommendations
    if (synthesis.recommendations) {
      synthesis.recommendations.forEach((rec, idx) => {
        primaryKeywords.push({
          english: rec.action || `Recommendation ${idx + 1}`,
          hebrew: rec.action || `סיפור ${idx + 1}`,
          hebrew_phonetic: '',
          search_intent: 'decision',
          priority: rec.priority === 1 ? 'high' : rec.priority === 2 ? 'medium' : 'low'
        });
      });
    }

    // From articles analysis insights
    if (articlesAnalysis.keyInsights) {
      articlesAnalysis.keyInsights.slice(0, 3).forEach((insight, idx) => {
        longtailKeywords.push({
          english: insight.insight?.substring(0, 60) || `Insight ${idx + 1}`,
          hebrew: insight.insight?.substring(0, 60) || `תובנה ${idx + 1}`
        });
      });
    }

    // Extract audience segments
    const audienceSegments = articlesAnalysis.audienceSegments || [];
    const coreSegmentDescription = audienceSegments.length > 0
      ? audienceSegments[0]
      : synthesis.audienceSummary?.primarySegment || 'Target audience from research';

    // Extract messaging angles
    const messagingAngles = [
      { angle: 'pain-point', description: synthesis.audienceSummary?.painPointsRanked?.[0]?.insight || 'Address key pain points' },
      { angle: 'solution', description: 'Provide clear solution' },
      { angle: 'social-proof', description: competitiveAnalysis.crossPlatformInsights?.mostCommonCta || 'Build trust through evidence' },
      { angle: 'urgency', description: 'Create time-sensitive value' },
      { angle: 'value', description: synthesis.marketOpportunities?.[0]?.opportunity || 'Highlight key value' },
      { angle: 'ease', description: 'Simplify the process' },
      { angle: 'success-stories', description: 'Share success examples' }
    ];

    // Generate ad copy variants from messaging angles
    const adCopyVariants = messagingAngles.map((angle, idx) => ({
      variant_id: idx + 1,
      angle: angle.angle,
      funnel_stage: ['awareness', 'consideration', 'decision'][idx % 3],
      english: {
        headline: `${angle.description} - Discover More`,
        body: `Our solution helps address your needs. Learn why thousands trust us. ${angle.description}`,
        cta: 'Learn More'
      },
      hebrew: {
        headline: `${angle.description} - גלה עוד`,
        body: `הפתרון שלנו עוזר לטיפול בצרכים שלך. דע למה אלפים סומכים עלינו.`,
        cta: 'גלה עוד'
      }
    }));

    // Build campaign brief
    return {
      campaign_brief: {
        metadata: {
          topic: researchScope.topic || 'Research-derived campaign',
          description: `Generated from research: ${researchId}`,
          sector: researchScope.sector || 'General',
          created_date: new Date().toISOString(),
          language: 'English + Hebrew',
          campaign_objective: researchReport.executiveSummary?.strategicImplication || 'Drive growth through research-backed strategy'
        },
        keywords: {
          primary: primaryKeywords.slice(0, 5),
          longtail: longtailKeywords,
          negative_keywords: []
        },
        audience_targeting: {
          core_segment: {
            description: coreSegmentDescription,
            estimated_reach: '100,000 - 500,000'
          },
          lookalike_audiences: [],
          exclusions: []
        },
        ad_copy_variants: adCopyVariants,
        bid_strategy: {
          recommendation: 'CPC',
          daily_budget_ils: '₪200-500',
          daily_budget_usd: '$50-150',
          frequency_cap: '3 per day',
          retargeting_window: '30 days'
        },
        whatsapp_strategy: {
          trigger: 'Click on ad',
          sequence: [
            {
              day: 0,
              message_english: 'Thanks for your interest! Here\'s what you should know...',
              message_hebrew: 'תודה על העניין! הנה מה שאתה צריך לדעת...',
              cta: 'Learn More'
            },
            {
              day: 2,
              message_english: 'Many like you have found success. Want to see how?',
              message_hebrew: 'רבים כמוך מצאו הצלחה. רוצה לראות איך?',
              cta: 'Show Me'
            }
          ]
        }
      }
    };
  },

  // Export research data
  exportResearch: (researchId, format) => {
    const researchDir = path.join(CAMPAIGNS_DIR, 'research', researchId);

    if (!fs.existsSync(researchDir)) {
      throw new Error('Research not found');
    }

    // Load all research sections
    const researchData = {};

    // Load research scope
    const scopePath = path.join(researchDir, 'research_scope.json');
    if (fs.existsSync(scopePath)) {
      researchData.research_scope = JSON.parse(fs.readFileSync(scopePath, 'utf8'));
    }

    // Load competitive analysis
    const compAnalysisPath = path.join(researchDir, '01_Competitive_Intelligence', 'competitive_analysis.json');
    if (fs.existsSync(compAnalysisPath)) {
      researchData.competitive_analysis = JSON.parse(fs.readFileSync(compAnalysisPath, 'utf8'));
    }

    // Load articles analysis
    const articlesPath = path.join(researchDir, '02_Source_Materials', 'articles_analysis.json');
    if (fs.existsSync(articlesPath)) {
      researchData.articles_analysis = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    }

    // Load synthesis
    const synthesisPath = path.join(researchDir, '03_Synthesized_Insights', 'synthesis.json');
    if (fs.existsSync(synthesisPath)) {
      researchData.synthesis = JSON.parse(fs.readFileSync(synthesisPath, 'utf8'));
    }

    // Load research report
    const reportPath = path.join(researchDir, '04_Final_Report', 'research_report.json');
    if (fs.existsSync(reportPath)) {
      researchData.research_report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    }

    if (format === 'json') {
      return researchData;
    } else if (format === 'pdf') {
      // TODO: Implement PDF export using a library like pdfkit
      return Buffer.from('PDF export not yet implemented');
    }

    throw new Error('Unsupported export format');
  }
};

module.exports = workspaceService;
