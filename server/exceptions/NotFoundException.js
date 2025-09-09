import BaseError from "./BaseError.js";

class NotFoundException extends BaseError{
    constructor(message){

        super(404, message)



    }
}

export default NotFoundException;