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