import {McpServer} from "@modelcontextprotocol/sdk/server/mcp"
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio"
import {z} from "zod";

const server = new McpServer({
    name: "currency-mcp-server",
    version: "1.0.0",
});

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
        const rates: Record<string, number> = {
            "USD-TT": 6.78,
            "TTD-USD": 0.1475,
            "USD-EUR": 0.92,
            "EUR-USD": 1.087
        };

        const sourceCurrency = from.toUpperCase();
        const targetCurrency = to.toUpperCase();

        const rateKey = `${sourceCurrency}-${targetCurrency}`;

        const rate = rates[rateKey];

        if (!rate){
            return {
                content: [
                    {
                        type: "text",
                        text: `No Exchange rate found for ${sourceCurrency} to ${targetCurrency}`,
                    },
                ],
            };
        }

        const convertedAmount = amount * rate;

        return {
            content: [
                {
                    type: "text",
                    text: `${amount} ${sourceCurrency} = ` +
                    `${convertedAmount.toFixed(2)} ${targetCurrency}\n` +
                    `Exchange Rate: ${rate}.`,
                },
            ],
        };
    }
);

const transport = new StdioServerTransport();

await server.connect(transport);