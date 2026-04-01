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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewCampaign />} />
        <Route path="/campaign/:id" element={<CampaignView />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/research" element={<ResearchStart />} />
        <Route path="/research/:id" element={<ResearchResults />} />
        <Route path="/research/:id/ads" element={<AdGenerator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
