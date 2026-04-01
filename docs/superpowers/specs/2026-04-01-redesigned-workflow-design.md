# Israel Meta Campaigns Dashboard - Redesigned Workflow
**Date:** 2026-04-01
**Status:** Design Approved
**Scope:** Complete workflow redesign with materials collection → analysis → research → campaign creation → text generation → image prompts

---

## Overview

Redesign the campaign workflow to start with **what to promote** and **supporting materials**, automatically analyze them to extract themes/keywords/positioning, conduct competitive research based on that analysis, generate 5 text variations, create image prompts, and finally generate assets via Gemini AI and Canva.

**Key principle:** Linear by default, skipable at each step for flexibility.

---

## Architecture

```
Materials Collection (Phase 1)
    ↓
Content Analysis (Phase 2) [skip optional]
    ↓
Competitive Research (Phase 3) [skip optional]
    ↓
Campaign Creation (Phase 4) [skip optional]
    ↓
Text Generation (Phase 5) [skip optional]
    ↓
Image Prompt Generation (Phase 6) [skip optional]
    ↓
Image & Video Generation (Phase 7)
    ↓
Campaign Delivery (organized by client/project name)
```

---

## Phases

### Phase 1: Materials Collection
**Purpose:** User provides what they're promoting + supporting materials
**New Page:** "Add Materials"

**Input Methods:**
- Paste URLs (system auto-scrapes)
- Paste text/links directly
- Upload files (PDF, Word, images)

**Processing:**
- Store raw materials in `[project-name]/00_Materials/`
- Organize by type (URLs, uploaded files, pasted text)

**Output:** Raw materials ready for analysis

---

### Phase 2: Content Analysis
**Purpose:** Extract themes, keywords, positioning, ad angles from materials
**New Page:** "Analyze Materials"

**Processing:**
- Call Claude API to analyze all materials
- Extract:
  - **Keywords** (primary, longtail, negative)
  - **Positioning** (unique value, competitive advantages)
  - **Ad Angles** (pain-point, solution, social-proof, urgency, value, ease, stories)

**Output:** Structured JSON saved to `[project-name]/01_Analysis/`

**Skip Option:** User provides own themes manually instead of system analysis

---

### Phase 3: Competitive Research
**Purpose:** Research competitors and market landscape
**Modified Page:** Enhance existing ResearchStart

**Features:**
- Auto-suggest competitors based on extracted themes
- User can manually add/remove competitors
- "Auto-discover" checkbox for full autonomous research
- Existing depth options (Quick/Standard/Comprehensive)

**Output:** Research results in `[project-name]/02_Research/`

**Skip Option:** "Choose competitors manually" → skip auto-discovery

---

### Phase 4: Campaign Creation
**Purpose:** Create campaign with pre-filled research data
**Modified Page:** NewCampaign with auto-fill from research

**Features:**
- **Required:** Project name (for client organization)
- **Auto-filled from analysis/research:**
  - Sector
  - Target audience
  - Key themes
- User can customize all fields
- Creates campaign workspace with folder structure

**Output:** Campaign workspace in `[project-name]/03_Campaign/`

**Skip Option:** "Create blank campaign" → manual entry only

---

### Phase 5: Text Generation
**Purpose:** Generate 5 different ad copy variations
**New Page:** "Generate Ad Copy"

**Generation Logic:**
- Combine:
  - 7 messaging angles (from analysis)
  - Tone variations (formal/casual, B2B/B2C, premium/value)
  - Format hints (carousel, single image, story, video, collection)

**Output:** 5 complete variations, each with:
- Headline (Hebrew + English)
- Body copy (Hebrew + English)
- Call-to-action (Hebrew + English)

**UI:**
- Show all 5 side-by-side
- User clicks to approve individual variations or all
- Approved copy saved to `[project-name]/04_Copy/`

**Skip Option:** "Write copy manually"

---

### Phase 6: Image Prompt Generation
**Purpose:** Create detailed, customizable image generation prompts
**New Page:** "Create Image Prompts"

**Prompt Generation by Format:**
- **Carousel ads:** Multiple images, describe each scene
- **Single image ads:** Detailed visual specification
- **Story ads:** Vertical, mobile-optimized, scene flow
- **Video ads:** Visual flow, scene descriptions, transitions
- **Collection ads:** Grid layout, visual spec for each tile

**Prompt Content:**
- Style & mood (modern, warm, professional, minimalist, etc.)
- Color palette (brand-aligned if available)
- Cultural elements (Israeli market specifics)
- Composition & layout guidelines
- Characters/objects (if applicable)

**UI:**
- Display prompts by format
- Edit each prompt before generation
- Show preview of what each prompt targets

**Skip Option:** "Manual prompt entry"

---

### Phase 7: Image & Video Generation
**Purpose:** Generate visual assets
**New Page:** "Generate Assets"

**Image Generation:**
- Send prompts to Gemini AI API
- Store generated images in `[project-name]/06_Assets/[format]/`
- Gallery view of generated images

**Video Generation:**
- Export video prompts to Canva format
- User generates in Canva (external workflow)
- Import videos back into project

**Output:** Complete asset library organized by format

---

## Data Model

```json
{
  "projectId": "uuid",
  "projectName": "string (client name)",
  "createdAt": "ISO timestamp",
  "sectors": ["Healthcare", ...],
  "folders": {
    "00_Materials": {
      "urls.json": "collected URLs",
      "uploaded_files/": "PDFs, docs, images",
      "pasted_text.md": "copied text"
    },
    "01_Analysis": {
      "analysis_results.json": {
        "keywords": { "primary": [], "longtail": [], "negative": [] },
        "positioning": { "unique_value": "string", "advantages": [] },
        "ad_angles": ["pain-point", "solution", ...]
      },
      "themes.json": "extracted themes"
    },
    "02_Research": {
      "competitors.json": ["competitor1", "competitor2", ...],
      "research_results.json": "full research output"
    },
    "03_Campaign": {
      "campaign_brief.json": "campaign configuration",
      "metadata.json": "campaign metadata"
    },
    "04_Copy": {
      "generated_variations.json": [
        { "id": 1, "angle": "pain-point", "tone": "formal", "headline_he": "", "headline_en": "", ... },
        ...
      ],
      "approved_copy.json": "user-selected variations"
    },
    "05_Prompts": {
      "image_prompts.json": {
        "carousel": [...],
        "single_image": [...],
        "stories": [...],
        "video": [...],
        "collection": [...]
      },
      "video_prompts.json": "Canva-formatted prompts"
    },
    "06_Assets": {
      "01_Carousel/": "images",
      "02_SingleImage/": "images",
      "03_Stories/": "images",
      "04_Video/": "videos",
      "05_Collection/": "images"
    },
    "07_Final": {
      "campaign_deliverable.json": "final output for Meta/client"
    }
  }
}
```

---

## Navigation Structure

**Updated Dashboard Navigation:**
```
Home (My Projects list)
├── + New Project
├── [Project Name]
│   ├── Step 1: Add Materials
│   ├── Step 2: Analyze (skip available)
│   ├── Step 3: Research (skip available)
│   ├── Step 4: Campaign (skip available)
│   ├── Step 5: Generate Copy (skip available)
│   ├── Step 6: Image Prompts (skip available)
│   └── Step 7: Generate Assets
├── Projects (archived/completed campaigns)
└── Settings
```

---

## Integration Points

| Phase | Integration | Technology |
|-------|-------------|-----------|
| Materials | File upload, URL scraping | Multer, Cheerio/jsdom |
| Analysis | Theme extraction | Claude API (claude-3.5-sonnet) |
| Research | Competitive analysis | Existing research backend + Claude API |
| Copy Gen | Text generation | Claude API with structured prompts |
| Prompts | Prompt generation | Claude API with vision context |
| Images | Image generation | Gemini AI API |
| Video | Video generation | Canva API (or manual export/import) |

---

## Skip Logic

Each phase can be skipped:
- **Skip Phase 2:** User manually enters themes/keywords
- **Skip Phase 3:** User manually selects competitors
- **Skip Phase 4:** Create blank campaign
- **Skip Phase 5:** User writes copy manually
- **Skip Phase 6:** User enters custom prompts

**Implementation:** Add "Skip" or "Manual" button on each phase page

---

## File Changes Required

**New Pages:**
- `dashboard/src/pages/ProjectHome.jsx` — Project detail/navigation
- `dashboard/src/pages/AddMaterials.jsx` — Phase 1
- `dashboard/src/pages/AnalyzeMaterials.jsx` — Phase 2
- `dashboard/src/pages/GenerateCopy.jsx` — Phase 5
- `dashboard/src/pages/ImagePrompts.jsx` — Phase 6
- `dashboard/src/pages/GenerateAssets.jsx` — Phase 7

**Modified Pages:**
- `dashboard/src/pages/Home.jsx` — Show projects list
- `dashboard/src/pages/ResearchStart.jsx` — Pre-fill from analysis, add skip option
- `dashboard/src/pages/NewCampaign.jsx` — Pre-fill from research, add skip option

**New API Routes:**
- `POST /api/projects` — Create project
- `POST /api/projects/:id/materials` — Upload/save materials
- `POST /api/projects/:id/analyze` — Analyze materials
- `POST /api/projects/:id/copy-generate` — Generate 5 text variations
- `POST /api/projects/:id/prompts-generate` — Generate image prompts
- `POST /api/projects/:id/assets-generate` — Generate images via Gemini

**New Services:**
- `api/services/materials-service.js` — File handling, URL scraping
- `api/services/analysis-service.js` — Material analysis via Claude
- `api/services/text-gen-service.js` — Copy generation
- `api/services/prompts-service.js` — Image prompt generation
- `api/services/gemini-service.js` — Gemini image generation

---

## Testing Strategy

1. **Materials Collection:** Test file upload, URL scraping, text paste
2. **Analysis:** Verify Claude API extracts correct keywords/angles
3. **Research:** Verify competitor suggestions + manual override works
4. **Campaign Creation:** Verify pre-fill + customization flows
5. **Text Generation:** Verify 5 unique variations generated
6. **Prompts:** Verify format-specific, editable prompts
7. **Assets:** Verify Gemini integration, image gallery display
8. **End-to-End:** Full workflow from materials → final campaign

---

## Rollout Plan

**Phase 1 (Foundation):** Materials + Analysis + skip logic
**Phase 2 (Integration):** Connect to existing Research + Campaign creation
**Phase 3 (Generation):** Text generation + Prompts
**Phase 4 (Assets):** Gemini + Canva integration
**Phase 5 (Polish):** UI/UX refinement, bilingual support, testing

---

## Success Criteria

✅ User can upload/paste/scrape materials
✅ System analyzes and extracts themes automatically
✅ Research auto-suggests competitors, user can edit
✅ Campaign pre-fills from research data
✅ System generates 5 distinct text variations
✅ Image prompts are format-specific and customizable
✅ Gemini API generates images from prompts
✅ All data organized by client/project name
✅ Each step can be skipped with "manual" alternative
✅ Full bilingual support (Hebrew + English)

---

## Notes

- Maintain existing campaign folder structure (01_Ads, 02_Copy, etc.)
- Preserve existing ResearchStart/ResearchResults pages, integrate with new flow
- Client name (project name) is critical for organization and retrieval
- Skip options prevent forcing users through unwanted automation
- Image generation via Gemini is optional first phase; can upgrade to DALL-E/Midjourney later
