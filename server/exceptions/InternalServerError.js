import BaseError from "./BaseError.js";

class InternalServerError extends BaseError{
    constructor(){

        super(503, "Internal Server Error")



    }
}

export default InternalServerError;