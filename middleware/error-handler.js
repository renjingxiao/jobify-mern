import {StatusCodes} from 'http-status-codes'

const errorHandlerMiddleware = (err,req,res,next) =>{
    console.log(err.massage)

    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INITERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, try again later',
    }
    if (err.name === 'ValidationError'){
        defaultError.statusCode= StatusCodes.BAD_REQUEST
        //defaultError.msg = err.message
        defaultError.msg = Object.values(err.errors)
        .map((item) => item.massage)
        .join(',')
    }
    if (err.code && err.code === 11000){
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = `${Object.keys(err.keyValue)} fiels has to be unique`
    }

    res.status(defaultError.statusCode).json({ msg:defaultError.msg })
}

export default errorHandlerMiddleware