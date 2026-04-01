# Research API Documentation

Complete API reference for the research system. All endpoints are under `/api/research`.

## Table of Contents
1. [Core Research Endpoints](#core-research-endpoints)
2. [Data Retrieval Endpoints](#data-retrieval-endpoints)
3. [Analysis Endpoints](#analysis-endpoints)
4. [Integration Endpoints](#integration-endpoints)
5. [Response Formats](#response-formats)

---

## Core Research Endpoints

### POST /api/research/start
Initialize a new research session.

**Request:**
```json
{
  "topic": "Teachers age 28-45 interested in online education",
  "competitors": ["Wix", "Squarespace", "WordPress"],
  "sector": "Education",
  "depth": "standard",
  "languages": ["Hebrew", "English"]
}
```

**Parameters:**
- `topic` (string, required): Topic to research
- `competitors` (array, required): List of competitor names
- `sector` (string, optional): Industry sector. Default: "General"
- `depth` (string, optional): "quick" | "standard" | "comprehensive". Default: "standard"
- `languages` (array, optional): ["Hebrew", "English"]. Default: both

**Response:**
```json
{
  "success": true,
  "researchId": "research_abc123",
  "status": "initialized",
  "config": {
    "researchId": "research_abc123",
    "timestamp": "2026-04-01T10:00:00.000Z",
    "topic": "Teachers age 28-45...",
    "competitors": ["Wix", "Squarespace", "WordPress"],
    "sector": "Education",
    "depth": "standard",
    "languages": ["Hebrew", "English"],
    "status": "initialized"
  }
}
```

---

### POST /api/research/conduct
Conduct complete research workflow (all steps).

**Request:**
```json
{
  "topic": "Teachers age 28-45 interested in online education",
  "competitors": ["Wix", "Squarespace", "WordPress"],
  "sector": "Education",
  "depth": "standard",
  "languages": ["Hebrew", "English"]
}
```

**Response:**
```json
{
  "success": true,
  "researchId": "research_abc123",
  "status": "completed",
  "summary": {
    "topic": "Teachers age 28-45...",
    "competitorsAnalyzed": 3,
    "sourcesCollected": 10,
    "keyFindingsCount": 5,
    "timestamp": "2026-04-01T10:15:00.000Z"
  }
}
```

---

## Data Retrieval Endpoints

### GET /api/research/:id/status
Get research session status.

**Response:**
```json
{
  "researchId": "research_abc123",
  "status": "completed",
  "topic": "Teachers age 28-45...",
  "timestamp": "2026-04-01T10:00:00.000Z"
}
```

---

### GET /api/research/:id/results?section={section}
Get research results. Optionally filter by section.

**Query Parameters:**
- `section` (optional): "competitive_analysis" | "articles_analysis" | "synthesis" | "research_report"

**Response (all sections):**
```json
{
  "competitive_analysis": { ... },
  "articles_analysis": { ... },
  "synthesis": { ... },
  "research_report": { ... }
}
```

**Response (single section):**
```json
{
  "section": "Meta Competitive Intelligence",
  "data": {
    "type": "competitive_analysis",
    "competitors": {
      "Wix": { ... },
      "Squarespace": { ... }
    }
  }
}
```

---

### GET /api/research/:id/meta
Get Meta competitive intelligence only.

**Response:**
```json
{
  "section": "Meta Competitive Intelligence",
  "data": {
    "type": "competitive_analysis",
    "timestamp": "2026-04-01T10:05:00.000Z",
    "competitors": {
      "Wix": {
        "positioning": "Website builder for small business",
        "targetAudience": "Small business owners, age 25-50",
        "messagingThemes": [
          "Build professional website without coding",
          "All-in-one business solution"
        ],
        "primaryCta": "Start Free",
        "estimatedMonthlyBudget": "₪50,000-100,000",
        "targetLanguage": "Hebrew"
      }
    },
    "crossPlatformInsights": {
      "mostCommonCta": "Start Free",
      "mostCommonMessagingAngle": "Ease of use",
      "gapsIdentified": [
        "Lack of emphasis on customer support"
      ]
    }
  }
}
```

---

### GET /api/research/:id/google
Get Google insights (articles, trends, audience segments).

**Response:**
```json
{
  "section": "Google Insights",
  "data": {
    "type": "source_analysis",
    "articlesAnalyzed": 10,
    "keyInsights": [
      {
        "insight": "Time constraints are primary barrier",
        "mentionedIn": 8,
        "confidence": "High",
        "source": "Multiple education studies"
      }
    ],
    "statistics": [
      {
        "stat": "78% of Israeli teachers lack time",
        "source": "Educational Research Center",
        "year": 2024,
        "confidence": "High"
      }
    ],
    "trends": [
      {
        "trend": "Hybrid teaching becoming standard",
        "trajectory": "Growing",
        "timeline": "2024-2026"
      }
    ],
    "audienceSegments": [
      "Early adopter teachers",
      "Pragmatist teachers",
      "Skeptic teachers"
    ]
  }
}
```

---

### GET /api/research/:id/insights
Get synthesized insights.

**Response:**
```json
{
  "section": "Synthesized Insights",
  "data": {
    "type": "synthesized_insights",
    "primaryInsight": "Teachers need tools that work immediately",
    "marketOpportunity": "Gap in 'ease of adoption' messaging",
    "recommendations": [
      {
        "priority": 1,
        "action": "Create case study from local school",
        "rationale": "Social proof resonates",
        "timeline": "30 days"
      }
    ],
    "confidence": 0.87,
    "sourced": {
      "competitive": 3,
      "articles": 10,
      "statistics": 4
    }
  }
}
```

---

### GET /api/research/:id/report
Get final research report.

**Response:**
```json
{
  "section": "Research Report",
  "data": {
    "metadata": {
      "researchId": "research_abc123",
      "topic": "Teachers age 28-45...",
      "timestamp": "2026-04-01T10:00:00.000Z"
    },
    "executiveSummary": {
      "overview": "Research on: Teachers...",
      "primaryFinding": "Teachers need ease of adoption",
      "recommendedMessage": "Success without friction"
    },
    "audienceResearch": {
      "segments": ["Segment 1", "Segment 2"],
      "painPoints": [...],
      "decisionCriteria": [...]
    },
    "competitiveAnalysis": {
      "competitorsAnalyzed": ["Wix", "Squarespace"],
      "messagingPatterns": {...},
      "gaps": [...]
    },
    "messagingFramework": {
      "primaryAngle": "Success without friction",
      "supportingAngles": ["Proven results", "Easy to implement"],
      "keyMessages": [...]
    },
    "nextSteps": [...]
  }
}
```

---

## Analysis Endpoints

### POST /api/research/competitive-analysis
Run just competitive analysis (without full research).

**Request:**
```json
{
  "topic": "Website builders for small business",
  "competitors": ["Wix", "Squarespace", "WordPress"]
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "type": "competitive_analysis",
    "competitors": { ... },
    "crossPlatformInsights": { ... }
  }
}
```

---

### POST /api/research/sources
Collect articles and sources (without full research).

**Request:**
```json
{
  "topic": "Online education adoption",
  "languages": ["Hebrew", "English"]
}
```

**Response:**
```json
{
  "success": true,
  "sources": {
    "type": "source_analysis",
    "articlesAnalyzed": 10,
    "keyInsights": [...],
    "statistics": [...],
    "trends": [...]
  }
}
```

---

### GET /api/research/search-trends/:keyword
Get search trends for keyword.

**Response:**
```json
{
  "success": true,
  "keyword": "online education",
  "trends": {
    "monthlySearchVolume": "10K - 100K",
    "searchTrend": "Growing",
    "relatedKeywords": [
      "online education + tools",
      "online education + best practices"
    ],
    "seasonalPatterns": "Peaks in Q1 and Q3",
    "searchIntent": "Mixed (research, comparison)"
  }
}
```

---

### GET /api/research/pain-points/:topic
Get audience pain points for topic.

**Response:**
```json
{
  "success": true,
  "topic": "education",
  "painPoints": [
    "Time constraints for professional development",
    "Difficulty adopting new teaching methods",
    "Student engagement challenges",
    "Tech skill gaps among educators",
    "Budget limitations for tools"
  ]
}
```

---

## Integration Endpoints

### POST /api/research/:id/save-to-campaign
Save research findings to campaign.

**Request:**
```json
{
  "campaignId": "campaign_xyz789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Research saved to campaign",
  "campaignId": "campaign_xyz789",
  "researchId": "research_abc123"
}
```

---

### DELETE /api/research/:id
Delete research session.

**Response:**
```json
{
  "success": true,
  "message": "Research deleted"
}
```

---

### GET /api/research
List all research sessions.

**Response:**
```json
{
  "total": 5,
  "sessions": [
    {
      "researchId": "research_abc123",
      "topic": "Teachers age 28-45...",
      "status": "completed",
      "timestamp": "2026-04-01T10:00:00.000Z",
      "competitors": 3
    },
    {
      "researchId": "research_def456",
      "topic": "Doctors age 35-55...",
      "status": "completed",
      "timestamp": "2026-03-31T15:30:00.000Z",
      "competitors": 3
    }
  ]
}
```

---

## Response Formats

### Success Response
All successful endpoints return:
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
All errors return:
```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE"
}
```

### Pagination (future)
List endpoints support pagination:
```json
{
  "total": 100,
  "page": 1,
  "perPage": 10,
  "items": [ ... ]
}
```

---

## Rate Limits (future)

- `POST /research/conduct`: 1 request per 5 minutes per user
- `GET /research/:id/*`: 100 requests per minute
- `POST /research/sources`: 10 requests per minute

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_REQUEST | 400 | Missing required parameters |
| RESEARCH_NOT_FOUND | 404 | Research session doesn't exist |
| INVALID_TOPIC | 400 | Topic parameter invalid |
| COMPETITORS_REQUIRED | 400 | Competitors array empty or missing |
| PROCESSING_ERROR | 500 | Error during research processing |
| CAMPAIGN_NOT_FOUND | 404 | Campaign ID doesn't exist |

---

## Example Usage

### Full Research Workflow

```bash
# 1. Start research
curl -X POST http://localhost:3001/api/research/conduct \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Teachers age 28-45",
    "competitors": ["Wix", "Squarespace"],
    "sector": "Education",
    "depth": "standard",
    "languages": ["Hebrew", "English"]
  }'

# Response: {"researchId": "research_abc123"}

# 2. Get results
curl http://localhost:3001/api/research/research_abc123/results

# 3. Get specific section
curl http://localhost:3001/api/research/research_abc123/meta

# 4. Save to campaign
curl -X POST http://localhost:3001/api/research/research_abc123/save-to-campaign \
  -H "Content-Type: application/json" \
  -d '{"campaignId": "campaign_xyz"}'
```

---

## Integration with Dashboard

The frontend connects to these endpoints via:

```javascript
// Start research
POST /api/research/conduct → Returns researchId

// Poll for status
GET /api/research/:id/status

// Get results when complete
GET /api/research/:id/results

// Display in dashboard tabs
GET /api/research/:id/meta     (Meta Intelligence tab)
GET /api/research/:id/google   (Google Insights tab)
GET /api/research/:id/insights (Insights tab)
GET /api/research/:id/report   (Report tab)
```

---

## Future Enhancements

- [ ] Async job status tracking
- [ ] Progress percentage reporting
- [ ] Custom field mapping for research data
- [ ] Bulk research operations
- [ ] Research comparison endpoints
- [ ] Export to PDF/DOCX
- [ ] Webhook callbacks when research completes
- [ ] Research templates and presets
