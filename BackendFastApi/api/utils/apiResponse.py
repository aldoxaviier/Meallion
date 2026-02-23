from typing import Any, Optional

class ApiResponse:
    @staticmethod
    def success(message: str, data: Any = None, status_code: int = 200):
        return {
            "message": message,
            "data": data,
            "statusCode": status_code
        }
    
    @staticmethod
    def error(message: str, status_code: int = 500):
        return {
            "message": message,
            "statusCode": status_code
        }
