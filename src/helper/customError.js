
exports.UnauthorizedError = class UnauthorizedError extends Error {
    constructor(message){
        super(message);
        this.name = 'unauthorizedError';
    }
}


exports.ForbiddenError = class ForbiddenError extends Error {
    constructor(message){
        super(message);
        this.name = 'forbiddenError';
    }
}

exports.ValidationError = class ValidationError extends Error {
    constructor(message){
        super(message);
        this.name = 'ValidationError';
    }
}

exports.ExistedError = class ExistedError extends Error{
    constructor(message){
        super(message);
        this.name= 'ExistedError'
    }
}