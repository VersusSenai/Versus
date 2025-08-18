import BaseError from "./BaseError.js";

class NotAllowedException extends BaseError{
    constructor(message){

        super(401, message)



    }
}

export default NotAllowedException;