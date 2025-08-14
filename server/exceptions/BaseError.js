class BaseError extends Error{

    statusCode;

    constructor(statusCode, message){

        super(message, null)
        this.statusCode = statusCode
    }

    getStatusCode(){
        return this.statusCode;
    }
    getMessage(){
        return this.message;
    }
}

export default BaseError;