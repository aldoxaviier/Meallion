from fastapi import FastAPI
from api.routers import recommendationRouter

app = FastAPI(title="Meallion Recommendation API")

# Register routers

app.include_router(recommendationRouter.router)