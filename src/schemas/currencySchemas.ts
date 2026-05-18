import {z} from "zod";

export const currencyCodeSchema = z
.string()
.length(3)
.transform((value) => value.toUpperCase());

export const currencyConversionSchema = {
    amount: z.number().positive(),
    from: currencyCodeSchema,
    to: currencyCodeSchema,
}

export const exchangeRateSchema = {
    from: currencyCodeSchema,
    to: currencyCodeSchema,
}