
const winston = require('winston');

const consoleFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.align()
)
//this acts like console.log but with our own logging format
exports.consoleinfo = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
    ]
})


exports.consoledebug = winston.createLogger({
    level:'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.cli({colors:{info:'blue'}}),
        })
    ]
})


exports.validationLogger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: '.logs/commons/validation.log'
        })
    ]
})


exports.dbLogger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            level : 'error',
            filename: '.logs/db/db-error.log'
        }),
        new winston.transports.File({
            level: 'info',
            filename: '.logs/db/db-info.log'
        })
    ]
})


exports.securityLogger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            level : 'error',
            filename : '.logs/security/Unauthorized-attempts.log'
        }),
        new winston.transports.File({
            level: 'warn',
            filename : '.logs/security/forbidden-attempts.log'

        })
    ]
})


exports.logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename : '.logs/commons/app-errors.log',
        })
    ]
})