import React from "react";

// PUBLIC_INTERFACE
export default function RecipeFilters({
  query,
  onQueryChange,
  cuisine,
  onCuisineChange,
  diet,
  onDietChange,
  maxCookTime,
  onMaxCookTimeChange,
  cuisines = [],
  diets = []
}) {
  /** Controlled filter bar for recipe browsing (search, cuisine, diet, cook time). */
  return (
    <form className="filters" role="search" aria-label="Search and filters">
      <div className="filters__row">
        <label className="filters__field filters__field--grow">
          <span className="filters__label">Search</span>
          <input
            className="input"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search recipes, tags, ingredients..."
            autoComplete="off"
          />
        </label>

        <label className="filters__field">
          <span className="filters__label">Cuisine</span>
          <select
            className="select"
            value={cuisine}
            onChange={(e) => onCuisineChange(e.target.value)}
          >
            <option value="">All</option>
            {cuisines.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="filters__field">
          <span className="filters__label">Diet</span>
          <select
            className="select"
            value={diet}
            onChange={(e) => onDietChange(e.target.value)}
          >
            <option value="">Any</option>
            {diets.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="filters__field">
          <span className="filters__label">Cook time</span>
          <select
            className="select"
            value={maxCookTime}
            onChange={(e) => onMaxCookTimeChange(e.target.value)}
          >
            <option value="">Any</option>
            <option value="15">≤ 15 min</option>
            <option value="30">≤ 30 min</option>
            <option value="45">≤ 45 min</option>
            <option value="60">≤ 60 min</option>
          </select>
        </label>
      </div>
    </form>
  );
}
