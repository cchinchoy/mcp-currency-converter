import type {ExchangeRateResult, FrankFurterRateResponse} from "../types/currencyTypes.js";

import {getCurrentDateString} from "../utils/dateUtils.js";

import { appConfig } from "../config/appConfig.js";


export async function getExchangeRate(from: string, to: string): Promise<ExchangeRateResult> {
    const sourceCurrency = from.toUpperCase();
    const targetCurrency = to.toUpperCase();

    if(sourceCurrency === targetCurrency){
        return{
            from: sourceCurrency,
            to: targetCurrency,
            rate: 1,
            date: getCurrentDateString(),
        };
    }
        
    const url = `${appConfig.currencyApiBaseUrl}/rate/${sourceCurrency}/${targetCurrency}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Currency API request failed with status` + `${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as FrankFurterRateResponse;

    if(!data.rate){
        throw new Error(
            `No Exhcnage rate found for ${sourceCurrency} to ${targetCurrency}.`
        );
    }

    return {
        from: sourceCurrency,
        to: targetCurrency,
        rate: data.rate,
        date: getCurrentDateString(),
    };
}