import BaseError from "./BaseError.js";

class ConflictException extends BaseError{
    constructor(message){

        super(409, message)



    }
}

export default ConflictException;