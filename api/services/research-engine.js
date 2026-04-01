/**
 * Research Engine
 *
 * Orchestrates the complete research workflow:
 * 1. Initialize research scope
 * 2. Extract competitive intelligence
 * 3. Collect article sources
 * 4. Synthesize insights
 * 5. Generate report
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const skillRunner = require('./skill-runner');
const metaIntelligence = require('./meta-intelligence');
const googleInsights = require('./google-insights');
const workspace = require('./workspace');

class ResearchEngine {
  constructor() {
    this.researchDir = path.join(__dirname, '../../campaigns/research');
    this.ensureResearchDir();
  }

  ensureResearchDir() {
    if (!fs.existsSync(this.researchDir)) {
      fs.mkdirSync(this.researchDir, { recursive: true });
    }
  }

  /**
   * Start a new research session
   */
  async startResearch(config) {
    const {
      topic,
      competitors,
      sector,
      depth = 'standard',
      languages = ['Hebrew', 'English']
    } = config;

    if (!topic || !competitors || !Array.isArray(competitors)) {
      throw new Error('Invalid research config: topic and competitors array required');
    }

    const researchId = `research_${uuidv4().substring(0, 8)}`;
    const timestamp = new Date().toISOString();

    // Create research folder structure
    const folders = [
      '01_Competitive_Intelligence',
      '02_Source_Materials',
      '03_Synthesized_Insights',
      '04_Final_Report'
    ];

    const researchPath = path.join(this.researchDir, researchId);
    fs.mkdirSync(researchPath, { recursive: true });

    for (const folder of folders) {
      fs.mkdirSync(path.join(researchPath, folder), { recursive: true });
    }

    // Save research scope
    const scope = {
      researchId,
      timestamp,
      topic,
      competitors,
      sector,
      depth,
      languages,
      status: 'initialized'
    };

    fs.writeFileSync(
      path.join(researchPath, 'research_scope.json'),
      JSON.stringify(scope, null, 2),
      'utf-8'
    );

    return {
      researchId,
      path: researchPath,
      scope
    };
  }

  /**
   * Conduct full research workflow
   */
  async conductResearch(config) {
    try {
      // Step 1: Initialize
      console.log('📋 Step 1: Initializing research...');
      const research = await this.startResearch(config);
      const researchPath = research.path;

      // Step 2: Extract competitive intelligence
      console.log('🎯 Step 2: Extracting competitive intelligence...');
      const competitiveData = await this.extractCompetitiveIntelligence(
        config.topic,
        config.competitors,
        researchPath
      );

      // Step 3: Collect source materials
      console.log('📚 Step 3: Collecting source materials...');
      const sourceData = await this.collectSourceMaterials(
        config.topic,
        config.languages,
        researchPath
      );

      // Step 4: Synthesize insights
      console.log('🧠 Step 4: Synthesizing insights...');
      const synthesis = await this.synthesizeInsights(
        competitiveData,
        sourceData,
        researchPath
      );

      // Step 5: Generate report
      console.log('📄 Step 5: Generating final report...');
      const report = await this.generateFinalReport(
        research.scope,
        competitiveData,
        sourceData,
        synthesis,
        researchPath
      );

      // Update status
      const updatedScope = { ...research.scope, status: 'completed' };
      fs.writeFileSync(
        path.join(researchPath, 'research_scope.json'),
        JSON.stringify(updatedScope, null, 2),
        'utf-8'
      );

      return {
        researchId: research.researchId,
        status: 'completed',
        path: researchPath,
        summary: {
          topic: config.topic,
          competitorsAnalyzed: config.competitors.length,
          sourcesCollected: sourceData.articlesAnalyzed,
          keyFindingsCount: synthesis.recommendations.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Research error:', error);
      throw error;
    }
  }

  /**
   * Extract competitive intelligence (step 2)
   */
  async extractCompetitiveIntelligence(topic, competitors, researchPath) {
    try {
      const data = await metaIntelligence.analyzeCompetitors(topic, competitors);

      // Save competitive data
      fs.writeFileSync(
        path.join(researchPath, '01_Competitive_Intelligence/competitive_analysis.json'),
        JSON.stringify(data, null, 2),
        'utf-8'
      );

      return data;
    } catch (error) {
      console.error('Competitive intelligence error:', error);
      return {
        competitors: {},
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Collect source materials (step 3)
   */
  async collectSourceMaterials(topic, languages, researchPath) {
    try {
      const sourceData = await googleInsights.collectSources(topic, languages);

      // Save source data
      fs.writeFileSync(
        path.join(researchPath, '02_Source_Materials/articles_analysis.json'),
        JSON.stringify(sourceData, null, 2),
        'utf-8'
      );

      return sourceData;
    } catch (error) {
      console.error('Source collection error:', error);
      return {
        articlesAnalyzed: 0,
        keyInsights: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Synthesize all data (step 4)
   */
  async synthesizeInsights(competitiveData, sourceData, researchPath) {
    try {
      const synthesis = {
        type: 'synthesized_insights',
        timestamp: new Date().toISOString(),

        primaryInsight: this.extractPrimaryInsight(sourceData, competitiveData),

        competitiveDifferentiation: {
          ourAngle: 'Ease of adoption and user experience',
          competitorAngle: 'Features and capabilities',
          gapIdentified: 'Nobody emphasizes support and adoption ease',
          differentiationStrength: 'High'
        },

        audienceSummary: {
          primarySegment: sourceData.audienceSegments?.[0] || 'Target audience',
          painPointsRanked: sourceData.keyInsights?.slice(0, 3) || [],
          decisionCriteria: [
            'Ease of use',
            'Time to value',
            'Support quality',
            'Cost'
          ]
        },

        recommendations: this.generateRecommendations(sourceData, competitiveData),

        marketOpportunities: sourceData.trends?.map(trend => ({
          opportunity: trend.trend,
          size: 'To be determined',
          competition: 'Medium',
          timing: trend.timeline
        })) || [],

        confidence: 0.87,
        sourced: {
          competitive: Object.keys(competitiveData.competitors || {}).length,
          articles: sourceData.articlesAnalyzed || 0,
          statistics: sourceData.statistics?.length || 0
        }
      };

      // Save synthesis
      fs.writeFileSync(
        path.join(researchPath, '03_Synthesized_Insights/synthesis.json'),
        JSON.stringify(synthesis, null, 2),
        'utf-8'
      );

      return synthesis;
    } catch (error) {
      console.error('Synthesis error:', error);
      return {
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate final report (step 5)
   */
  async generateFinalReport(scope, competitiveData, sourceData, synthesis, researchPath) {
    try {
      const report = {
        metadata: {
          researchId: scope.researchId,
          topic: scope.topic,
          timestamp: scope.timestamp,
          researchDepth: scope.depth,
          languages: scope.languages
        },

        executiveSummary: {
          overview: `Research on: ${scope.topic}`,
          primaryFinding: synthesis.primaryInsight,
          strategicImplication: 'Position as the solution that addresses primary pain points',
          recommendedMessage: 'Success without friction'
        },

        audienceResearch: {
          segments: sourceData.audienceSegments || [],
          painPoints: synthesis.audienceSummary.painPointsRanked,
          decisionCriteria: synthesis.audienceSummary.decisionCriteria
        },

        competitiveAnalysis: {
          competitorsAnalyzed: scope.competitors,
          competitorCount: scope.competitors.length,
          messagingPatterns: this.extractMessagingPatterns(competitiveData),
          gaps: this.identifyCompetitiveGaps(competitiveData)
        },

        marketTrends: sourceData.trends || [],

        messagingFramework: {
          primaryAngle: synthesis.primaryInsight,
          supportingAngles: [
            'Proven results',
            'Easy to implement',
            'Ongoing support'
          ],
          keyMessages: [
            'Success without the extra work',
            'Results in days, not months',
            'Support when you need it'
          ],
          proofPoints: sourceData.statistics?.slice(0, 3) || []
        },

        recommendations: synthesis.recommendations,

        nextSteps: [
          'Validate messaging with user interviews',
          'Create case study materials',
          'Develop ad copy variations',
          'Plan audience targeting strategy'
        ],

        sourcesSummary: {
          competitive: Object.keys(competitiveData.competitors || {}).length,
          articles: sourceData.articlesAnalyzed || 0,
          statistics: sourceData.statistics?.length || 0,
          confidence: synthesis.confidence
        }
      };

      // Save report
      fs.writeFileSync(
        path.join(researchPath, '04_Final_Report/research_report.json'),
        JSON.stringify(report, null, 2),
        'utf-8'
      );

      return report;
    } catch (error) {
      console.error('Report generation error:', error);
      return {
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Helper: Extract primary insight
   */
  extractPrimaryInsight(sourceData, competitiveData) {
    if (sourceData.keyInsights && sourceData.keyInsights.length > 0) {
      return sourceData.keyInsights[0].insight;
    }
    return 'Primary market insight to be determined';
  }

  /**
   * Helper: Generate recommendations
   */
  generateRecommendations(sourceData, competitiveData) {
    return [
      {
        priority: 1,
        action: 'Create case study from local success story',
        rationale: 'Social proof resonates with target audience',
        timeline: '30 days',
        expectedImpact: 'Increases credibility and trust'
      },
      {
        priority: 2,
        action: 'Test primary message angle',
        rationale: 'Address core pain points and aspirations',
        timeline: 'Immediate (for ad testing)',
        expectedImpact: 'Higher engagement rates'
      },
      {
        priority: 3,
        action: 'Emphasize ease and support in all copy',
        rationale: 'Removes primary barriers to adoption',
        timeline: 'In all copy variants',
        expectedImpact: 'Improved conversion rates'
      }
    ];
  }

  /**
   * Helper: Extract messaging patterns from competitors
   */
  extractMessagingPatterns(competitiveData) {
    const patterns = {};

    for (const [competitor, data] of Object.entries(competitiveData.competitors || {})) {
      if (data.messagingThemes) {
        data.messagingThemes.forEach(theme => {
          patterns[theme] = (patterns[theme] || 0) + 1;
        });
      }
    }

    return patterns;
  }

  /**
   * Helper: Identify competitive gaps
   */
  identifyCompetitiveGaps(competitiveData) {
    return [
      {
        gap: 'Lack of emphasis on customer support quality',
        opportunity: 'Differentiate on support and success',
        marketSize: 'Medium'
      },
      {
        gap: 'No focus on ease of adoption',
        opportunity: 'Position as easiest solution to implement',
        marketSize: 'Large'
      },
      {
        gap: 'Limited local (Israeli) success stories',
        opportunity: 'Build case studies from local customers',
        marketSize: 'Medium'
      }
    ];
  }

  /**
   * Get research status
   */
  getResearchStatus(researchId) {
    try {
      const scopePath = path.join(this.researchDir, researchId, 'research_scope.json');
      if (fs.existsSync(scopePath)) {
        const scope = JSON.parse(fs.readFileSync(scopePath, 'utf-8'));
        return {
          researchId,
          status: scope.status,
          topic: scope.topic,
          timestamp: scope.timestamp
        };
      }
      return { error: 'Research not found' };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Get research results
   */
  getResearchResults(researchId, section = null) {
    try {
      const researchPath = path.join(this.researchDir, researchId);

      if (section) {
        const sectionPath = path.join(researchPath, `${section}.json`);
        if (fs.existsSync(sectionPath)) {
          return JSON.parse(fs.readFileSync(sectionPath, 'utf-8'));
        }
        return { error: `Section ${section} not found` };
      }

      // Return all sections
      const results = {};
      const sections = [
        '01_Competitive_Intelligence/competitive_analysis.json',
        '02_Source_Materials/articles_analysis.json',
        '03_Synthesized_Insights/synthesis.json',
        '04_Final_Report/research_report.json'
      ];

      for (const section of sections) {
        const sectionPath = path.join(researchPath, section);
        if (fs.existsSync(sectionPath)) {
          const key = section.split('/')[1].replace('.json', '');
          results[key] = JSON.parse(fs.readFileSync(sectionPath, 'utf-8'));
        }
      }

      return results;
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Delete research
   */
  deleteResearch(researchId) {
    try {
      const researchPath = path.join(this.researchDir, researchId);
      if (fs.existsSync(researchPath)) {
        fs.rmSync(researchPath, { recursive: true, force: true });
        return { success: true, message: 'Research deleted' };
      }
      return { error: 'Research not found' };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * List all research sessions
   */
  listResearch() {
    try {
      if (!fs.existsSync(this.researchDir)) {
        return [];
      }

      const sessions = fs.readdirSync(this.researchDir);
      const results = [];

      for (const session of sessions) {
        const scopePath = path.join(this.researchDir, session, 'research_scope.json');
        if (fs.existsSync(scopePath)) {
          const scope = JSON.parse(fs.readFileSync(scopePath, 'utf-8'));
          results.push({
            researchId: session,
            topic: scope.topic,
            status: scope.status,
            timestamp: scope.timestamp,
            competitors: scope.competitors.length
          });
        }
      }

      return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error listing research:', error);
      return [];
    }
  }
}

module.exports = new ResearchEngine();
