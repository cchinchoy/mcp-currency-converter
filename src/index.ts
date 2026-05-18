import {McpServer} from "@modelcontextprotocol/sdk/server/mcp"
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio"
import {z} from "zod";
import type {CurrencyConversionResult} from "./types/currencyTypes.js";
import {currencyCodeSchema, exchangeRateSchema} from "./schemas/currencySchemas.js";
import { getExchangeRate } from "./services/currencyService.js";
import { logger } from "./utils/logger.js";
import { getErrorMessage } from "./utils/errorUtils.js";


const server = new McpServer({
    name: "currency-mcp-server",
    version: "1.5.0",
});
logger.info("Starting Currency MCP Server...", {
    version: "1.5.0",
});


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