import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import NewCampaign from './pages/NewCampaign';
import CampaignView from './pages/CampaignView';
import Compare from './pages/Compare';
import ResearchStart from './pages/ResearchStart';
import ResearchResults from './pages/ResearchResults';
import AdGenerator from './pages/AdGenerator';

import ProjectHome from './pages/ProjectHome';
import AddMaterials from './pages/AddMaterials';
import AnalyzeMaterials from './pages/AnalyzeMaterials';
import CampaignSetup from './pages/CampaignSetup';
import GenerateCopy from './pages/GenerateCopy';
import ImagePrompts from './pages/ImagePrompts';
import GenerateAssets from './pages/GenerateAssets';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Legacy routes */}
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewCampaign />} />
        <Route path="/campaign/:id" element={<CampaignView />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/research" element={<ResearchStart />} />
        <Route path="/research/:id" element={<ResearchResults />} />
        <Route path="/research/:id/ads" element={<AdGenerator />} />

        {/* New workflow routes */}
        <Route path="/project/:projectId" element={<ProjectHome />} />
        <Route path="/project/:projectId/phase/1" element={<AddMaterials />} />
        <Route path="/project/:projectId/phase/2" element={<AnalyzeMaterials />} />
        <Route path="/project/:projectId/phase/3" element={<ResearchStart />} />
        <Route path="/project/:projectId/phase/4" element={<CampaignSetup />} />
        <Route path="/project/:projectId/phase/5" element={<GenerateCopy />} />
        <Route path="/project/:projectId/phase/6" element={<ImagePrompts />} />
        <Route path="/project/:projectId/phase/7" element={<GenerateAssets />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
