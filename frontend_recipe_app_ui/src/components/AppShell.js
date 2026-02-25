import React from "react";
import { NavLink, Outlet } from "react-router-dom";

/**
 * Routed application shell with a persistent header + navigation and an outlet
 * for page content.
 */
export default function AppShell() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="brand">
            <div className="brand__title">Recipe Explorer</div>
            <div className="brand__subtitle">Browse, save, and plan meals</div>
          </div>

          <nav className="nav" aria-label="Primary">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            >
              Feed
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            >
              Categories
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            >
              Favorites
            </NavLink>
            <NavLink
              to="/planner"
              className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            >
              Planner
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main" role="main">
        <Outlet />
      </main>
    </div>
  );
}
