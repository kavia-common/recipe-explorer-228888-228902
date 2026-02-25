import React, { useMemo } from "react";
import RecipeCard from "../components/RecipeCard";
import useLocalStorage from "../hooks/useLocalStorage";

// PUBLIC_INTERFACE
export default function FavoritesPage() {
  /** Favorites page: list bookmarked recipes persisted in localStorage. */
  const [favoritesById, setFavoritesById] = useLocalStorage("recipeExplorer.favoritesById", {});

  const favorites = useMemo(() => {
    const obj = favoritesById && typeof favoritesById === "object" ? favoritesById : {};
    return Object.values(obj).filter(Boolean);
  }, [favoritesById]);

  const toggleFavorite = (recipe) => {
    if (!recipe?.id) return;

    setFavoritesById((prev) => {
      const safePrev = prev && typeof prev === "object" ? prev : {};
      const next = { ...safePrev };

      if (next[recipe.id]) {
        delete next[recipe.id];
      } else {
        next[recipe.id] = {
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          imageUrl: recipe.imageUrl,
          cuisine: recipe.cuisine,
          diet: recipe.diet,
          cookTimeMinutes: recipe.cookTimeMinutes
        };
      }

      return next;
    });
  };

  return (
    <section className="page">
      <h1 className="page__title">Favorites</h1>
      <p className="page__description">
        Recipes you’ve saved on this device (stored in local storage).
      </p>

      {favorites.length === 0 ? (
        <div className="state state--empty" role="status" aria-live="polite">
          <div className="state__title">No favorites yet</div>
          <div className="state__subtitle">
            Tap “Save” on any recipe card or detail page to bookmark it here.
          </div>
        </div>
      ) : (
        <>
          <div className="results-bar" aria-label="Favorites summary">
            <div className="results-bar__count">
              Showing <strong>{favorites.length}</strong> favorite
              {favorites.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="recipe-grid" role="list" aria-label="Favorite recipes">
            {favorites.map((recipe) => (
              <div key={recipe.id} role="listitem">
                <RecipeCard
                  recipe={recipe}
                  isFavorite={Boolean(favoritesById?.[recipe.id])}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
