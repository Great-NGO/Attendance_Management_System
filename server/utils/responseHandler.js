// Response Handler to handle all api responses

// const responseHandler = (res, message, statusCode, error=true, data={}) => {
//     res.status(statusCode).json({
//         success,
//         message,
//         data
//     })
// }

// Response Handler to handle all api responses

const responseHandler = (res, message, statusCode, success=false, data={}) => {
    res.status(statusCode).json({
        success,
        message,
        data
    })
}

// Success Response Handler to handle all api responses to successful requests
const handleSuccessResponse = (res, message, statusCode,  data={}, success=true, error=false, status="ok") => {
    res.status(statusCode).json({
        success,
        message,
        status,
        data
    })
}

// Error Response Handler to handle all api responses to unsuccessful requests
const handleErrorResponse = (res, message, statusCode, success=false, status="error") => {
    res.status(statusCode).json({
        success,
        error:message,
        status
    })
}


module.exports = {
    responseHandler,
    handleSuccessResponse,
    handleErrorResponse
}