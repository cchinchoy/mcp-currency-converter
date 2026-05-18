export type HealthCheckResult = {
    status: "ok" | "error";
    service: string;
    version: string;
    timestamp: string;
    currencyApiBaseUrl: string;
}

export type SupportedCurrency = {
    code: string;
    name: string;
}

export type SupportedCurrenciesResult = {
    currencies: SupportedCurrency[];
    count: number;
}


export type FrankFurterRateResponse = {
    date: string;
    base: string;
    quote: string;
    rate: number;
}

export type ExchangeRateResult = {
    from: string,
    to: string,
    rate: number,
    date: string,
}

export type CurrencyConversionResult = {
    amount: number,
    from: string,
    to: string,
    rate: number,
    convertedAmount: number,
    date: string,
}