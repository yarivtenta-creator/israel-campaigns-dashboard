# Testing & Deployment Guide

## Pre-Testing Checklist

### Environment Setup
- [ ] `.env` file created with all required keys:
  ```bash
  ANTHROPIC_API_KEY=your_key_here
  GOOGLE_GEMINI_API_KEY=your_key_here
  PORT=3001
  NODE_ENV=development
  ```
- [ ] Backend dependencies installed: `npm install`
- [ ] Frontend dependencies installed: `cd dashboard && npm install`
- [ ] Both servers can start without errors

---

## Unit Testing

### API Routes Testing

#### Projects API
```bash
# Create project
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{"projectName":"Test Project"}'

# List projects
curl http://localhost:3001/api/projects

# Get single project
curl http://localhost:3001/api/projects/[projectId]
```

**Expected Results:**
- ✅ Create returns project object with ID, name, phase, timestamp
- ✅ List returns array of projects sorted by creation date
- ✅ Get returns correct project metadata

#### Materials API
```bash
# Save pasted materials
curl -X POST http://localhost:3001/api/materials/[projectId]/save \
  -H "Content-Type: application/json" \
  -d '{
    "materials":[
      {"type":"text","content":"Sample product content"}
    ]
  }'

# Scrape URL
curl -X POST http://localhost:3001/api/materials/[projectId]/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# Get materials
curl http://localhost:3001/api/materials/[projectId]
```

**Expected Results:**
- ✅ Materials saved with timestamp
- ✅ URL scraped successfully (title, content extracted)
- ✅ Get returns saved materials

#### Analysis API
```bash
# Analyze materials
curl -X POST http://localhost:3001/api/analysis/[projectId]/analyze

# Get analysis
curl http://localhost:3001/api/analysis/[projectId]
```

**Expected Results:**
- ✅ Returns structured analysis with keywords, positioning, angles
- ✅ Keywords include primary, longtail, negative
- ✅ Positioning includes unique value, target audience, advantages
- ✅ 7 ad angles present

#### Copy Generation API
```bash
# Generate copy
curl -X POST http://localhost:3001/api/copy/[projectId]/generate \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"[campaignId]"}'

# Get copy variations
curl http://localhost:3001/api/copy/[projectId]

# Approve variations
curl -X POST http://localhost:3001/api/copy/[projectId]/approve \
  -H "Content-Type: application/json" \
  -d '{"approvedIds":[1,3,5]}'
```

**Expected Results:**
- ✅ 5 variations generated with different angles/tones
- ✅ Each variation has Hebrew and English content
- ✅ Approved variations saved separately

#### Prompts API
```bash
# Generate prompts
curl -X POST http://localhost:3001/api/prompts/[projectId]/generate

# Get prompts
curl http://localhost:3001/api/prompts/[projectId]

# Save custom prompts
curl -X POST http://localhost:3001/api/prompts/[projectId]/save \
  -H "Content-Type: application/json" \
  -d '{"formats":{...}}'
```

**Expected Results:**
- ✅ Prompts generated for all 5 formats
- ✅ Format-specific details (carousel: 3 images, story: vertical, etc.)
- ✅ Custom prompts saved correctly

---

## Frontend Component Testing

### Home Page Tests
- [ ] Load projects list
  - Expected: Grid of project cards
  - Expected: "New Project" button works
  - Expected: Clicking card navigates to project

- [ ] Create project
  - Expected: Modal/form appears
  - Expected: Enter name, create button works
  - Expected: New project appears in list

### ProjectHome Navigation Tests
- [ ] Navigate to project
  - Expected: Shows project name
  - Expected: Shows "Phase X of 7"
  - Expected: Timeline of 7 phases visible
  - Expected: Phases with checkmarks if completed

- [ ] Click phases
  - Expected: Each phase has working link
  - Expected: Optional phases show "optional" badge
  - Expected: Navigates to correct page

### Materials Collection Tests
- [ ] Paste content
  - Expected: Text entered in textarea
  - Expected: Click "Add" button
  - Expected: Material appears in list

- [ ] URL scraping
  - Expected: Enter URL (try example.com)
  - Expected: Click "Scrape"
  - Expected: Shows spinner
  - Expected: Scraped content appears in list with title/description

- [ ] File upload (if available)
  - Expected: Upload area accepts files
  - Expected: File appears in list

- [ ] Materials list
  - Expected: All added materials shown
  - Expected: Can remove individual materials
  - Expected: "Continue to Analysis" button works

### Analysis Results Tests
- [ ] View analysis
  - Expected: Keywords tab shows primary/longtail/negative
  - Expected: Positioning tab shows UVP and target audience
  - Expected: Ad Angles tab shows all 7 angles
  - Expected: Audience tab shows demographics

- [ ] Bilingual support
  - Expected: Hebrew keywords appear correctly
  - Expected: No character encoding issues
  - Expected: RTL direction works if toggled

### Copy Generation Tests
- [ ] Generate 5 variations
  - Expected: Each variation different angle/tone
  - Expected: Bilingual headlines, body, CTA
  - Expected: Format hints visible (carousel, single, story, etc.)
  - Expected: Can select/deselect variations

- [ ] Approve variations
  - Expected: Selected variations save
  - Expected: Navigates to Phase 6

### Image Prompts Tests
- [ ] Generate prompts
  - Expected: 5 format tabs (carousel, single, story, video, collection)
  - Expected: Carousel shows 3 image prompts
  - Expected: Story shows vertical format hint
  - Expected: Video shows scene descriptions
  - Expected: Collection shows grid layout

- [ ] Edit prompts
  - Expected: Can edit each prompt in textarea
  - Expected: Changes save when clicking "Save & Generate"
  - Expected: Navigates to Phase 7

### Assets Generation Tests
- [ ] Generate assets
  - Expected: Spinner shows while generating
  - Expected: Gallery displays with image placeholders
  - Expected: Status checkmarks visible
  - Expected: Completion banner shows at bottom

- [ ] Asset gallery
  - Expected: Can switch between format tabs
  - Expected: Each asset shows prompt snippet
  - Expected: Timestamp visible

---

## End-to-End Workflow Tests

### Full Workflow (Happy Path)
1. **Home → Create Project**
   - [ ] Click "New Project"
   - [ ] Enter project name (e.g., "Test Client ABC")
   - [ ] Project created and appears in list

2. **Project → Phase 1: Materials**
   - [ ] Navigate to project
   - [ ] Click Phase 1
   - [ ] Add materials (mix: text, URL)
   - [ ] Click "Continue to Analysis"

3. **Phase 2: Analysis**
   - [ ] Page loads
   - [ ] Click "Start Analysis"
   - [ ] Wait for completion
   - [ ] View keywords, positioning, angles
   - [ ] Click "Continue to Research"

4. **Phase 3: Research**
   - [ ] Topic pre-filled from analysis
   - [ ] Check "Auto-discover" checkbox
   - [ ] Suggested themes appear
   - [ ] Click "Start Research"
   - [ ] Wait for research completion
   - [ ] Click "Continue to Campaign" (or navigate manually)

5. **Phase 4: Campaign**
   - [ ] Fields pre-filled from analysis
   - [ ] Edit description if desired
   - [ ] Click "Create Campaign"
   - [ ] Navigate to Phase 5

6. **Phase 5: Copy Generation**
   - [ ] Click "Generate Copy"
   - [ ] Wait for generation
   - [ ] View 5 variations with bilingual content
   - [ ] Select at least 1 variation
   - [ ] Click "Approve [X] Variations"

7. **Phase 6: Image Prompts**
   - [ ] Click "Generate Prompts"
   - [ ] Wait for generation
   - [ ] View 5 format tabs
   - [ ] Click through each format
   - [ ] Optionally edit prompts
   - [ ] Click "Save & Generate Assets"

8. **Phase 7: Assets**
   - [ ] Click "Generate Assets"
   - [ ] Wait for generation
   - [ ] View asset gallery
   - [ ] See completion banner
   - [ ] Click "Export Campaign"

**Expected Final Outcome:**
- ✅ All 7 phases completed
- ✅ All data saved in project folder structure
- ✅ Campaign ready for export

### Skip Path Testing
- [ ] Start Phase 1, add materials
- [ ] Phase 2: Click "Skip to Research"
  - Expected: Navigates to Phase 3 without analysis
- [ ] Phase 3: Click "Skip to Campaign"
  - Expected: Navigates to Phase 4 without research
- [ ] Phase 4: Click "Skip to Copy Generation"
  - Expected: Navigates to Phase 5 without campaign creation
- [ ] Phase 5: Click "Skip to Image Prompts"
  - Expected: Navigates to Phase 6 without copy gen
- [ ] Phase 6: Click "Skip to Asset Generation"
  - Expected: Navigates to Phase 7 without prompts

---

## Bilingual Support Tests

### Hebrew Content Tests
- [ ] Add Hebrew materials (copy-paste from Hebrew sources)
  - Expected: Hebrew text displays correctly
  - Expected: No character encoding issues

- [ ] Generate copy for Hebrew
  - Expected: Hebrew headlines readable
  - Expected: Hebrew body copy correct
  - Expected: Hebrew CTAs present

- [ ] RTL (Right-to-Left) Layout
  - Expected: Hebrew text aligns right
  - Expected: Components respect RTL direction
  - Expected: Lists/grids display correctly

### Language Consistency
- [ ] Every variation has both Hebrew + English
- [ ] No mixing of languages in single field
- [ ] Translations are semantically accurate

---

## Performance Tests

### Load Tests
- [ ] Create 5+ projects
  - Expected: Dashboard remains responsive
  - Expected: Projects list loads in <2s

- [ ] Generate analysis with 10+ materials
  - Expected: Completes in <30s
  - Expected: No timeout errors

- [ ] Generate 5 copy variations
  - Expected: Completes in <20s
  - Expected: All variations have complete content

### API Response Times
- Materials save: < 1s
- Analysis generation: < 30s
- Research API call: < 30s
- Copy generation: < 20s
- Prompts generation: < 25s
- Asset generation: < 2min (per image)

---

## Error Handling Tests

### Negative Cases
- [ ] Missing Anthropic API key
  - Expected: Error message in UI
  - Expected: Graceful fallback

- [ ] Network timeout
  - Expected: Timeout error shown
  - Expected: Retry button available

- [ ] Incomplete form
  - Expected: Validation errors
  - Expected: Submit button disabled

- [ ] Invalid URL for scraping
  - Expected: Error message
  - Expected: Can continue with other materials

- [ ] Skip phase without prior data
  - Expected: Allow skip (for flexibility)
  - Expected: Next phase handles missing data

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors in browser
- [ ] No API errors in server logs
- [ ] All environment variables configured
- [ ] `.env.example` created for reference
- [ ] `.env` NOT committed to git

### Build & Package
```bash
# Build React app
cd dashboard
npm run build
cd ..

# Verify build succeeded
ls -la dashboard/build/

# Test production build locally
npm install -g serve
serve -s dashboard/build -p 3000
```

### Server Configuration
```bash
# Set environment
export NODE_ENV=production
export PORT=3001

# Test server can start
npm start

# Verify health endpoint
curl http://localhost:3001/api/health
```

### Deployment Locations

#### Option A: Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --cwd ./dashboard
```

#### Option B: Heroku (Backend)
```bash
# Login to Heroku
heroku login

# Create app
heroku create israel-campaigns-api

# Set environment variables
heroku config:set ANTHROPIC_API_KEY=[key]
heroku config:set GOOGLE_GEMINI_API_KEY=[key]

# Deploy
git push heroku main
```

#### Option C: Docker (Self-hosted)
```bash
# Build Docker image
docker build -t israel-campaigns:latest .

# Run container
docker run -p 3001:3001 \
  -e ANTHROPIC_API_KEY=[key] \
  -e GOOGLE_GEMINI_API_KEY=[key] \
  israel-campaigns:latest
```

### Post-Deployment Verification
- [ ] Frontend loads without 404s
- [ ] API health check responds
- [ ] Can create a project
- [ ] Can add materials
- [ ] Can analyze materials
- [ ] Can generate copy
- [ ] Bilingual content works
- [ ] No sensitive data in logs

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Monitor API response times
- [ ] Track cost of Claude/Gemini API calls
- [ ] Set up alerts for API failures

---

## Production Considerations

### Security
- [ ] API keys stored in environment variables (never in code)
- [ ] HTTPS enabled on all endpoints
- [ ] CORS configured for frontend domain
- [ ] Input validation on all API endpoints
- [ ] Rate limiting on API routes (prevent abuse)

### Data Storage
- [ ] Backup `campaigns/` folder regularly
- [ ] Consider moving to cloud storage (S3, Google Cloud)
- [ ] Implement data retention policy
- [ ] GDPR compliance if EU users

### API Costs
- **Claude API**: ~$0.003 per 1K tokens (varies by model)
  - Analysis: ~500 tokens
  - Copy generation: ~1000 tokens
  - Prompts generation: ~1200 tokens
  - Estimated cost per campaign: $0.01-0.02

- **Gemini API**: Free tier available (100 req/day)
  - Production pricing: Pay-as-you-go (~$0.01-0.1 per image)
  - Estimated cost per campaign: $0.05-0.50 (5 images)

### Maintenance
- Monitor API deprecations
- Keep dependencies updated
- Review error logs weekly
- Optimize database queries if using database
- Plan for scaling (multi-region, load balancing)

---

## Rollback Plan

If issues occur in production:

1. **Immediate**: Revert to previous deployment
   ```bash
   vercel rollback  # Vercel
   # OR
   heroku releases:rollback  # Heroku
   ```

2. **Restore data**: Recover from backup
   - Check if campaigns folder has backups
   - Restore latest version

3. **Investigate**: Check error logs
   - API logs: `heroku logs --tail`
   - Browser console: Check for JS errors
   - Network tab: Check API response status

4. **Fix & redeploy**: After fix, deploy again

---

## Support & Troubleshooting

### Common Issues

**"ANTHROPIC_API_KEY not configured"**
- Set environment variable: `export ANTHROPIC_API_KEY=[key]`
- Restart backend server

**Analysis takes too long (>30s)**
- Check Claude API status
- Verify network connection
- May need to upgrade to faster API plan

**Images not generating**
- Verify Gemini API key is valid
- Check free tier limits (100/day)
- Prompts may be too complex; simplify them

**Hebrew content displaying incorrectly**
- Verify UTF-8 encoding on server
- Check browser charset in HTML head
- Clear browser cache

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm start

# Or set individually
export DEBUG=app:*
npm start
```

---

## Success Criteria

✅ **System is production-ready when:**
1. All 7 phases working end-to-end
2. Bilingual content (Hebrew + English) correct
3. All API endpoints responsive (<3s)
4. Error handling graceful (no crashes)
5. Performance acceptable (user-facing actions <5s)
6. Data persists correctly
7. Security best practices implemented
8. Monitoring/alerting configured
9. Rollback plan tested
10. Team trained on operations

---

## Next Steps

1. **Week 1**: Complete testing checklist
2. **Week 2**: Deploy to staging environment
3. **Week 3**: UAT with stakeholders
4. **Week 4**: Production deployment
5. **Ongoing**: Monitor, optimize, gather feedback

