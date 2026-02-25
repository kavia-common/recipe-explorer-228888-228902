import React from "react";

// PUBLIC_INTERFACE
export default function FavoritesPage() {
  /** Favorites page placeholder. */
  return (
    <section className="page">
      <h1 className="page__title">Favorites</h1>
      <p className="page__description">
        This will show bookmarked recipes stored in local storage.
      </p>
      <div className="placeholder-card" role="status" aria-label="Placeholder content">
        Coming soon: favorites list and empty-state UI.
      </div>
    </section>
  );
}
