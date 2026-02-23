from fastapi import APIRouter, HTTPException, Depends, Response
from api.service.recommendationService import get_recommendations_service
from api.middleware.authorization import get_current_user
from api.utils.apiResponse import ApiResponse

router = APIRouter(prefix="/recommendation")

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


