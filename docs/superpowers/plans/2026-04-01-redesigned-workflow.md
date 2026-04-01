# Israel Meta Campaigns Dashboard - Redesigned Workflow Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement tasks.

**Goal:** Implement 7-phase workflow system: Materials → Analysis → Research → Campaign → Text Gen → Image Prompts → Assets

**Architecture:** Linear flow with skip options. Each phase inputs from prior phase, outputs to next phase.

**Tech Stack:** React 18, Express 4.18, Claude API (analysis, text gen, prompts), Gemini AI (images), Multer (uploads)

---

## Completed Tasks

✅ **Task 1:** Project service & CRUD routes
✅ **Task 2:** Home page showing projects grid
✅ **Task 3:** ProjectHome with phase navigation
✅ **Task 4:** Materials service (file upload, URL scraping)
✅ **Task 5:** AddMaterials frontend page
✅ **Task 6:** Analysis service with Claude API
✅ **Task 7:** AnalyzeMaterials frontend with results display
✅ **Task 8:** ResearchStart pre-fill from analysis + auto-discover
✅ **Task 9:** NewCampaign pre-fill from analysis + skip logic

---

## Remaining Tasks (Phase 5-7)

### **Phase 5: Text Generation (Task 10)**

**Objective:** Generate 5 different ad copy variations using Claude API

**Files to create:**
- `api/services/text-gen-service.js` — Text generation logic
- `api/routes/copy.js` — API endpoints
- `dashboard/src/pages/GenerateCopy.jsx` — UI for 5 variations
- `dashboard/src/styles/GenerateCopy.css` — Styling

**API Endpoints:**
- `POST /api/copy/:projectId/generate` — Generate 5 variations
- `GET /api/copy/:projectId` — Retrieve variations
- `POST /api/copy/:projectId/approve` — Save approved variations

**Implementation:**
1. Text gen service calls Claude API with campaign + analysis data
2. Prompt generates 5 variations combining:
   - 7 ad angles (from analysis)
   - 3 tones (formal/casual/premium)
   - 5 formats (carousel, single, story, video, collection)
3. Each variation includes: Hebrew headline, English headline, Hebrew body, English body, Hebrew CTA, English CTA
4. Frontend displays all 5 side-by-side with approval checkboxes
5. User approves individual or all, saves to `04_Copy/approved_copy.json`

**Test:**
- Create campaign, generate copy
- Verify 5 unique variations
- Check bilingual content
- Save approvals

---

### **Phase 6: Image Prompt Generation (Task 11)**

**Objective:** Create format-specific, customizable image prompts

**Files to create:**
- `api/services/prompts-service.js` — Prompt generation logic
- `api/routes/prompts.js` — API endpoints
- `dashboard/src/pages/ImagePrompts.jsx` — UI for prompt editor
- `dashboard/src/styles/ImagePrompts.css` — Styling

**API Endpoints:**
- `POST /api/prompts/:projectId/generate` — Generate prompts
- `GET /api/prompts/:projectId` — Retrieve prompts
- `POST /api/prompts/:projectId/save` — Save custom prompts

**Implementation:**
1. Prompts service calls Claude API with approved copy + campaign data
2. Generate 5 prompt sets (one per format):
   - Carousel (describe 3 images)
   - Single image (visual spec)
   - Story (vertical, mobile)
   - Video (scene flow, transitions)
   - Collection (grid layout)
3. Each prompt includes: style, mood, color palette, cultural elements, composition
4. Frontend displays by format, edit buttons for customization
5. Save to `05_Prompts/image_prompts.json`

**Test:**
- Generate prompts from approved copy
- Verify format-specific content
- Edit and save custom prompts

---

### **Phase 7: Image & Video Generation (Task 12)**

**Objective:** Generate images via Gemini AI, export video prompts to Canva

**Files to create:**
- `api/services/gemini-service.js` — Gemini API integration
- `api/routes/assets.js` — API endpoints
- `dashboard/src/pages/GenerateAssets.jsx` — UI for generation
- `dashboard/src/styles/GenerateAssets.css` — Styling

**API Endpoints:**
- `POST /api/assets/:projectId/generate-images` — Call Gemini for each prompt
- `GET /api/assets/:projectId/gallery` — Show generated images
- `POST /api/assets/:projectId/export-video` — Export video prompts

**Implementation:**
1. Gemini service calls Google's Gemini API with image prompts
2. Generate one image per prompt (5 total, one per format)
3. Store images in `06_Assets/[format]/` folders
4. Frontend shows gallery view with images organized by format
5. Video prompts exportable to Canva format (JSON with scene descriptions)
6. Store export in `06_Assets/04_Video/prompts.json`

**Test:**
- Generate images (requires Gemini API key)
- Check image quality and format
- Export video prompts
- Verify gallery display

---

## Architecture Decisions

### Data Flow
```
Materials (00_Materials)
  ↓
Analysis (01_Analysis) — extracts keywords, positioning, angles
  ↓
Research (02_Research) — competitor analysis
  ↓
Campaign (03_Campaign) — campaign config
  ↓
Approved Copy (04_Copy) — 5 text variations
  ↓
Prompts (05_Prompts) — format-specific image prompts
  ↓
Assets (06_Assets) — generated images organized by format
```

### Skip Logic Implementation
- Each phase checks if prior phase completed
- "Skip" buttons bypass step, go to next phase
- Manual alternatives provided (user inputs instead of automation)
- Example: Skip analysis → user provides themes manually in research

### Bilingual Support (Hebrew + English)
- All text content is bilingual (headlines, bodies, CTAs)
- RTL support in CSS for Hebrew (direction: rtl)
- All prompts include language specifications
- Gemini prompts specify language for generated images

---

## Testing Checklist

### Full Workflow (End-to-End)
- [ ] Create project with client name
- [ ] Add materials (text, URL, file)
- [ ] Analyze materials (verify keywords extracted)
- [ ] Research competitors (auto-discover + manual)
- [ ] Create campaign (pre-filled from analysis)
- [ ] Generate 5 text variations (verify bilingual)
- [ ] Edit image prompts (format-specific)
- [ ] Generate images via Gemini (verify quality)
- [ ] Export video prompts to Canva (verify format)

### Phase Skip Tests
- [ ] Skip analysis → manual theme input
- [ ] Skip research → manual competitor entry
- [ ] Skip campaign → go straight to copy gen
- [ ] Skip copy gen → manual copy entry
- [ ] Skip image prompts → manual prompt entry

### Bilingual Tests
- [ ] Hebrew/English in all text outputs
- [ ] RTL layout correct for Hebrew
- [ ] Gemini prompts specify languages
- [ ] Meta export includes both languages

---

## Integration Points

| Service | API | Key Function |
|---------|-----|--------------|
| Claude (Analysis) | Anthropic API | Extract keywords, positioning, angles |
| Claude (Text Gen) | Anthropic API | Generate 5 copy variations |
| Claude (Prompts) | Anthropic API | Generate image prompts |
| Gemini | Google Gemini API | Generate images from prompts |
| Canva | Manual/Export | Video generation (user workflow) |
| Meta | Existing export | Final campaign delivery |

---

## Deployment Checklist

- [ ] All environment variables set (.env)
  - ANTHROPIC_API_KEY
  - GOOGLE_GEMINI_API_KEY
  - NODE_ENV=production

- [ ] Database/filesystem ready
  - campaigns/ folder writable
  - Upload folder accessible

- [ ] Frontend build
  - `cd dashboard && npm run build`

- [ ] Backend start
  - `npm start` (serves React build)

- [ ] Verify all routes respond
  - GET /api/projects
  - POST /api/materials/:id/save
  - POST /api/analysis/:id/analyze
  - POST /api/copy/:id/generate
  - POST /api/prompts/:id/generate
  - POST /api/assets/:id/generate-images

---

## Known Limitations

1. **Gemini image generation** — Beta feature, may need retry logic
2. **URL scraping** — Some sites block automated access
3. **File uploads** — Limited to ~10MB per file currently
4. **Claude API** — Rate limiting may apply for high volume
5. **Video generation** — Requires manual Canva workflow (future: automate with Canva API)

---

## Future Enhancements

- PDF export of campaigns
- Campaign templates for quick setup
- A/B testing variants
- Performance tracking integration
- Team collaboration (shared projects)
- Multilingual support beyond Hebrew/English
- Canva API automation for video generation
- Image library for brand assets
- Campaign scheduling for Meta Ads Manager

