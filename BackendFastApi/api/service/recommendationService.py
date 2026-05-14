from core.database import supabase_client
import logging
import pandas as pd
import numpy as np
from numpy.linalg import norm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MEAL_SLOT_MAP = {
    "breakfast": ["Breakfast"],
    "lunch": ["Lunch", "Lunch/Dinner", "Lunch/Snacks"],
    "dinner": ["Dinner", "Lunch/Dinner"],
    "snack": ["Snack", "Snacks", "Lunch/Snacks"],
}

SLOT_RATIOS = {
    "breakfast": 0.25,
    "lunch": 0.35,
    "snack": 0.10,
    "dinner": 0.30,
}

NUTRITION_COLS = [
    "Calories",
    "ProteinContent",
    "CarbohydrateContent",
    "FatContent",
    "SugarContent",
    "SodiumContent",
    "CholesterolContent",
]

NON_TAG_COLS = [
    "recipe_id", "user_id", "name", "author_name",
    "CookTime", "PrepTime", "TotalTime", "DatePublished",
    "Description", "Images", "RecipeIngredientQuantities",
    "RecipeIngredientParts", "Calories", "FatContent",
    "SaturatedFatContent", "CholesterolContent", "SodiumContent",
    "CarbohydrateContent", "FiberContent", "SugarContent",
    "ProteinContent", "RecipeServings", "RecipeInstructions",
    "rating_score", "rating_total", "cloudinary_id"
]


def normalize_recipe_servings(df: pd.DataFrame):
    """
    Convert nutrition values into PER SERVING values.
    """

    df["RecipeServings"] = pd.to_numeric(
        df["RecipeServings"],
        errors="coerce"
    )

    df["RecipeServings"] = (
        df["RecipeServings"]
        .fillna(1)
        .replace(0, 1)
    )

    for col in NUTRITION_COLS:
        if col in df.columns:
            df[col] = (
                pd.to_numeric(df[col], errors="coerce")
                .fillna(0)
            )

            df[col] = df[col] / df["RecipeServings"]

    return df


def get_recommendations_service(user_id, limit=20):

    response_recipes = (
        supabase_client
        .table("recipes")
        .select("*")
        .execute()
    )

    response_recipes = response_recipes.model_dump()

    recipes_df = pd.DataFrame(response_recipes["data"])

    if recipes_df.empty:
        return []

    # NORMALIZE TO PER SERVING
    recipes_df = normalize_recipe_servings(recipes_df)

    recipes_df["tags"] = (
        recipes_df["tags"]
        .fillna("")
        .str.strip()
        .str.split(r"\s*\|\s*")
    )

    recipes_with_tags = recipes_df.copy(deep=True)

    exploded = recipes_with_tags.explode("tags")

    dummies = pd.get_dummies(
        exploded["tags"],
        dtype=float
    )

    recipes_with_tags = (
        exploded
        .drop(columns="tags")
        .join(dummies)
        .groupby(level=0)
        .max()
    )

    MEAL_TYPE_KEYWORDS = [
        "Breakfast",
        "Lunch",
        "Snack",
        "Dinner"
    ]

    meal_type_cols = [
        col for col in recipes_with_tags.columns
        if any(
            keyword.lower() in col.lower()
            for keyword in MEAL_TYPE_KEYWORDS
        )
    ]

    meal_type_df = recipes_with_tags[
        ["recipe_id"] + meal_type_cols
    ].copy()

    recipes_with_tags = recipes_with_tags.drop(
        columns=meal_type_cols
    )

    tag_matrix = recipes_with_tags.drop(
        columns=[
            c for c in NON_TAG_COLS
            if c in recipes_with_tags.columns
        ]
    )

    logger.info(f"Tag matrix columns: {tag_matrix.columns}")

    # TF-IDF
    tag_frequency = tag_matrix.sum(axis=0)

    idf = np.log(
        (len(tag_matrix) + 1) /
        (tag_frequency + 1)
    )

    tag_matrix = tag_matrix * idf

    recipes_with_tags[tag_matrix.columns] = tag_matrix

    # USER INTERACTIONS
    response_ratings = (
        supabase_client
        .table("user_recipe_interactions")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    response_ratings = response_ratings.model_dump()

    ratings_df = pd.DataFrame(response_ratings["data"])

    if ratings_df.empty:
        top_recipes = recipes_df.sample(
            min(limit, len(recipes_df))
        )

        return top_recipes.to_dict(orient="records")

    ratings_df = ratings_df.drop(["id"], axis=1)

    user_tags_df = recipes_with_tags[
        recipes_with_tags.recipe_id.isin(
            ratings_df.recipe_id
        )
    ].copy()

    user_tags_df.reset_index(drop=True, inplace=True)

    aligned_scores = (
        user_tags_df[["recipe_id"]]
        .merge(
            ratings_df[["recipe_id", "score"]],
            on="recipe_id",
            how="left"
        )
    )["score"].fillna(0)

    user_tags_df = user_tags_df.drop(
        columns=[
            c for c in NON_TAG_COLS
            if c in user_tags_df.columns
        ]
    )

    user_profile = user_tags_df.T.dot(aligned_scores)

    user_profile_norm = (
        user_profile /
        (norm(user_profile) + 1e-9)
    )

    recipes_with_tags = recipes_with_tags.set_index(
        recipes_with_tags.recipe_id
    )

    recipes_with_tags = recipes_with_tags.drop(
        columns=[
            c for c in NON_TAG_COLS
            if c in recipes_with_tags.columns
        ]
    )

    recipe_matrix = recipes_with_tags.values

    recipe_norms = norm(
        recipe_matrix,
        axis=1,
        keepdims=True
    )

    recipe_matrix_norm = (
        recipe_matrix /
        (recipe_norms + 1e-9)
    )

    recommendation_score = pd.Series(
        recipe_matrix_norm.dot(user_profile_norm),
        index=recipes_with_tags.index
    )

    popularity = (
        recipes_df
        .set_index("recipe_id")["rating_total"]
        .fillna(0)
    )

    popularity = (
        popularity - popularity.min()
    ) / (
        popularity.max() - popularity.min() + 1e-9
    )

    popularity = popularity.reindex(
        recommendation_score.index
    ).fillna(0)

    final_score = (
        0.8 * recommendation_score +
        0.2 * popularity
    )

    final_score = final_score.sort_values(
        ascending=False
    )

    top_100 = final_score.head(100)

    recommended_indices = top_100.sample(
        n=min(limit, len(top_100)),
        random_state=None
    ).index

    copy = recipes_df.copy(deep=True)

    copy = copy.set_index(
        "recipe_id",
        drop=True
    )

    recommended_recipes = copy.loc[
        recommended_indices, :
    ]

    recommended_recipes = (
        recommended_recipes
        .reset_index()
        .fillna(0.0)
    )

    recommended_recipes = recommended_recipes.merge(
        meal_type_df,
        on="recipe_id",
        how="left"
    )

    return recommended_recipes.to_dict(
        orient="records"
    )


def get_meal_slot_columns(df_columns, slot: str):

    keywords = MEAL_SLOT_MAP.get(slot, [])

    return [
        col for col in df_columns
        if any(
            kw.lower() in col.lower()
            for kw in keywords
        )
    ]


def filter_by_slot(df: pd.DataFrame, slot: str):

    slot_cols = get_meal_slot_columns(
        df.columns,
        slot
    )

    if not slot_cols:
        return df

    mask = df[slot_cols].any(axis=1)

    return df[mask]


def score_recipe(row, targets, slot_ratio):

    target_calories = (
        targets["calories"] * slot_ratio
    )

    target_protein = (
        targets["protein"] * slot_ratio
    )

    target_carbs = (
        targets["carbs"] * slot_ratio
    )

    target_fat = (
        targets["fat"] * slot_ratio
    )

    calorie_score = abs(
        row["Calories"] - target_calories
    ) / (target_calories + 1e-9)

    protein_score = abs(
        row["ProteinContent"] - target_protein
    ) / (target_protein + 1e-9)

    carbs_score = abs(
        row["CarbohydrateContent"] - target_carbs
    ) / (target_carbs + 1e-9)

    fat_score = abs(
        row["FatContent"] - target_fat
    ) / (target_fat + 1e-9)

    return (
        calorie_score * 0.4 +
        protein_score * 0.3 +
        carbs_score * 0.2 +
        fat_score * 0.1
    )


def apply_allergy_filter(
    df: pd.DataFrame,
    allergies: list[str]
):

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

    allergen_ingredient_ids = [
        row["id"]
        for row in ingredient_resp["data"]
    ]

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

    excluded_recipe_ids = {
        row["recipe_id"]
        for row in recipe_ing_resp["data"]
    }

    if not excluded_recipe_ids:
        return df

    return df[
        ~df["recipe_id"].isin(excluded_recipe_ids)
    ]


def apply_health_filter(
    df: pd.DataFrame,
    health_condition: str
):

    if not health_condition:
        return df

    hc = health_condition.lower()

    if hc == "diabetes":
        df = df[
            df["SugarContent"] * 4 <
            0.1 * df["Calories"]
        ]

    elif hc in [
        "blood pressure",
        "hypertension"
    ]:
        df = df[
            df["SodiumContent"] < 2000
        ]

    elif hc == "cholesterol":
        df = df[
            df["CholesterolContent"] < 275
        ]

    return df


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

    recommended_recipes = get_recommendations_service(
        user_id,
        limit=100
    )

    df = pd.DataFrame(recommended_recipes)

    if df.empty:
        return []

    # ALLERGY FILTER
    if allergies:
        df = apply_allergy_filter(
            df,
            allergies
        )

        if df.empty:
            return []

    # HEALTH FILTER
    df = apply_health_filter(
        df,
        health_condition
    )

    if df.empty:
        return []

    targets = {
        "calories": target_calories,
        "protein": target_proteins,
        "carbs": target_carbs,
        "fat": target_fats,
    }

    slots = [
        "breakfast",
        "lunch",
        "snack",
        "dinner"
    ]

    slot_pools = {}

    for slot in slots:

        slot_ratio = SLOT_RATIOS[slot]

        pool = filter_by_slot(df, slot)

        if pool.empty:
            pool = df.copy()

        pool = pool.copy()

        pool["score"] = pool.apply(
            lambda row: score_recipe(
                row,
                targets,
                slot_ratio
            ),
            axis=1
        )

        pool = pool.sort_values(
            "score"
        ).reset_index(drop=True)

        slot_pools[slot] = pool

    mealplan = []

    global_used_ids = set()

    for day in range(days):

        day_plan = {
            "day": day + 1,
            "meals": {}
        }

        for slot in slots:

            pool = slot_pools[slot]

            candidates = pool[
                ~pool["recipe_id"].isin(
                    global_used_ids
                )
            ]

            if candidates.empty:
                candidates = pool

            if candidates.empty:
                day_plan["meals"][slot] = None
                continue

            top_candidates = candidates.head(5)

            meal = (
                top_candidates
                .sample(1)
                .iloc[0]
            )

            # RECOMMENDED SERVING MULTIPLIER
            target_slot_calories = (
                targets["calories"] *
                SLOT_RATIOS[slot]
            )

            serving_multiplier = (
                target_slot_calories /
                (meal["Calories"] + 1e-9)
            )

            serving_multiplier = round(
                serving_multiplier,
                1
            )

            meal_dict = meal.to_dict()

            meal_dict["recommended_servings"] = max(
                0.5,
                serving_multiplier
            )

            global_used_ids.add(
                meal["recipe_id"]
            )

            day_plan["meals"][slot] = meal_dict

        mealplan.append(day_plan)

    return mealplan