
import winston from "winston";
import * as path from "path";
import * as fs from "fs";

// Logger function
function createLogger(specFileName) {
    const logDir = "logs";

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    const logFileName = `${specFileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.log`;

    return winston.createLogger({
        transports: [
            new winston.transports.File({
                level: "error",
                filename: path.join(logDir, logFileName),
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
                handleExceptions: true,
            }),
            new winston.transports.File({
                level: "info",
                filename: path.join(logDir, logFileName),
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
                handleExceptions: true,
            }),
            new winston.transports.File({
                level: "warn",
                filename: path.join(logDir, logFileName),
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
                handleExceptions: true,
            }),
        ],
    });
}

// Example usage
const specFileName = "exampleSpecFile"; // Replace this with your actual spec file name
const logger = createLogger(specFileName);

export default logger;
