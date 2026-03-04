from core.database import supabase_client
import logging
import pandas as pd

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_recommendations_service(user_id):
    response_recipes = supabase_client.table("recipes").select("*").execute()
    response_recipes = response_recipes.model_dump()
    recipes_df = pd.DataFrame(response_recipes["data"])

    recipes_df['tags'] = (
        recipes_df['tags']
        .fillna('')                
        .str.strip()                          
        .str.split(r'\s*\|\s*')              
    )
    
    # Copy
    recipes_with_tags = recipes_df.copy(deep=True)

    # Explode the tags so each tag is its own row
    exploded = recipes_with_tags.explode("tags")

    # One-hot encode tags
    dummies = pd.get_dummies(exploded["tags"], dtype=float)   # <--- ensures 1.0 and 0.0

    # Group back to original shape
    recipes_with_tags = (
        exploded.drop(columns="tags")
        .join(dummies)
        .groupby(level=0)
        .max()
    )

    response_ratings = supabase_client.table("user_recipe_interactions").select("*").eq("user_id", user_id).execute()
    response_ratings = response_ratings.model_dump()
    ratings_df = pd.DataFrame(response_ratings["data"])
    ratings_df = ratings_df.drop(["id"], axis=1)
    user_tags_df = recipes_with_tags[recipes_with_tags.recipe_id.isin(ratings_df.recipe_id)]
    user_tags_df.reset_index(drop=True, inplace=True)
    user_tags_df = user_tags_df.drop(
        ["recipe_id","name","AuthorId","AuthorName","author_name",
         "CookTime","PrepTime","TotalTime","DatePublished",
         "Description","Images","RecipeIngredientQuantities",
         "RecipeIngredientParts","Calories","FatContent",
         "SaturatedFatContent","CholesterolContent","SodiumContent",
         "CarbohydrateContent","FiberContent","SugarContent","ProteinContent",
         "RecipeServings","RecipeInstructions","rating_score","rating_total","nan"
         ], axis=1)
    
    user_profile = user_tags_df.T.dot(ratings_df.score)

    recipes_with_tags = recipes_with_tags.set_index(recipes_with_tags.recipe_id)
    recipes_with_tags = recipes_with_tags.drop(["recipe_id","name","AuthorId","AuthorName","author_name","CookTime","PrepTime","TotalTime","DatePublished","Description","Images","RecipeIngredientQuantities","RecipeIngredientParts","Calories","FatContent","SaturatedFatContent","CholesterolContent","SodiumContent","CarbohydrateContent","FiberContent","SugarContent","ProteinContent","RecipeServings","RecipeInstructions","rating_score","rating_total","nan"], axis=1)
    

    recommendation_table_df = (recipes_with_tags.dot(user_profile)) / user_profile.sum()
    recommendation_table_df.sort_values(ascending=False, inplace=True)

    copy = recipes_df.copy(deep=True)
    copy = copy.set_index('recipe_id', drop=True)
    top_20_index = recommendation_table_df.index[:20].tolist()
    recommended_recipes = copy.loc[top_20_index, :]
    recommended_recipes = recommended_recipes.reset_index()
    recommended_recipes = recommended_recipes.fillna(0.0)
    return recommended_recipes.to_dict(orient="records")
    
