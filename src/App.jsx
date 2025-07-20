import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from './auth/Login';
import Home from './pages/Home';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from "./layout/AppLayout";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Dashboard Layout */}
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;