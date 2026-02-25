import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import AppShell from "./components/AppShell";
import CategoriesPage from "./pages/CategoriesPage";
import FavoritesPage from "./pages/FavoritesPage";
import FeedPage from "./pages/FeedPage";
import NotFoundPage from "./pages/NotFoundPage";
import PlannerPage from "./pages/PlannerPage";

// PUBLIC_INTERFACE
function App() {
  /** Application entry component providing routing and the shared shell layout. */
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<FeedPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/planner" element={<PlannerPage />} />

          {/* Convenience redirect for potential future legacy path */}
          <Route path="/feed" element={<Navigate to="/" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
