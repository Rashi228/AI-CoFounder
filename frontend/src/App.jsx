import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import GetStarted from './pages/GetStarted';
import ForgotPassword from './pages/ForgotPassword';
import IdeaInput from './pages/IdeaInput';
import ProblemRefinement from './pages/ProblemRefinement';
import MarketResearch from './pages/MarketResearch';
import BusinessModels from './pages/BusinessModels';
import FinancialProjections from './pages/FinancialProjections';
import ValidationExperiments from './pages/ValidationExperiments';
import CoFounderMatching from './pages/CoFounderMatching';
import PitchDeck from './pages/PitchDeck';
import SharedPitchDeck from './pages/SharedPitchDeck';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/idea-input" element={
              <ProtectedRoute>
                <IdeaInput />
              </ProtectedRoute>
            } />
            <Route path="/problem-refinement" element={
              <ProtectedRoute>
                <ProblemRefinement />
              </ProtectedRoute>
            } />
            <Route path="/market-research" element={
              <ProtectedRoute>
                <MarketResearch />
              </ProtectedRoute>
            } />
            <Route path="/business-models" element={
              <ProtectedRoute>
                <BusinessModels />
              </ProtectedRoute>
            } />
            <Route path="/financial-projections" element={
              <ProtectedRoute>
                <FinancialProjections />
              </ProtectedRoute>
            } />
            <Route path="/validation-experiments" element={
              <ProtectedRoute>
                <ValidationExperiments />
              </ProtectedRoute>
            } />
            <Route path="/cofounder-matching" element={
              <ProtectedRoute>
                <CoFounderMatching />
              </ProtectedRoute>
            } />
            <Route path="/pitch-deck" element={
              <ProtectedRoute>
                <PitchDeck />
              </ProtectedRoute>
            } />
            <Route path="/pitch-deck/shared/:shareToken" element={<SharedPitchDeck />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
