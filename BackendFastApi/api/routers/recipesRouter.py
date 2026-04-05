from fastapi import APIRouter, HTTPException, Depends, Response
from api.service.searchIngredients import search_ingredients
from api.middleware.authorization import get_current_user
from api.utils.apiResponse import ApiResponse
from fastapi import Body
router = APIRouter(prefix="/recipes")

@router.post("/search-ingredients")
def search_ingredients_endpoint(response: Response, query = Body(...)):
    try:
        data = search_ingredients(query)
        response.status_code = 200
        return ApiResponse.success(
            message="Ingredients searched successfully",
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