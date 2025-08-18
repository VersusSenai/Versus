import BaseError from "./BaseError.js";

class MailError extends BaseError{
    constructor(message){

        super(503, message)



    }
}

export default MailError;