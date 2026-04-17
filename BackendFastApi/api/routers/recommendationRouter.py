from fastapi import APIRouter, HTTPException, Depends, Response
from api.service.recommendationService import get_recommendations_service
from api.service.recommendationService import generate_meal_plan_service
from api.middleware.authorization import get_current_user
from api.utils.apiResponse import ApiResponse
from fastapi import Query
import logging
router = APIRouter(prefix="/recommendation")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
@router.get("/")
def get_recommendations(response: Response, user_id: int = Depends(get_current_user)):
    try:
        data = get_recommendations_service(user_id)
        response.status_code = 200
        return ApiResponse.success(
            message="Recommendations retrieved successfully",
            data=data,
            status_code=200
        )
    except Exception as e:
        # Catch any unexpected errors
        response.status_code = 500
        return ApiResponse.error(
            message=f"Unexpected error: {str(e)}",
            status_code=500
        )

@router.get("/generate-meal-plan")
def generate_meal_plan(
    allergies: list[str] = Query(...),
    diet_preferences: list[str] = Query(...),
    target_calories: int = Query(...),
    target_proteins: int = Query(...),
    target_carbs: int = Query(...),
    target_fats: int = Query(...),
    health_condition: list[str] = Query(...),
    days: int = Query(...),
    response: Response = None,
    user_id: int = Depends(get_current_user),
    ):
    try:
        logger.info(f"Generating meal plan for user_id: {user_id} with allergies: {allergies}, diet_preferences: {diet_preferences}, target_calories: {target_calories}, target_proteins: {target_proteins}, target_carbs: {target_carbs}, target_fats: {target_fats}, health_condition: {health_condition}, days: {days}")
        data = generate_meal_plan_service(user_id)
        response.status_code = 200
        return ApiResponse.success(
            message="Meal plan generated successfully",
            data=data,
            status_code=200
        )
    except Exception as e:
        # Catch any unexpected errors
        response.status_code = 500
        return ApiResponse.error(
            message=f"Unexpected error: {str(e)}",
            status_code=500
        )
