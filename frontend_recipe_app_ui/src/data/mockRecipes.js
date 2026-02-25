const nowIso = () => new Date().toISOString();

/**
 * Mock dataset for the Recipe Explorer app.
 *
 * Notes:
 * - Keep field names stable because the UI + API layer will rely on them.
 * - This shape is intentionally "API friendly" (ids, arrays, and normalized fields).
 */
export const mockRecipes = [
  {
    id: "r-001",
    title: "Lemon Garlic Salmon Bowl",
    description:
      "A bright, quick dinner bowl with roasted veggies and flaky salmon.",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    cuisine: "American",
    diet: ["Gluten-Free"],
    mealType: ["Dinner"],
    cookTimeMinutes: 25,
    servings: 2,
    difficulty: "Easy",
    tags: ["high-protein", "weeknight", "one-pan"],
    ingredients: [
      { name: "Salmon fillets", quantity: "2", unit: "fillets" },
      { name: "Lemon", quantity: "1", unit: "whole" },
      { name: "Garlic", quantity: "3", unit: "cloves" },
      { name: "Broccoli florets", quantity: "2", unit: "cups" },
      { name: "Olive oil", quantity: "2", unit: "tbsp" },
      { name: "Cooked rice", quantity: "2", unit: "cups" },
      { name: "Salt", quantity: "1", unit: "tsp" },
      { name: "Black pepper", quantity: "1/2", unit: "tsp" }
    ],
    steps: [
      "Preheat oven to 425°F (220°C).",
      "Toss broccoli with olive oil, salt, and pepper. Roast 10 minutes.",
      "Add salmon to the pan. Top with minced garlic and lemon zest.",
      "Roast 10–12 minutes until salmon is cooked through.",
      "Serve over rice and squeeze fresh lemon juice on top."
    ],
    nutrition: {
      calories: 540,
      proteinGrams: 38,
      carbsGrams: 52,
      fatGrams: 20
    },
    createdAt: nowIso(),
    updatedAt: nowIso()
  },
  {
    id: "r-002",
    title: "Chickpea Tikka Masala",
    description:
      "Creamy, spiced chickpeas simmered in a tomato-coconut sauce.",
    imageUrl: "https://images.unsplash.com/photo-1604908554027-78fca4f83e9b",
    cuisine: "Indian",
    diet: ["Vegetarian", "Dairy-Free"],
    mealType: ["Dinner"],
    cookTimeMinutes: 35,
    servings: 4,
    difficulty: "Easy",
    tags: ["meal-prep", "budget", "comfort"],
    ingredients: [
      { name: "Chickpeas", quantity: "2", unit: "cans" },
      { name: "Crushed tomatoes", quantity: "1", unit: "can" },
      { name: "Coconut milk", quantity: "1", unit: "can" },
      { name: "Onion", quantity: "1", unit: "medium" },
      { name: "Garlic", quantity: "4", unit: "cloves" },
      { name: "Ginger", quantity: "1", unit: "tbsp" },
      { name: "Garam masala", quantity: "2", unit: "tsp" },
      { name: "Turmeric", quantity: "1", unit: "tsp" },
      { name: "Salt", quantity: "1", unit: "tsp" }
    ],
    steps: [
      "Sauté diced onion until soft.",
      "Add garlic and ginger; cook 1 minute.",
      "Stir in spices, then add tomatoes and simmer 10 minutes.",
      "Add chickpeas and coconut milk; simmer 15 minutes.",
      "Serve with rice or naan and a squeeze of lime."
    ],
    nutrition: {
      calories: 420,
      proteinGrams: 16,
      carbsGrams: 48,
      fatGrams: 18
    },
    createdAt: nowIso(),
    updatedAt: nowIso()
  },
  {
    id: "r-003",
    title: "Avocado Toast with Chili-Lime",
    description: "Crispy toast topped with creamy avocado and a zesty kick.",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
    cuisine: "Californian",
    diet: ["Vegetarian"],
    mealType: ["Breakfast", "Snack"],
    cookTimeMinutes: 10,
    servings: 1,
    difficulty: "Easy",
    tags: ["quick", "no-fuss"],
    ingredients: [
      { name: "Bread", quantity: "2", unit: "slices" },
      { name: "Avocado", quantity: "1", unit: "whole" },
      { name: "Lime", quantity: "1/2", unit: "whole" },
      { name: "Chili flakes", quantity: "1/2", unit: "tsp" },
      { name: "Salt", quantity: "1/4", unit: "tsp" }
    ],
    steps: [
      "Toast bread until golden.",
      "Mash avocado with lime juice, salt, and chili flakes.",
      "Spread on toast and serve immediately."
    ],
    nutrition: {
      calories: 360,
      proteinGrams: 9,
      carbsGrams: 34,
      fatGrams: 22
    },
    createdAt: nowIso(),
    updatedAt: nowIso()
  },
  {
    id: "r-004",
    title: "Mediterranean Quinoa Salad",
    description: "Fresh, herby quinoa salad with cucumber, tomato, and feta.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    cuisine: "Mediterranean",
    diet: ["Vegetarian", "Gluten-Free"],
    mealType: ["Lunch"],
    cookTimeMinutes: 20,
    servings: 4,
    difficulty: "Easy",
    tags: ["fresh", "make-ahead"],
    ingredients: [
      { name: "Quinoa (dry)", quantity: "1", unit: "cup" },
      { name: "Cucumber", quantity: "1", unit: "medium" },
      { name: "Cherry tomatoes", quantity: "1.5", unit: "cups" },
      { name: "Feta", quantity: "1/2", unit: "cup" },
      { name: "Olive oil", quantity: "2", unit: "tbsp" },
      { name: "Lemon", quantity: "1", unit: "whole" },
      { name: "Parsley", quantity: "1/3", unit: "cup" }
    ],
    steps: [
      "Cook quinoa according to package directions; cool slightly.",
      "Chop cucumber and tomatoes; crumble feta.",
      "Toss quinoa with veggies, feta, olive oil, lemon juice, and parsley.",
      "Season to taste and chill before serving."
    ],
    nutrition: {
      calories: 310,
      proteinGrams: 11,
      carbsGrams: 34,
      fatGrams: 14
    },
    createdAt: nowIso(),
    updatedAt: nowIso()
  },
  {
    id: "r-005",
    title: "Spicy Black Bean Tacos",
    description: "Weeknight tacos with smoky black beans and crunchy slaw.",
    imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85",
    cuisine: "Mexican",
    diet: ["Vegan"],
    mealType: ["Dinner"],
    cookTimeMinutes: 20,
    servings: 3,
    difficulty: "Easy",
    tags: ["spicy", "family", "quick"],
    ingredients: [
      { name: "Black beans", quantity: "2", unit: "cans" },
      { name: "Taco seasoning", quantity: "2", unit: "tsp" },
      { name: "Corn tortillas", quantity: "10", unit: "tortillas" },
      { name: "Cabbage slaw mix", quantity: "3", unit: "cups" },
      { name: "Lime", quantity: "1", unit: "whole" },
      { name: "Hot sauce", quantity: "1", unit: "tbsp" }
    ],
    steps: [
      "Warm black beans in a pan with taco seasoning and a splash of water.",
      "Warm tortillas on a dry skillet.",
      "Toss slaw with lime juice and a pinch of salt.",
      "Assemble tacos with beans, slaw, and hot sauce."
    ],
    nutrition: {
      calories: 430,
      proteinGrams: 17,
      carbsGrams: 72,
      fatGrams: 8
    },
    createdAt: nowIso(),
    updatedAt: nowIso()
  },
  {
    id: "r-006",
    title: "Classic Chicken Noodle Soup",
    description: "Cozy soup with tender chicken, carrots, celery, and noodles.",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
    cuisine: "American",
    diet: [],
    mealType: ["Lunch", "Dinner"],
    cookTimeMinutes: 45,
    servings: 6,
    difficulty: "Medium",
    tags: ["comfort", "soup"],
    ingredients: [
      { name: "Chicken breast", quantity: "2", unit: "breasts" },
      { name: "Carrots", quantity: "2", unit: "whole" },
      { name: "Celery", quantity: "2", unit: "stalks" },
      { name: "Onion", quantity: "1", unit: "medium" },
      { name: "Egg noodles", quantity: "6", unit: "oz" },
      { name: "Chicken broth", quantity: "8", unit: "cups" },
      { name: "Bay leaf", quantity: "1", unit: "leaf" }
    ],
    steps: [
      "Sauté onion, carrots, and celery until softened.",
      "Add broth, bay leaf, and chicken; simmer 20 minutes.",
      "Remove chicken, shred, and return to pot.",
      "Add noodles and cook until tender."
    ],
    nutrition: {
      calories: 280,
      proteinGrams: 22,
      carbsGrams: 26,
      fatGrams: 9
    },
    createdAt: nowIso(),
    updatedAt: nowIso()
  }
];

/**
 * Simple category helpers derived from mock recipes.
 * Keeping this co-located allows UI to use it even before a real backend exists.
 */
export const mockCuisines = Array.from(new Set(mockRecipes.map((r) => r.cuisine))).sort();
export const mockDiets = Array.from(
  new Set(mockRecipes.flatMap((r) => r.diet))
).sort();
export const mockMealTypes = Array.from(
  new Set(mockRecipes.flatMap((r) => r.mealType))
).sort();

export default mockRecipes;
