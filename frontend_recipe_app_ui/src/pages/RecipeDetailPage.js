import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { recipesApi } from "../services/recipesApi";

function formatMinutes(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return `${value} min`;
}

function formatServings(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return `${value}`;
}

function joinOrFallback(values, fallback) {
  const arr = Array.isArray(values) ? values.filter(Boolean) : [];
  if (arr.length === 0) return fallback;
  return arr.join(", ");
}

function buildIngredientLine(ingredient) {
  if (!ingredient) return "";
  const quantity = String(ingredient.quantity || "").trim();
  const unit = String(ingredient.unit || "").trim();
  const name = String(ingredient.name || "").trim();

  const quantityPart = quantity ? quantity : "";
  const unitPart = unit ? ` ${unit}` : "";
  const spacer = quantityPart || unitPart ? " " : "";

  return `${quantityPart}${unitPart}${spacer}${name}`.trim();
}

// PUBLIC_INTERFACE
export default function RecipeDetailPage() {
  /** Recipe detail screen: loads a recipe by id and shows media, metadata, ingredients, and steps. */
  const { recipeId } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState(null);

  // Preserve the originating page (Feed, Categories, etc.) when navigating via Link state.
  const backLink = useMemo(() => {
    const fallback = "/";
    const from = location.state?.from;
    if (typeof from === "string" && from.trim()) return from;
    return fallback;
  }, [location.state]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setRecipe(null);

      const res = await recipesApi.getRecipeById(recipeId);
      if (cancelled) return;

      if (res.error) {
        setError(res.error);
        setRecipe(null);
      } else {
        setRecipe(res.data);
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  if (loading) {
    return (
      <section className="page">
        <div className="detail-topbar">
          <Link className="btn btn--ghost" to={backLink}>
            ← Back
          </Link>
        </div>

        <div className="state state--loading" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <div>
            <div className="state__title">Loading recipe…</div>
            <div className="state__subtitle">Fetching details for {recipeId}.</div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !recipe) {
    const status = error?.status;
    const isNotFound = status === 404;

    return (
      <section className="page">
        <div className="detail-topbar">
          <Link className="btn btn--ghost" to={backLink}>
            ← Back
          </Link>
        </div>

        <div className="state state--error" role="alert">
          <div className="state__title">
            {isNotFound ? "Recipe not found" : "Couldn’t load recipe"}
          </div>
          <div className="state__subtitle">
            {error?.message || "Unknown error."}
          </div>

          <div className="detail-actions">
            <Link className="btn" to="/">
              Go to Feed
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const steps = Array.isArray(recipe.steps) ? recipe.steps : [];
  const diet = joinOrFallback(recipe.diet, "Any");
  const mealType = joinOrFallback(recipe.mealType, "—");
  const tags = joinOrFallback(recipe.tags, "—");

  return (
    <section className="page" aria-label={`Recipe detail: ${recipe.title}`}>
      <div className="detail-topbar">
        <Link className="btn btn--ghost" to={backLink} aria-label="Go back">
          ← Back
        </Link>
      </div>

      <header className="detail-header">
        <div className="detail-hero">
          {recipe.imageUrl ? (
            <img
              className="detail-hero__image"
              src={recipe.imageUrl}
              alt={recipe.title}
            />
          ) : (
            <div
              className="detail-hero__image detail-hero__image--placeholder"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="detail-summary">
          <h1 className="detail-title">{recipe.title}</h1>
          <p className="detail-description">{recipe.description}</p>

          <dl className="detail-meta" aria-label="Recipe metadata">
            <div className="detail-meta__item">
              <dt>Cuisine</dt>
              <dd>{recipe.cuisine || "—"}</dd>
            </div>
            <div className="detail-meta__item">
              <dt>Meal</dt>
              <dd>{mealType}</dd>
            </div>
            <div className="detail-meta__item">
              <dt>Diet</dt>
              <dd>{diet}</dd>
            </div>
            <div className="detail-meta__item">
              <dt>Cook time</dt>
              <dd>{formatMinutes(recipe.cookTimeMinutes)}</dd>
            </div>
            <div className="detail-meta__item">
              <dt>Servings</dt>
              <dd>{formatServings(recipe.servings)}</dd>
            </div>
            <div className="detail-meta__item">
              <dt>Difficulty</dt>
              <dd>{recipe.difficulty || "—"}</dd>
            </div>
          </dl>

          <div className="detail-tags" aria-label="Recipe tags">
            <div className="detail-tags__label">Tags</div>
            <div className="detail-tags__value">{tags}</div>
          </div>
        </div>
      </header>

      <div className="detail-grid">
        <section className="detail-card" aria-label="Ingredients">
          <h2 className="detail-card__title">Ingredients</h2>
          {ingredients.length === 0 ? (
            <p className="detail-card__empty">No ingredients listed.</p>
          ) : (
            <ul className="detail-list" aria-label="Ingredient list">
              {ingredients.map((ingredient, idx) => (
                <li key={`${ingredient?.name || "ingredient"}-${idx}`}>
                  {buildIngredientLine(ingredient)}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="detail-card" aria-label="Instructions">
          <h2 className="detail-card__title">Instructions</h2>
          {steps.length === 0 ? (
            <p className="detail-card__empty">No steps listed.</p>
          ) : (
            <ol className="detail-steps" aria-label="Step-by-step instructions">
              {steps.map((step, idx) => (
                <li key={`step-${idx}`}>{step}</li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </section>
  );
}
