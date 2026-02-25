import React from "react";

// PUBLIC_INTERFACE
export default function FeedPage() {
  /** Feed landing page placeholder. */
  return (
    <section className="page">
      <h1 className="page__title">Feed</h1>
      <p className="page__description">
        This will become the recipe feed with search and filters.
      </p>
      <div className="placeholder-card" role="status" aria-label="Placeholder content">
        Coming soon: recipe cards, search bar, cuisine/diet filters.
      </div>
    </section>
  );
}
