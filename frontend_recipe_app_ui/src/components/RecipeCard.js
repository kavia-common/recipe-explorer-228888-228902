import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Small presentational card for a recipe.
 * - Uses <article> semantics
 * - Supports keyboard focus via the link
 */
// PUBLIC_INTERFACE
export default function RecipeCard({
  recipe,
  onSelect,
  actionSlot,
  isFavorite = false,
  onToggleFavorite
}) {
  /** Render a responsive recipe card (image, title, metadata). */
  const location = useLocation();
  if (!recipe) return null;

  const handleSelect = (event) => {
    // If a parent still passes onSelect (legacy), keep it working.
    // Otherwise, allow normal <Link> navigation.
    if (!onSelect) return;
    event.preventDefault();
    onSelect(recipe);
  };

  const canToggleFavorite = typeof onToggleFavorite === "function";

  return (
    <article className="recipe-card">
      <Link
        className="recipe-card__link"
        to={`/recipes/${encodeURIComponent(recipe.id)}`}
        state={{ from: location.pathname + location.search }}
        onClick={handleSelect}
        aria-label={`View recipe: ${recipe.title}`}
      >
        <div className="recipe-card__media" aria-hidden="true">
          {recipe.imageUrl ? (
            <img
              className="recipe-card__image"
              src={recipe.imageUrl}
              alt=""
              loading="lazy"
            />
          ) : (
            <div className="recipe-card__image recipe-card__image--placeholder" />
          )}
        </div>

        <div className="recipe-card__body">
          <div className="recipe-card__header">
            <h3 className="recipe-card__title">{recipe.title}</h3>

            {actionSlot || canToggleFavorite ? (
              <div className="recipe-card__action" aria-label="Card actions">
                {actionSlot}
                {canToggleFavorite ? (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    onClick={(e) => {
                      // Prevent the underlying Link navigation.
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleFavorite(recipe);
                    }}
                  >
                    {isFavorite ? "★ Saved" : "☆ Save"}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <p className="recipe-card__description">{recipe.description}</p>

          <dl className="recipe-card__meta" aria-label="Recipe details">
            <div className="recipe-card__meta-item">
              <dt>Cuisine</dt>
              <dd>{recipe.cuisine || "—"}</dd>
            </div>
            <div className="recipe-card__meta-item">
              <dt>Cook</dt>
              <dd>
                {typeof recipe.cookTimeMinutes === "number"
                  ? `${recipe.cookTimeMinutes} min`
                  : "—"}
              </dd>
            </div>
            <div className="recipe-card__meta-item">
              <dt>Diet</dt>
              <dd>{(recipe.diet || []).slice(0, 2).join(", ") || "Any"}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
}
