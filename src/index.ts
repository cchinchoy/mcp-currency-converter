import {McpServer} from "@modelcontextprotocol/sdk/server/mcp"
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio"
import {z} from "zod";

const server = new McpServer({
    name: "currency-mcp-server",
    version: "1.1.0",
});

type FrankFurterResponse = {
    date: string;
    base: string;
    quote: string;
    rate: number;
}

async function getExchangeRate(base: string, quote: string): Promise<{
    rate: number;
    date:string;
}> {
    const sourceCurrency = base.toUpperCase();
    const targetCurrency = quote.toUpperCase();

    const url = `https://api.frankfurter.dev/v2/rate/${sourceCurrency}/${targetCurrency}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Currency API request failed with status ${response.status}: ${response.statusText}`
        );
    }

    const data = (await response.json()) as FrankFurterResponse;

    console.error(data);

    const rate = data.rate;

    if(!rate) {
        throw new Error(
            `No Exchange rate found for ${sourceCurrency} to ${targetCurrency}.`
        );
    }


    return {
        rate,
        date: data.date,
    };
}


server.registerTool(
    "convert_currency",
    {
        description: "Convert an amount from one currency to another using demo exchange rates.",

        inputSchema: {
            amount: z.number().positive(),
            from: z.string().length(3),
            to: z.string().length(3),
        },
    },

    async ({amount, from, to}) => {
        try{
            const sourceCurrency = from.toUpperCase();
            const targetCurrency = to.toUpperCase();

            const {rate, date} = await getExchangeRate(sourceCurrency, targetCurrency);

            const convertedAmount = amount * rate;

            return {
                content: [
                    {
                        type: "text",
                        text:
                        `${amount} ${sourceCurrency} = ` +
                        `${convertedAmount.toFixed(2)} ${targetCurrency} \n` +
                        `Exchange Rate: ${rate} \n` +
                        `Rate Date: ${date}.`,
                    },
                ],
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
            };
        }
    }
);

const transport = new StdioServerTransport();

await server.connect(transport);