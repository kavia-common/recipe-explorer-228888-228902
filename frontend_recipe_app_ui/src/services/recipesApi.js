import { mockRecipes } from "../data/mockRecipes";

/**
 * Decide which base URL to use for future backend calls.
 * - Prefer REACT_APP_API_BASE when set.
 * - Otherwise fall back to REACT_APP_BACKEND_URL.
 * - If neither is provided, we still serve mock data.
 */
function getApiBaseUrl() {
  const candidate =
    process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "";
  return String(candidate || "").replace(/\/+$/, "");
}

/**
 * Small helper to build a URL (for future fetch calls).
 * Keeps mock API method signatures aligned with what a real backend will need.
 */
function buildUrl(path, query) {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base || "http://localhost"}${normalizedPath}`);

  // Note: if base is empty we still construct a valid URL object using localhost,
  // but we do not actually fetch; we return mock data.
  if (query && typeof query === "object") {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  return url;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function applyFilters(recipes, filters) {
  const q = normalizeText(filters?.q);
  const cuisine = normalizeText(filters?.cuisine);
  const diet = normalizeText(filters?.diet);
  const mealType = normalizeText(filters?.mealType);
  const maxCookTimeMinutes = filters?.maxCookTimeMinutes;

  return recipes.filter((r) => {
    if (q) {
      const haystack = normalizeText(`${r.title} ${r.description} ${(r.tags || []).join(" ")}`);
      if (!haystack.includes(q)) return false;
    }

    if (cuisine && normalizeText(r.cuisine) !== cuisine) return false;

    if (diet) {
      const diets = (r.diet || []).map(normalizeText);
      if (!diets.includes(diet)) return false;
    }

    if (mealType) {
      const types = (r.mealType || []).map(normalizeText);
      if (!types.includes(mealType)) return false;
    }

    if (typeof maxCookTimeMinutes === "number" && Number.isFinite(maxCookTimeMinutes)) {
      if ((r.cookTimeMinutes || 0) > maxCookTimeMinutes) return false;
    }

    return true;
  });
}

function sortRecipes(recipes, sortKey) {
  const key = normalizeText(sortKey);

  if (!key || key === "relevance") return recipes;

  const clone = [...recipes];
  if (key === "cooktime") {
    clone.sort((a, b) => (a.cookTimeMinutes || 0) - (b.cookTimeMinutes || 0));
  } else if (key === "title") {
    clone.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  }
  return clone;
}

/**
 * Standard API response shape used by this service.
 * @typedef {Object} ApiResponse
 * @property {any} data
 * @property {Object|null} error
 * @property {string|null} error.message
 * @property {number|null} error.status
 */

/**
 * Create a consistent response, shaped like a real fetch wrapper.
 * @param {any} data
 * @returns {ApiResponse}
 */
function ok(data) {
  return { data, error: null };
}

/**
 * Create a consistent error response.
 * @param {string} message
 * @param {number} [status]
 * @returns {ApiResponse}
 */
function fail(message, status) {
  return { data: null, error: { message, status: status ?? null } };
}

/**
 * Whether we should use live HTTP requests.
 * Currently we ALWAYS use mock data, but keep the shape for future integration.
 */
function shouldUseLiveFetch() {
  return false;
}

/**
 * "Fetch wrapper" for future backend integration.
 * This is intentionally not used yet, but exists so the API layer matches future work.
 */
async function httpGet(path, query) {
  const base = getApiBaseUrl();
  if (!base) return fail("No API base URL configured.", 500);

  const url = buildUrl(path, query);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" }
  });

  if (!res.ok) {
    return fail(`Request failed with status ${res.status}`, res.status);
  }

  const json = await res.json();
  return ok(json);
}

/**
 * API methods used by the UI. These return Promise<ApiResponse>.
 */
export const recipesApi = {
  // PUBLIC_INTERFACE
  async listRecipes(params = {}) {
    /**
     * List recipes (future: GET /recipes).
     *
     * Params supported now (mock filtering):
     * - q: text query
     * - cuisine, diet, mealType
     * - maxCookTimeMinutes: number
     * - sort: "relevance" | "cookTime" | "title"
     */
    if (shouldUseLiveFetch()) {
      return httpGet("/recipes", params);
    }

    // Simulate network latency
    await delay(250);

    const filtered = applyFilters(mockRecipes, params);
    const sorted = sortRecipes(filtered, params.sort);

    return ok({
      items: sorted,
      total: sorted.length
    });
  },

  // PUBLIC_INTERFACE
  async getRecipeById(recipeId) {
    /**
     * Get recipe details (future: GET /recipes/:id).
     */
    if (!recipeId) return fail("recipeId is required.", 400);

    if (shouldUseLiveFetch()) {
      return httpGet(`/recipes/${encodeURIComponent(recipeId)}`);
    }

    await delay(180);

    const recipe = mockRecipes.find((r) => r.id === recipeId);
    if (!recipe) return fail("Recipe not found.", 404);

    return ok(recipe);
  }
};

export default recipesApi;
