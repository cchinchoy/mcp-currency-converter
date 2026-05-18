import {McpServer} from "@modelcontextprotocol/sdk/server/mcp"
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio"
import {z} from "zod";
import type {CurrencyConversionResult, HealthCheckResult} from "./types/currencyTypes.js";
import {currencyCodeSchema, exchangeRateSchema} from "./schemas/currencySchemas.js";
import { getExchangeRate, getSupportedCurrencies } from "./services/currencyService.js";
import { logger } from "./utils/logger.js";
import { getErrorMessage } from "./utils/errorUtils.js";
import { appConfig } from "./config/appConfig.js";


const server = new McpServer({
    name: "currency-mcp-server",
    version: "2.0.0",
});
logger.info("Starting Currency MCP Server...", {
    version: "2.0.0",
});

server.registerTool(
    "health_check",
    {
        description: "Perform a health check of the Currency MCP Server.",
        inputSchema: {},
    },
    async () => {
        const result: HealthCheckResult = {
            status: "ok",
            service: "Currency MCP Server",
            version: "2.0.0",
            timestamp: new Date().toISOString(),
            currencyApiBaseUrl: process.env.CURRENCY_API_BASE_URL ?? "Not Configured",
        };

        logger.info("Health check performed", {result});

        return {
            content: [
                {
                    type: "text",
                    text:
                    `Currency MCP Server Health Check\n` +
                    `Status: ${result.status}\n` +
                    `Service: ${result.service}\n` +
                    `Version: ${result.version}\n` +
                    `Timestamp: ${result.timestamp}\n` +
                    `Currency API Base URL: ${result.currencyApiBaseUrl}`,
                },
            ],
            structuredContent: {
                success: true,
                ...result,
            },
        };
    }
);


server.registerTool(
    "get_supported_currencies",
    {
        description: "Get a list of supported currencies from the Currency API.",
        inputSchema: {},
    },
    async () => {
        try {
            const result = await getSupportedCurrencies();
            logger.info("Supported currencies retrieved successfully", {count: result.count});

            const preview = result.currencies.slice(0, 10).map((currency) => `${currency.code} (${currency.name})`).join(", ");

            return {
                content: [
                    {
                        type: "text",
                        text:
                        `Supported Currencies: ${result.count}\n` +
                        `Total: ${result.count} \n\n` +
                        `Preview: ${preview}${result.count > 10 ? ", ..." : ""}`,
                    },
                ],
                structuredContent: {
                    success: true,
                    ...result,
                },
            };
        } catch (error) {
            const message = getErrorMessage(error);
            logger.error("Failed to retrieve supported currencies", {error: message,});

            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Failed to retrieve supported currencies: ${message}`,
                    },
                ],
                structuredContent: {
                    success: false,
                    error: message,
                },
            };
        }
    }
);

server.registerTool(
    "get_exchange_rate",
    {
        description: "Get the live Exchange Rate between two currencies.",

        inputSchema:exchangeRateSchema,
    },

    async ({from, to}) => {
        try {
            const result = await getExchangeRate(from, to);
            logger.info("Exchange rate lookup successful", {
                from: result.from,
                to: result.to,
                rate: result.rate,
                date: result.date,
            });

            return {
                content: [
                    {
                        type: "text",
                        text:
                        `Exchange Rate \n` +
                        `${result.from} to ${result.to}: ${result.rate} \n` +
                        `Rate Date: ${result.date}`,
                    },
                ],
                structuredContent: result,
            };
        } catch (error) {
            const message = getErrorMessage(error);
            logger.error("Exchange rate Lookup failed", {error: message,});

            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Exchange rate lookup failed: ${message}`,
                    },
                ],
                structuredContent: {
                    error: message,
                },
            };
        }
    }
);


server.registerTool(
    "convert_currency",
    {
        description: "Convert an amount from one currency to another using demo exchange rates.",

        inputSchema: {
            amount: z.number().positive(),
            from: currencyCodeSchema,
            to: currencyCodeSchema,
        },
    },

    async ({amount, from, to}) => {
        try{

            const exchangeRate = await getExchangeRate(from, to);

            const convertedAmount = Number((amount * exchangeRate.rate).toFixed(2));

            const result: CurrencyConversionResult = {
                amount,
                from: exchangeRate.from,
                to: exchangeRate.to,
                rate: exchangeRate.rate,
                convertedAmount,
                date: exchangeRate.date,
            }

            logger.info("Currency conversion successful", {
                amount: result.amount,
                from: result.from,
                to: result.to,
                rate: result.rate,
                convertedAmount: result.convertedAmount,
                date: result.date,
            });


            return {
                content: [
                    {
                        type: "text",
                        text:
                        `Currency Conversion \n ` +
                        `${result.amount} ${result.from} = ${result.convertedAmount} ${result.to} \n` +
                        `ExchangeRate: ${result.rate} \n` +
                        `Rate Date: ${result.date}`,
                    },
                ],
                structuredContent: result,
            };
        } catch (error) {
            const message = getErrorMessage(error);

            logger.error("Currency conversion failed", {error: message,});

            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Currency Conversion Failed: ${message}`,
                    },
                ],
                structuredContent: {
                    error: message,
                },
            };
        }
    }
);

const transport = new StdioServerTransport();

await server.connect(transport);