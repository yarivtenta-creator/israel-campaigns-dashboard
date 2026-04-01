# Israel Meta Campaigns Dashboard

A comprehensive web-based dashboard for managing bilingual Meta advertising campaigns targeting Israeli market audiences. Built with React, Node.js/Express, and integrated with the `israel-meta-campaigns` skill.

## Features

✨ **Key Capabilities:**
- 🎯 Create isolated campaign briefs for different audience sectors
- 🌍 Full bilingual support (Hebrew + English)
- 📊 Side-by-side campaign comparison view
- 📁 Automatic workspace organization (01_Ads, 02_Copy, etc.)
- 💾 Export campaigns as JSON
- 🔍 Search and filter campaigns
- 📱 Responsive, mobile-friendly interface

## Project Structure

```
israel-campaigns-dashboard/
├── api/                          # Backend (Node.js/Express)
│   ├── server.js                # Express server
│   ├── routes/
│   │   └── campaigns.js         # API endpoints
│   └── services/
│       ├── workspace.js         # Folder/file management
│       └── skill-runner.js      # Skill integration
├── dashboard/                    # Frontend (React)
│   ├── src/
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # Styling
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Campaign list
│   │   │   ├── NewCampaign.jsx  # Create campaign
│   │   │   ├── CampaignView.jsx # View details
│   │   │   └── Compare.jsx      # Compare campaigns
│   │   └── index.jsx            # React entry point
│   └── public/
│       └── index.html           # HTML template
├── campaigns/                    # Campaign workspaces (auto-created)
├── config/                       # Configuration
├── package.json                  # Backend dependencies
└── dashboard/package.json        # Frontend dependencies
```

## Installation

### Prerequisites
- Node.js 14+
- npm or yarn

### Setup

1. **Clone/Copy the project**
   ```bash
   cd israel-campaigns-dashboard
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd dashboard
   npm install
   cd ..
   ```

4. **Configure environment**
   ```bash
   # Edit .env with your settings
   cp .env.example .env  # if available
   ```

## Running the Application

### Option 1: Concurrently (Recommended)

Install concurrently:
```bash
npm install --save-dev concurrently
```

Add to scripts in `package.json`:
```json
"dev": "concurrently \"npm start\" \"cd dashboard && npm start\""
```

Then run:
```bash
npm run dev
```

### Option 2: In Separate Terminals

**Terminal 1 - Backend:**
```bash
npm start
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd dashboard
npm start
# Dashboard opens on http://localhost:3000
```

### Option 3: Production Build

```bash
# Build frontend
cd dashboard
npm run build
cd ..

# Run server (serves React build)
npm start
# Dashboard available on http://localhost:3001
```

## API Endpoints

### Campaigns

- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create new campaign
- `POST /api/campaigns/compare` - Compare multiple campaigns
- `DELETE /api/campaigns/:id` - Delete campaign
- `GET /api/campaigns/:id/export/json` - Export as JSON

## Usage Workflow

### 1. Create a Campaign

1. Click "New Campaign" button
2. Enter:
   - **Campaign Topic**: Who you're targeting (e.g., "Teachers age 28-40")
   - **Description**: Detailed audience profile and context
   - **Sector**: Industry/category (Education, Legal, E-commerce, etc.)
   - **Notes**: Additional requirements
3. Click "Generate Campaign Brief"
4. Wait for generation to complete (~3-5 seconds)

### 2. View Campaign Details

1. Click on a campaign card to view full details
2. Navigate between tabs:
   - **Summary**: Overview and key metrics
   - **Full JSON**: Complete raw data
   - **Keywords**: Bilingual keywords with search intent
   - **Ad Copy Variants**: Multiple creative variations

### 3. Export Campaign

1. Click "Export JSON" to download campaign data
2. Use in Meta Ads Manager or for further customization

### 4. Compare Campaigns

1. Select 2+ campaigns by clicking their checkboxes
2. Click "Compare" button
3. View:
   - Side-by-side metrics table
   - Common audience interests
   - Budget differences
   - Unique keywords per campaign

## Workspace Structure

Each campaign creates an organized folder structure:

```
campaigns/[campaign-id]/
├── campaign_brief.json          # Complete campaign brief
├── metadata.json                # Campaign metadata
├── 01_Ads/                      # Ad specifications
├── 02_Copy/                     # Ad copy variants
├── 03_Campaign_Setup/           # Campaign configuration
├── 04_Audience_Targeting/       # Audience & keywords
├── 05_Links_and_WhatsApp/       # Engagement links
├── 06_Reports/                  # Performance data
├── 07_Client_Delivery/          # Final deliverables
└── 08_Backups/                  # Backup files
```

## Integration with israel-meta-campaigns Skill

The dashboard integrates with the `israel-meta-campaigns` skill to generate briefs. The skill provides:

- Bilingual keyword research
- Audience targeting recommendations
- Multiple ad copy variants
- Bid strategy suggestions
- Device/geo performance analysis
- WhatsApp engagement sequences

To connect your skill:

1. Place skill files in the project or reference them
2. Update `api/services/skill-runner.js` with Claude API integration
3. Set `ANTHROPIC_API_KEY` in `.env`

## Campaign Brief Structure

Each generated brief includes:

```json
{
  "campaign_brief": {
    "metadata": {...},
    "keywords": {
      "primary": [...],
      "longtail": [...],
      "negative_keywords": [...]
    },
    "audience_targeting": {...},
    "ad_copy_variants": [...],
    "campaign_naming": {...},
    "bid_strategy": {...},
    "performance_analysis": {...},
    "whatsapp_strategy": {...}
  }
}
```

## Configuration

### Environment Variables

- `PORT`: Backend server port (default: 3001)
- `NODE_ENV`: Development or production
- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude integration

### Customization

- **Sectors**: Edit `SECTORS` array in `dashboard/src/pages/NewCampaign.jsx`
- **Folder Structure**: Modify `FOLDERS` array in `api/services/workspace.js`
- **Styling**: Edit `dashboard/src/App.css`

## Features in Progress

- [ ] PDF export capability
- [ ] Campaign templates
- [ ] Bulk campaign creation
- [ ] Performance tracking integration
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Dependencies Missing
```bash
npm install
cd dashboard && npm install && cd ..
```

### API Connection Issues

- Verify backend is running on port 3001
- Check `ANTHROPIC_API_KEY` in `.env`
- Verify API routes in `api/routes/campaigns.js`

## Development

### Adding a New Page

1. Create file: `dashboard/src/pages/YourPage.jsx`
2. Add route in `App.jsx`:
   ```jsx
   <Route path="/your-page" element={<YourPage />} />
   ```
3. Add navigation link in relevant component

### Adding API Endpoint

1. Add route in `api/routes/campaigns.js`
2. Implement logic in `api/services/`
3. Call from frontend using `axios`

## Deployment

### Vercel (Recommended for Frontend)

```bash
cd dashboard
vercel deploy
```

### Render (For Backend)

```bash
# Create Render account and app
# Connect GitHub repository
# Set environment variables
# Deploy
```

### Self-Hosted

```bash
npm run build
npm start
```

Access on `http://your-domain:3001`

## Support

For issues or questions:
1. Check troubleshooting section
2. Review API logs in server console
3. Check browser console for frontend errors

## License

MIT

## Contributing

Contributions welcome! Please:
1. Fork the project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request
