from fastapi import APIRouter, HTTPException, Depends, Response
from api.service.recommendationService import get_recommendations_service
from api.service.recommendationService import generate_meal_plan_service
from api.middleware.authorization import get_current_user
from api.utils.apiResponse import ApiResponse
from fastapi import Query
import logging
from pydantic import BaseModel
from typing import List, Optional

class MealPlanRequest(BaseModel):
    allergies: List[str]
    diet_preferences: List[str]
    target_calories: int
    target_proteins: int
    target_carbs: int
    target_fats: int
    health_condition: Optional[str] = None
    days: int

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

@router.post("/generate-meal-plan")
def generate_meal_plan(
    body: MealPlanRequest,
    response: Response,
    user_id: int = Depends(get_current_user)
):
    try:
        logger.info(
            f"Generating meal plan for user_id: {user_id} with "
            f"allergies: {body.allergies}, diet_preferences: {body.diet_preferences}, "
            f"target_calories: {body.target_calories}, target_proteins: {body.target_proteins}, "
            f"target_carbs: {body.target_carbs}, target_fats: {body.target_fats}, "
            f"health_condition: {body.health_condition}, days: {body.days}"
        )

        data = generate_meal_plan_service(
            user_id,
            body.days,
            body.target_calories,
            body.target_proteins,
            body.target_carbs,
            body.target_fats,
            body.health_condition,
            body.allergies
        )

        response.status_code = 200
        return ApiResponse.success(
            message="Meal plan generated successfully",
            data=data,
            status_code=200
        )

    except Exception as e:
        response.status_code = 500
        return ApiResponse.error(
            message=f"Unexpected error: {str(e)}",
            status_code=500
        )
