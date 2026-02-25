import React, { useMemo, useState } from "react";
import { mockCuisines, mockDiets, mockMealTypes, mockRecipes } from "../data/mockRecipes";

function countByKey(recipes, getter) {
  const map = new Map();
  recipes.forEach((r) => {
    const values = getter(r);
    values.forEach((v) => {
      const key = String(v || "").trim();
      if (!key) return;
      map.set(key, (map.get(key) || 0) + 1);
    });
  });
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

// PUBLIC_INTERFACE
export default function CategoriesPage() {
  /** Browse categories derived from mock data (cuisine, diet, meal type). */
  const [activeTab, setActiveTab] = useState("cuisine"); // cuisine | diet | mealType
  const [q, setQ] = useState("");

  const normalizedQuery = String(q || "").trim().toLowerCase();

  const cuisineItems = useMemo(
    () => countByKey(mockRecipes, (r) => [r.cuisine]).filter((x) => mockCuisines.includes(x.name)),
    []
  );
  const dietItems = useMemo(
    () => countByKey(mockRecipes, (r) => r.diet || []).filter((x) => mockDiets.includes(x.name)),
    []
  );
  const mealTypeItems = useMemo(
    () => countByKey(mockRecipes, (r) => r.mealType || []).filter((x) => mockMealTypes.includes(x.name)),
    []
  );

  const activeItems = useMemo(() => {
    const all =
      activeTab === "diet"
        ? dietItems
        : activeTab === "mealType"
          ? mealTypeItems
          : cuisineItems;

    if (!normalizedQuery) return all;
    return all.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
  }, [activeTab, normalizedQuery, cuisineItems, dietItems, mealTypeItems]);

  return (
    <section className="page">
      <h1 className="page__title">Categories</h1>
      <p className="page__description">
        Browse recipes by common groupings derived from the dataset.
      </p>

      <div className="tabs" role="tablist" aria-label="Category types">
        <button
          type="button"
          className={`tab ${activeTab === "cuisine" ? "is-active" : ""}`}
          onClick={() => setActiveTab("cuisine")}
          role="tab"
          aria-selected={activeTab === "cuisine"}
        >
          Cuisines
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "diet" ? "is-active" : ""}`}
          onClick={() => setActiveTab("diet")}
          role="tab"
          aria-selected={activeTab === "diet"}
        >
          Diets
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "mealType" ? "is-active" : ""}`}
          onClick={() => setActiveTab("mealType")}
          role="tab"
          aria-selected={activeTab === "mealType"}
        >
          Meal types
        </button>
      </div>

      <div className="category-toolbar">
        <label className="filters__field filters__field--grow">
          <span className="filters__label">Filter categories</span>
          <input
            className="input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type to filter…"
            autoComplete="off"
          />
        </label>
      </div>

      {activeItems.length === 0 ? (
        <div className="state state--empty" role="status" aria-live="polite">
          <div className="state__title">No categories match</div>
          <div className="state__subtitle">Try a different search.</div>
          <button type="button" className="btn" onClick={() => setQ("")}>
            Clear
          </button>
        </div>
      ) : (
        <div className="category-grid" aria-label="Category list">
          {activeItems.map((item) => (
            <button
              key={item.name}
              type="button"
              className="category-tile"
              onClick={() => {
                // Step 04 scope: category browsing only.
                // In later steps, this will deep-link to Feed with query params.
              }}
              aria-label={`${item.name}, ${item.count} recipes`}
            >
              <div className="category-tile__name">{item.name}</div>
              <div className="category-tile__count">{item.count} recipes</div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
