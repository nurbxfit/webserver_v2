const mongoose = require("mongoose")

exports.validateObjectId = (id) => {
    if(!mongoose.Types.ObjectId.isValid(id)){
        return new Error('Invalid ObjectId format');
    }
    return true;
}