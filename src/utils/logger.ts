import { appConfig } from "../config/appConfig.js";

type LogLevel = "debug" | "info" | "warn" | "error";

function writeLog(level: LogLevel, message: string, meta?: unknown): void {
    const timestamp = new Date().toISOString();

    const logEntry = {
        timestamp,
        level,
        message,
        meta,
    };

    // IMPORTANT:
    //MCP Studio servers must not use console.log()
    // because stdout is reserved for MCP protocol messages. Instead, we write logs to stderr.
    console.error(JSON.stringify(logEntry));
}

export const logger = {
    info(message: string, meta?: unknown): void {
        writeLog("info", message, meta);
    },
    warn(message: string, meta?: unknown): void {
        writeLog("warn", message, meta);
    },
    error(message: string, meta?: unknown): void {
        writeLog("error", message, meta);
    },
    debug(message: string, meta?: unknown): void {
        if (appConfig.nodeEnv === "development") {
            writeLog("debug", message, meta);
        }
    },
};