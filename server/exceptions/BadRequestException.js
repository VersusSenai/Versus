import BaseError from "./BaseError.js";

class BadRequestException extends BaseError{
    constructor(message){

        super(400, message)



    }
}

export default BadRequestException;