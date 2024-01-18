class response {
    static success(res, data, message = "Successfully Get Data",httpCode = 200) {
        res.status(httpCode).json({message,data})
    }
    static successWithPaging(res, data,page, message = "Successfully Get Data",httpCode = 200) {
        res.status(httpCode).json({message:message,data:data,page:page})
    }

    static error(res, message,httpCode = 200,errors = null) {
        res.status(httpCode).json({message,errors:errors})
    }
}

response.HTTP_OK = 200;
response.HTTP_UNAUTHORIZED = 401;
response.HTTP_FAILED = 400;
response.HTTP_NO_CONTENT_SEND = 204;
response.HTTP_SUCCESS_CREATED = 201;
response.HTTP_NOT_FOUND = 404;
response.HTTP_UNPROCESSABLE_ENTYTY =  422;
response.HTTP_INTERNAL_SERVER_ERROR = 500;
response.API_INVALID_LOGIN = "Invalid email or password";
response.API_LOGIN_SUCCESS = "Successfully Login";
response.API_GENERAL_ERROR = "Internal Server Error";
response.API_SAVE_SUCCESS = "Data saved successfully";
response.API_SAVE_FAILED = "Failed Created Data";
response.API_UPDATE_FAILED = "Failed Updated Data";
response.API_UPDATE_SUCCESS = "Data updated successfully";
response.API_DELETE_SUCCESS = "Data deleted successfully";
response.API_MESSAGE_DEFAULT = "Successfully Get Data";
response.API_DATA_NOT_FOUND = "Data not found";
response.API_RESOURCE_NOT_FOUND = "Resource not found"
response.API_INVALID_TOKEN = "Invalid token";

export default response