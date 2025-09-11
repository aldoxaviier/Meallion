class ApiResponse {
  static success(message , data , statusCode) {
    return {
      message,
      data,
      statusCode
    };
  }

  static error(message , statusCode) {
    return {
      message,
      statusCode,
    };
  }
}

module.exports = ApiResponse;