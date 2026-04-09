from core.database import supabase_client
import logging
import requests
from rapidfuzz import fuzz
from core.config import setting
import re
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def search_ingredients(query):
    results = []
    logger.info("No ingredients found, querying USDA API")
    url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    params = {
        "api_key": setting.USDA_API_KEY,
        "query": query,
        "pageSize": 10,
        "dataType": ["Foundation", "SR Legacy"],
    }
    response = requests.get(url, params=params)
    response = response.json()
    usda_data = response.get("foods", [])
    logger.info(f"foods : {usda_data}")
    simplified_names = supabase_client.rpc('get_distinct_simplified_names').execute();
    # best_food = get_best_match(ingredient["name"], usda_data["foods"])
    for food in usda_data:
        nutrients = food.get("foodNutrients", [])
        calories = next(
            (n["value"] for n in nutrients if "Energy" in n["nutrientName"] and n["unitName"] == "KCAL"),
            None
        )
        protein = next(
            (n["value"] for n in nutrients if n["nutrientName"] == "Protein"),
            None
        )
        fat = next(
            (n["value"] for n in nutrients if n["nutrientName"] == "Total lipid (fat)"),
            None
        )
        carbs = next(
            (n["value"] for n in nutrients if n["nutrientName"] == "Carbohydrate, by difference"),
            None
        )
        fiber = next(
            (n["value"] for n in nutrients if n["nutrientName"] == "Fiber, total dietary"),
            None
        )
        sugar = next(
            (n["value"] for n in nutrients if "Sugars" in n["nutrientName"]),
            None
        )
        sodium = next(
            (n["value"] for n in nutrients if n["nutrientName"] == "Sodium, Na"),
            None
        )
        cholesterol = next(
            (n["value"] for n in nutrients if n["nutrientName"] == "Cholesterol"),
            None
        )
        unit = food.get("servingSizeUnit", None)
        servingSize = food.get("servingSize", None)
        householdServing = food.get("householdServingFullText", None)
        simplified_name = get_best_simplified_name(food["description"], simplified_names)
        results.append({
            "original_name": food["description"],
            "simplified_name": simplified_name,
            "fdcId": food["fdcId"],
            "calories": calories,
            "protein": protein,
            "fat": fat,
            "carbohydrate": carbs,
            "fiber": fiber,
            "sugar": sugar,
            "sodium": sodium,
            "cholesterol": cholesterol,
        })
    return results

def clean(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text.strip()

def get_best_match(query, foods):
    best_score = -1
    best_food = None

    query_clean = clean(query)

    for food in foods:
        name = food["description"]
        name_clean = clean(name)

        score = fuzz.token_set_ratio(query_clean, name_clean)

        # word_penalty = len(name_clean.split()) * 2

        # final_score = score - word_penalty

        if score > best_score:
            best_score = score
            best_food = food

    return best_food

def get_best_simplified_name(name, simplified_names):
    name_clened = clean(name)
    best_score = -1
    best_name = None
    for item in simplified_names.data:
        score = fuzz.token_set_ratio(name_clened, item["simplified_name"])
        if score > best_score and score > 90:
            best_score = score
            best_name = item["simplified_name"]
    if best_name is None:
        best_name = name_clened
    return best_name