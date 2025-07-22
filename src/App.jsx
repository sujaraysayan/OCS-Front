import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from './auth/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TraceabilityReport from './pages/traceability';
import CMC from './pages/stationStandard/cmc';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from "./layout/AppLayout";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/traceability" element={<TraceabilityReport />} />
              <Route path="/cmc" element={<CMC />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;