


const errorHandler = (err, req, res, next)=>{

    
    const errorJson = {
        code: err.getStatusCode(),
        msg: err.getMessage(),
        timestamp: Date.now(),
        path: req.path
    }


    res
    .status(err.getStatusCode())
    .json(errorJson)
}

export default errorHandler;