from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    SupabaseUrl: str
    SupabaseKey: str 
    JWT_SECRET: str
    model_config = {"env_file": ".env"}

setting = Settings()