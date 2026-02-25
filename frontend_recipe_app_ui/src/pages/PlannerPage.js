import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { mockRecipes } from "../data/mockRecipes";

const PLANNER_STORAGE_KEY = "recipeExplorer.mealPlan.v1";

/**
 * Parse feature flags from REACT_APP_FEATURE_FLAGS.
 * Supported forms:
 * - "planner" (comma/space separated)
 * - "planner=true" / "planner=false"
 * - JSON object string: {"planner":true}
 */
function isPlannerEnabledFromEnv() {
  const raw = process.env.REACT_APP_FEATURE_FLAGS;

  if (!raw) return true; // planner is optional, but default to enabled unless explicitly disabled.
  const trimmed = String(raw).trim();
  if (!trimmed) return true;

  // Try JSON first to allow feature-flagging systems to inject structured config.
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      const value = parsed?.planner;
      if (typeof value === "boolean") return value;
      if (typeof value === "string") return value.toLowerCase() !== "false";
      return Boolean(value);
    } catch {
      // Fall through to token parsing.
    }
  }

  const tokens = trimmed
    .split(/[,\s]+/g)
    .map((t) => t.trim())
    .filter(Boolean);

  // If there's an explicit "planner=false" token, treat as disabled.
  for (const token of tokens) {
    const [key, val] = token.split("=");
    if (String(key || "").toLowerCase() !== "planner") continue;
    if (val === undefined) return true;
    return String(val).toLowerCase() !== "false";
  }

  // Otherwise, enable only if "planner" is present; if not present, keep enabled
  // to avoid surprising behavior when flags include other features.
  return tokens.some((t) => t.toLowerCase() === "planner") ? true : true;
}

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" }
];

const SLOTS = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" }
];

function buildEmptyPlan() {
  /** Build a fresh empty plan object. */
  const plan = {};
  DAYS.forEach((d) => {
    plan[d.key] = {};
    SLOTS.forEach((s) => {
      plan[d.key][s.key] = null;
    });
  });
  return plan;
}

function coercePlanShape(value) {
  /**
   * Ensure whatever we loaded from localStorage matches our expected plan shape.
   * This makes the feature resilient to storage corruption or future schema changes.
   */
  const empty = buildEmptyPlan();
  if (!value || typeof value !== "object") return empty;

  const next = {};
  DAYS.forEach((d) => {
    const dayObj = value?.[d.key];
    next[d.key] = {};
    SLOTS.forEach((s) => {
      const candidate = dayObj?.[s.key];
      next[d.key][s.key] =
        typeof candidate === "string" && candidate.trim() ? candidate : null;
    });
  });
  return next;
}

function getRecipeSnapshot(recipeId) {
  /** Resolve a compact display model from our mock dataset. */
  const recipe = mockRecipes.find((r) => r.id === recipeId);
  if (!recipe) return null;
  return {
    id: recipe.id,
    title: recipe.title,
    cuisine: recipe.cuisine,
    cookTimeMinutes: recipe.cookTimeMinutes
  };
}

function formatCookTime(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return `${value} min`;
}

// PUBLIC_INTERFACE
export default function PlannerPage() {
  /** Optional meal planner page: assign recipes to day/slot cells and persist plan in localStorage. */
  const plannerEnabled = isPlannerEnabledFromEnv();

  const [rawPlan, setRawPlan] = useLocalStorage(PLANNER_STORAGE_KEY, buildEmptyPlan);
  const plan = useMemo(() => coercePlanShape(rawPlan), [rawPlan]);

  const [activeCell, setActiveCell] = useState(null); // { dayKey, slotKey } | null
  const [selectedRecipeId, setSelectedRecipeId] = useState("");

  const assignedRecipeIds = useMemo(() => {
    const ids = new Set();
    DAYS.forEach((d) => {
      SLOTS.forEach((s) => {
        const id = plan?.[d.key]?.[s.key];
        if (typeof id === "string" && id.trim()) ids.add(id);
      });
    });
    return ids;
  }, [plan]);

  const assignedCount = assignedRecipeIds.size;

  if (!plannerEnabled) {
    return (
      <section className="page">
        <h1 className="page__title">Planner</h1>
        <p className="page__description">
          The meal planner is currently disabled by feature flags.
        </p>

        <div className="placeholder-card" role="status" aria-label="Planner disabled">
          <div className="state__title">Planner disabled</div>
          <div className="state__subtitle">
            Enable it by including <strong>planner</strong> in{" "}
            <code>REACT_APP_FEATURE_FLAGS</code>.
          </div>
          <div className="detail-actions" style={{ marginTop: 12 }}>
            <Link className="btn" to="/">
              Go to Feed
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const openCell = (dayKey, slotKey) => {
    setActiveCell({ dayKey, slotKey });
    setSelectedRecipeId("");
  };

  const closePicker = () => {
    setActiveCell(null);
    setSelectedRecipeId("");
  };

  const assignSelectedRecipe = () => {
    if (!activeCell) return;
    if (!selectedRecipeId) return;

    setRawPlan((prev) => {
      const safePrev = coercePlanShape(prev);
      const next = { ...safePrev };
      next[activeCell.dayKey] = { ...safePrev[activeCell.dayKey] };
      next[activeCell.dayKey][activeCell.slotKey] = selectedRecipeId;
      return next;
    });

    closePicker();
  };

  const clearCell = (dayKey, slotKey) => {
    setRawPlan((prev) => {
      const safePrev = coercePlanShape(prev);
      const next = { ...safePrev };
      next[dayKey] = { ...safePrev[dayKey] };
      next[dayKey][slotKey] = null;
      return next;
    });
  };

  const clearAll = () => {
    setRawPlan(buildEmptyPlan());
    closePicker();
  };

  return (
    <section className="page">
      <h1 className="page__title">Planner</h1>
      <p className="page__description">
        Assign recipes to a simple weekly grid. Your plan is stored locally on this device.
      </p>

      <div className="results-bar" aria-label="Planner summary">
        <div className="results-bar__count">
          Planned <strong>{assignedCount}</strong> slot{assignedCount === 1 ? "" : "s"}
        </div>
        <button type="button" className="btn" onClick={clearAll}>
          Clear plan
        </button>
      </div>

      <div className="placeholder-card" aria-label="Weekly meal plan">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px repeat(7, minmax(0, 1fr))",
            gap: 10
          }}
        >
          <div aria-hidden="true" />
          {DAYS.map((d) => (
            <div
              key={d.key}
              style={{
                fontWeight: 950,
                fontSize: 13,
                letterSpacing: 0.2,
                padding: "8px 10px",
                borderRadius: 12,
                border: "1px solid var(--border-color)",
                background: "var(--surface)"
              }}
            >
              {d.label}
            </div>
          ))}

          {SLOTS.map((slot) => (
            <React.Fragment key={slot.key}>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 13,
                  padding: "10px 10px",
                  borderRadius: 12,
                  border: "1px solid var(--border-color)",
                  background: "var(--surface)"
                }}
              >
                {slot.label}
              </div>

              {DAYS.map((d) => {
                const recipeId = plan?.[d.key]?.[slot.key] || null;
                const snapshot = recipeId ? getRecipeSnapshot(recipeId) : null;

                return (
                  <div
                    key={`${d.key}-${slot.key}`}
                    style={{
                      borderRadius: 12,
                      border: "1px solid var(--border-color)",
                      background: "var(--surface)",
                      padding: 10,
                      minHeight: 74,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 8
                    }}
                    aria-label={`${d.label} ${slot.label}`}
                  >
                    {snapshot ? (
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 13, lineHeight: 1.2 }}>
                          {snapshot.title}
                        </div>
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: "rgba(40, 44, 52, 0.72)"
                          }}
                        >
                          {snapshot.cuisine || "—"} • {formatCookTime(snapshot.cookTimeMinutes)}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: 13,
                          color: "rgba(40, 44, 52, 0.72)"
                        }}
                      >
                        Empty
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => openCell(d.key, slot.key)}
                        aria-label={
                          snapshot ? `Change recipe for ${d.label} ${slot.label}` : `Add recipe for ${d.label} ${slot.label}`
                        }
                      >
                        {snapshot ? "Change" : "Add"}
                      </button>

                      {snapshot ? (
                        <>
                          <Link
                            className="btn btn--ghost"
                            to={`/recipes/${encodeURIComponent(snapshot.id)}`}
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() => clearCell(d.key, slot.key)}
                            aria-label={`Clear ${d.label} ${slot.label}`}
                          >
                            Clear
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {activeCell ? (
        <div className="placeholder-card" style={{ marginTop: 14 }} aria-label="Assign recipe">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="state__title">Assign a recipe</div>
              <div className="state__subtitle">
                {DAYS.find((d) => d.key === activeCell.dayKey)?.label} •{" "}
                {SLOTS.find((s) => s.key === activeCell.slotKey)?.label}
              </div>
            </div>

            <button type="button" className="btn btn--ghost" onClick={closePicker}>
              Close
            </button>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <label className="filters__field filters__field--grow" style={{ minWidth: 260 }}>
              <span className="filters__label">Recipe</span>
              <select
                className="select"
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
                aria-label="Select recipe"
              >
                <option value="">Select a recipe…</option>
                {mockRecipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="btn"
              onClick={assignSelectedRecipe}
              disabled={!selectedRecipeId}
              aria-disabled={!selectedRecipeId}
              aria-label="Assign selected recipe"
            >
              Assign
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
