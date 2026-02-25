import React, { useEffect, useMemo, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import RecipeFilters from "../components/RecipeFilters";
import { recipesApi } from "../services/recipesApi";
import { mockCuisines, mockDiets } from "../data/mockRecipes";

function normalizeSelectValue(value) {
  return String(value || "");
}

function toOptionalNumber(value) {
  const raw = String(value || "").trim();
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

// PUBLIC_INTERFACE
export default function FeedPage() {
  /** Feed/Browse screen: search, filters, responsive grid, loading + empty states. */
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [maxCookTime, setMaxCookTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const params = useMemo(
    () => ({
      q: query,
      cuisine: normalizeSelectValue(cuisine),
      diet: normalizeSelectValue(diet),
      maxCookTimeMinutes: toOptionalNumber(maxCookTime),
      sort: "relevance"
    }),
    [query, cuisine, diet, maxCookTime]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const res = await recipesApi.listRecipes(params);
      if (cancelled) return;

      if (res.error) {
        setError(res.error);
        setRecipes([]);
      } else {
        setRecipes(res.data?.items || []);
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [params]);

  const hasFilters = Boolean(query || cuisine || diet || maxCookTime);

  return (
    <section className="page">
      <h1 className="page__title">Feed</h1>
      <p className="page__description">
        Search recipes and narrow results by cuisine, diet, and cook time.
      </p>

      <RecipeFilters
        query={query}
        onQueryChange={setQuery}
        cuisine={cuisine}
        onCuisineChange={setCuisine}
        diet={diet}
        onDietChange={setDiet}
        maxCookTime={maxCookTime}
        onMaxCookTimeChange={setMaxCookTime}
        cuisines={mockCuisines}
        diets={mockDiets}
      />

      {loading ? (
        <div className="state state--loading" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <div>
            <div className="state__title">Loading recipes…</div>
            <div className="state__subtitle">Fetching the latest mock data.</div>
          </div>
        </div>
      ) : error ? (
        <div className="state state--error" role="alert">
          <div className="state__title">Couldn’t load recipes</div>
          <div className="state__subtitle">{error.message || "Unknown error."}</div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="state state--empty" role="status" aria-live="polite">
          <div className="state__title">No recipes found</div>
          <div className="state__subtitle">
            {hasFilters
              ? "Try clearing filters or searching for something else."
              : "No recipes are available yet."}
          </div>
          {hasFilters ? (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setQuery("");
                setCuisine("");
                setDiet("");
                setMaxCookTime("");
              }}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="results-bar" aria-label="Results summary">
            <div className="results-bar__count">
              Showing <strong>{recipes.length}</strong> recipe{recipes.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="recipe-grid" role="list" aria-label="Recipe results">
            {recipes.map((recipe) => (
              <div key={recipe.id} role="listitem">
                <RecipeCard
                  recipe={recipe}
                  onSelect={() => {
                    // Step 04 scope: browse only. Detail route comes later.
                    // Keep a no-op action for now.
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
