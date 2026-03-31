from fastapi import FastAPI
from api.routers import recommendationRouter
from api.routers import recipesRouter
app = FastAPI(title="Meallion Recommendation API")

# Register routers

app.include_router(recommendationRouter.router)
app.include_router(recipesRouter.router)