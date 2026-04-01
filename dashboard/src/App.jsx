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
        {/* Phases 4-7 map to existing or new pages */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
