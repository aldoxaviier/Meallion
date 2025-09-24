from fastapi import APIRouter, HTTPException, Depends
from api.service.recommendationService import get_recommendations_service
from api.middleware.authorization import get_current_user

router = APIRouter(prefix="/recommendation")

@router.get("/")
def get_recommendations(user_id: int = Depends(get_current_user)):
    try:
        return get_recommendations_service(user_id)
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )


