import BaseError from "./BaseError.js";

class DataBaseException extends BaseError{
    constructor(message){

        super(500, message)



    }
}

export default DataBaseException;