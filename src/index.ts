import {McpServer} from "@modelcontextprotocol/sdk/server/mcp"
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio"
import {z} from "zod";

const server = new McpServer({
    name: "currency-mcp-server",
    version: "1.2.0",
});

type FrankFurterResponse = {
    date: string;
    base: string;
    quote: string;
    rate: number;
}

type ExchangeRateResult = {
    from: string,
    to: string,
    rate: number,
    date: string,
}

type CurrencyConversionResult = {
    amount: number,
    from: string,
    to: string,
    rate: number,
    convertedAmount: number,
    date: string,
}

const currencyCodeSchema = z
.string()
.length(3)
.transform((value) => value.toUpperCase());


async function getExchangeRate(from: string, to: string): Promise<ExchangeRateResult> {
    const sourceCurrency = from.toUpperCase();
    const targetCurrency = to.toUpperCase();

    if(sourceCurrency === targetCurrency){
        return{
            from: sourceCurrency,
            to: targetCurrency,
            rate: 1,
            date: new Date().toISOString().slice(0,10),
        };
    }


    const url = `https://api.frankfurter.dev/v2/rate/${sourceCurrency}/${targetCurrency}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Currency API request failed with status ${response.status}: ${response.statusText}`
        );
    }

    const data = (await response.json()) as FrankFurterResponse;

    const rate = data.rate;

    if(!rate) {
        throw new Error(
            `No Exchange rate found for ${sourceCurrency} to ${targetCurrency}.`
        );
    }


    return {
        from: data.base.toUpperCase(),
        to: data.quote.toUpperCase(),
        rate: data.rate,
        date: data.date,
    };
}

server.registerTool(
    "get_exchange_rate",
    {
        description: "Get the live Exchange Rate between two currencies.",

        inputSchema:{
            from: currencyCodeSchema,
            to: currencyCodeSchema,
        },
    },

    async ({from, to}) => {
        try {
            const result = await getExchangeRate(from, to);

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
            const message = error instanceof Error ? error.message: "Unknown error occurred.";

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
            const message = error instanceof Error ? error.message : "Unknown error occurred.";

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