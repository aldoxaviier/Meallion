from core.database import supabase_client
import logging
import pandas as pd
import numpy as np
from numpy.linalg import norm
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_recommendations_service(user_id, limit=20):
    response_recipes = supabase_client.table("recipes").select("*").execute()
    response_recipes = response_recipes.model_dump()
    recipes_df = pd.DataFrame(response_recipes["data"])

    recipes_df['tags'] = (
        recipes_df['tags']
        .fillna('')
        .str.strip()
        .str.split(r'\s*\|\s*')
    )

    recipes_with_tags = recipes_df.copy(deep=True)

    exploded = recipes_with_tags.explode("tags")

    dummies = pd.get_dummies(exploded["tags"], dtype=float)

    recipes_with_tags = (
        exploded.drop(columns="tags")
        .join(dummies)
        .groupby(level=0)
        .max()
    )

    MEAL_TYPE_KEYWORDS = ["Breakfast", "Lunch", "Snack", "Dinner"]

    meal_type_cols = [
        col for col in recipes_with_tags.columns
        if any(keyword.lower() in col.lower() for keyword in MEAL_TYPE_KEYWORDS)
    ]

    meal_type_df = recipes_with_tags[["recipe_id"] + meal_type_cols].copy()

    recipes_with_tags = recipes_with_tags.drop(columns=meal_type_cols)

    NON_TAG_COLS = [
        "recipe_id", "user_id", "name", "author_name",
        "CookTime", "PrepTime", "TotalTime", "DatePublished",
        "Description", "Images", "RecipeIngredientQuantities",
        "RecipeIngredientParts", "Calories", "FatContent",
        "SaturatedFatContent", "CholesterolContent", "SodiumContent",
        "CarbohydrateContent", "FiberContent", "SugarContent", "ProteinContent",
        "RecipeServings", "RecipeInstructions", "rating_score", "rating_total", "cloudinary_id"
    ]

    tag_matrix = recipes_with_tags.drop(
        columns=[c for c in NON_TAG_COLS if c in recipes_with_tags.columns]
    )

    logger.info(f"Tag matrix columns: {tag_matrix.columns}")

    tag_frequency = tag_matrix.sum(axis=0)
    idf = np.log((len(tag_matrix) + 1) / (tag_frequency + 1))
    tag_matrix = tag_matrix * idf

    recipes_with_tags[tag_matrix.columns] = tag_matrix

    response_ratings = supabase_client.table("user_recipe_interactions") \
        .select("*").eq("user_id", user_id).execute()
    response_ratings = response_ratings.model_dump()

    ratings_df = pd.DataFrame(response_ratings["data"])
    ratings_df = ratings_df.drop(["id"], axis=1)

    user_tags_df = recipes_with_tags[
    recipes_with_tags.recipe_id.isin(ratings_df.recipe_id)
    ].copy()
    user_tags_df.reset_index(drop=True, inplace=True)

    aligned_scores = (
        user_tags_df[["recipe_id"]]
        .merge(ratings_df[["recipe_id", "score"]], on="recipe_id", how="left")
    )["score"].fillna(0)

    user_tags_df = user_tags_df.drop(
        columns=[c for c in NON_TAG_COLS if c in user_tags_df.columns]
    )

    user_profile = user_tags_df.T.dot(aligned_scores)
    user_profile_norm = user_profile / (norm(user_profile) + 1e-9)

    recipes_with_tags = recipes_with_tags.set_index(recipes_with_tags.recipe_id)
    recipes_with_tags = recipes_with_tags.drop(
        columns=[c for c in NON_TAG_COLS if c in recipes_with_tags.columns]
    )
    recipe_matrix = recipes_with_tags.values
    recipe_norms = norm(recipe_matrix, axis=1, keepdims=True)
    recipe_matrix_norm = recipe_matrix / (recipe_norms + 1e-9)
    recommendation_score = pd.Series(
        recipe_matrix_norm.dot(user_profile_norm),
        index=recipes_with_tags.index
    )

    popularity = recipes_df.set_index("recipe_id")["rating_total"].fillna(0)
    popularity = (popularity - popularity.min()) / (popularity.max() - popularity.min() + 1e-9)
    popularity = popularity.reindex(recommendation_score.index).fillna(0)

    final_score = 0.8 * recommendation_score + 0.2 * popularity
    final_score = final_score.sort_values(ascending=False)

    top_100 = final_score.head(100)
    recommended_indices = top_100.sample(n=min(limit, len(top_100)), random_state=None).index

    copy = recipes_df.copy(deep=True)
    copy = copy.set_index('recipe_id', drop=True)

    recommended_recipes = copy.loc[recommended_indices, :]
    recommended_recipes = recommended_recipes.reset_index()
    recommended_recipes = recommended_recipes.fillna(0.0)

    recommended_recipes = recommended_recipes.merge(meal_type_df, on="recipe_id", how="left")

    return recommended_recipes.to_dict(orient="records")

MEAL_SLOT_MAP = {
    "breakfast": ["Breakfast"],
    "lunch":     ["Lunch", "Lunch/Dinner", "Lunch/Snacks"],
    "dinner":    ["Dinner", "Lunch/Dinner"],
    "snack":     ["Snack", "Snacks", "Lunch/Snacks"],
}

def get_meal_slot_columns(df_columns, slot: str) -> list[str]:
    """Return tag columns that match this meal slot."""
    keywords = MEAL_SLOT_MAP.get(slot, [])
    return [
        col for col in df_columns
        if any(kw.lower() in col.lower() for kw in keywords)
    ]

def filter_by_slot(df: pd.DataFrame, slot: str) -> pd.DataFrame:
    """Filter recipes that have any tag matching the meal slot."""
    slot_cols = get_meal_slot_columns(df.columns, slot)
    if not slot_cols:
        return df 
    mask = df[slot_cols].any(axis=1)
    return df[mask]

def generate_meal_plan_service(
    user_id,
    days,
    target_calories,
    target_proteins,
    target_carbs,
    target_fats,
    health_condition,
    allergies,
):
    recommended_recipes = get_recommendations_service(user_id, limit=100)
    df = pd.DataFrame(recommended_recipes)

    if df.empty:
        return []

    if allergies:
        df = apply_allergy_filter(df, allergies)
        if df.empty:
            return []

    df = apply_health_filter(df, health_condition)
    if df.empty:
        return []

    targets = {
        "calories": target_calories,
        "protein":  target_proteins,
        "carbs":    target_carbs,
        "fat":      target_fats,
    }
    df["score"] = df.apply(lambda row: score_recipe(row, targets), axis=1)
    df = df.sort_values("score").reset_index(drop=True)

    slots = ["breakfast", "lunch", "snack", "dinner"]
    slot_pools = {}
    for slot in slots:
        pool = filter_by_slot(df, slot)
        slot_pools[slot] = pool if not pool.empty else df

    mealplan = []
    global_used_ids = set()

    for day in range(days):
        day_plan = {"day": day + 1, "meals": {}}

        for slot in slots:
            pool = slot_pools[slot]
            candidates = pool[~pool["recipe_id"].isin(global_used_ids)]

            if candidates.empty:
                candidates = pool

            if candidates.empty:
                day_plan["meals"][slot] = None
                continue

            top_candidates = candidates.head(20)
            meal = top_candidates.sample(1).iloc[0]
            global_used_ids.add(meal["recipe_id"])
            day_plan["meals"][slot] = meal.to_dict()

        mealplan.append(day_plan)

    return mealplan

def apply_allergy_filter(df: pd.DataFrame, allergies: list[str]) -> pd.DataFrame:
    if not allergies:
        return df

    ingredient_resp = (
        supabase_client
        .table("ingredients_mapping")
        .select("id")
        .in_("simplified_name", allergies)
        .execute()
        .model_dump()
    )
    allergen_ingredient_ids = [row["id"] for row in ingredient_resp["data"]]

    if not allergen_ingredient_ids:
        return df  

    recipe_ing_resp = (
        supabase_client
        .table("recipe_ingredients")
        .select("recipe_id")
        .in_("ingredient_id", allergen_ingredient_ids)
        .execute()
        .model_dump()
    )
    excluded_recipe_ids = {row["recipe_id"] for row in recipe_ing_resp["data"]}

    if not excluded_recipe_ids:
        return df

    return df[~df["recipe_id"].isin(excluded_recipe_ids)]

def apply_health_filter(df: pd.DataFrame, health_condition: str):
    if not health_condition:
        return df

    hc = health_condition.lower()

    if hc == "diabetes":
        df = df[df["SugarContent"] * 4 < 0.1 * df["Calories"]]

    elif hc in ["blood pressure", "hypertension"]:
        df = df[df["SodiumContent"] < 2000]

    elif hc == "cholesterol":
        df = df[df["CholesterolContent"] < 275]

    return df


def score_recipe(row, targets):
    return (
        abs(row["Calories"] - targets["calories"]/3) +
        abs(row["ProteinContent"] - targets["protein"]/3) +
        abs(row["CarbohydrateContent"] - targets["carbs"]/3) +
        abs(row["FatContent"] - targets["fat"]/3)
    )


def pick_meal(df):
    if df.empty:
        return None
    return df.sample(1).to_dict(orient="records")[0]